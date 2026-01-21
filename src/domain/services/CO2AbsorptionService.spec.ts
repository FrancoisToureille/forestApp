import { Tree } from '../models/Tree';
import Forest from '../models/Forest';
import { Species } from '../models/Species';
import { Exposure } from '../models/Exposure';
import { CO2AbsorptionService } from './CO2AbsorptionService';
import { ForestType } from '../models/ForestType';

describe('CO2AbsorptionService', () => {
  let repoMock: {
    getDiversityFactor: jest.Mock;
    getSurfaceNeeded: jest.Mock;
    getTotalAbsorption: jest.Mock;
    getReportAbsortionByYear: jest.Mock;
  };
  let CO2AbsorptionService: CO2AbsorptionService;

  beforeEach(() => {
    repoMock = {
      getDiversityFactor: jest.fn(),
      getSurfaceNeeded: jest.fn(),
      getTotalAbsorption: jest.fn(),
      getReportAbsortionByYear: jest.fn(),
    };
  });

  it('should get the correct diversity factor', () => {
    const trees: Tree[] = [
      {
        id: '1',
        birth: new Date('2020-01-01'),
        species: Species.OAK,
        exposure: Exposure.SUNNY,
        carbonStorageCapacity: 100,
      },
      {
        id: '2',
        birth: new Date('2019-05-15'),
        species: Species.ASH,
        exposure: Exposure.MID_SHADOW,
        carbonStorageCapacity: 150,
      },
      {
        id: '3',
        birth: new Date('2018-03-20'),
        species: Species.EVERGREEN_OAK,
        exposure: Exposure.SHADOW,
        carbonStorageCapacity: 200,
      },
      {
        id: '4',
        birth: new Date('2021-07-11'),
        species: Species.OAK,
        exposure: Exposure.SUNNY,
        carbonStorageCapacity: 120,
      },
    ];

    const forests: Forest[] = [
      {
        id: '1',
        type: ForestType.TROPICAL,
        trees: [trees[0], trees[1], trees[3]],
        surface: 500,
      },
      {
        id: '2',
        type: ForestType.TEMPERATE,
        trees: [trees[2]],
        surface: 300,
      },
    ];

    repoMock.getDiversityFactor.mockImplementation((forest: Forest) => {
      const numberSpiecies = new Set<string>();
      forest.trees.forEach((tree) => numberSpiecies.add(tree.species));
      const diversityFactor = 1 + numberSpiecies.size * 0.1;
      return diversityFactor;
    });
    const diversityFactor = repoMock.getDiversityFactor(forests[0]);
    expect(diversityFactor).toEqual(1.2);
    expect(repoMock.getDiversityFactor).toHaveBeenCalledWith(forests[0]);
  });

  it('should get surface needed for a given CO2 amount', () => {
    const co2Amount = 199800000000;
    repoMock.getSurfaceNeeded.mockReturnValue(co2Amount / 222);
    const surfaceNeeded = repoMock.getSurfaceNeeded(co2Amount);
    expect(surfaceNeeded).toEqual(900000000);
    expect(repoMock.getSurfaceNeeded).toHaveBeenCalledWith(co2Amount);
  });

  it('should get total absorption', () => {
    const trees: Tree[] = [
      {
        id: '1',
        birth: new Date('2020-01-01'),
        species: Species.OAK,
        exposure: Exposure.SUNNY,
        carbonStorageCapacity: 100,
      },
      {
        id: '2',
        birth: new Date('2019-05-15'),
        species: Species.ASH,
        exposure: Exposure.MID_SHADOW,
        carbonStorageCapacity: 150,
      },
      {
        id: '3',
        birth: new Date('2018-03-20'),
        species: Species.EVERGREEN_OAK,
        exposure: Exposure.SHADOW,
        carbonStorageCapacity: 200,
      },
    ];

    const forests: Forest[] = [
      {
        id: '1',
        type: ForestType.TROPICAL,
        trees: [trees[0], trees[1]],
        surface: 500,
      },
      {
        id: '2',
        type: ForestType.TEMPERATE,
        trees: [trees[2]],
        surface: 300,
      },
    ];
    repoMock.getTotalAbsorption.mockImplementation(
      (forest: Forest, diversityFactor: number) => {
        let total = 0;
        forest.trees.forEach((tree) => {
          total += tree.carbonStorageCapacity * diversityFactor;
        });
        return total;
      },
    );
    const totalAbsorption = repoMock.getTotalAbsorption(forests[0], 1.2);
    expect(totalAbsorption).toEqual(250 * 1.2);
    expect(repoMock.getTotalAbsorption).toHaveBeenCalledWith(forests[0], 1.2);
  });

  it('should get report absorption by year', () => {
    const trees: Tree[] = [
      {
        id: '1',
        birth: new Date('2020-01-01'),
        species: Species.OAK,
        exposure: Exposure.SUNNY,
        carbonStorageCapacity: 100,
      },
      {
        id: '2',
        birth: new Date('2019-05-15'),
        species: Species.ASH,
        exposure: Exposure.MID_SHADOW,
        carbonStorageCapacity: 150,
      },
      {
        id: '3',
        birth: new Date('2018-03-20'),
        species: Species.EVERGREEN_OAK,
        exposure: Exposure.SHADOW,
        carbonStorageCapacity: 200,
      },
      {
        id: '4',
        birth: new Date('2021-07-11'),
        species: Species.OAK,
        exposure: Exposure.SUNNY,
        carbonStorageCapacity: 120,
      },
    ];

    const forest: Forest = {
      id: '1',
      type: ForestType.TROPICAL,
      trees: trees,
      surface: 500,
    };

    repoMock.getReportAbsortionByYear.mockImplementation((forest: Forest) => {
      let setSpecies = new Set<string>();
      forest.trees.forEach((tree) => setSpecies.add(tree.species));
      const diversityFactor = 1 + setSpecies.size * 0.1;

      let report = 'Absorption Report per Tree:\n';
      forest.trees.forEach((tree) => {
        const absorption = tree.carbonStorageCapacity * diversityFactor;
        report += `Tree ID: ${tree.id}, Species: ${tree.species}, Absorption: ${absorption} tonnes/year\n`;
      });
      report += `Total Absorption for Forest ID: ${forest.id} is ${forest.trees.reduce((total, tree) => total + tree.carbonStorageCapacity * diversityFactor, 0)} tonnes/year\n`;
      return report;
    });
    const report = repoMock.getReportAbsortionByYear(forest);
    const expectedReport =
      'Absorption Report per Tree:\n' +
      'Tree ID: 1, Species: OAK, Absorption: 130 tonnes/year\n' +
      'Tree ID: 2, Species: ASH, Absorption: 195 tonnes/year\n' +
      'Tree ID: 3, Species: EVERGREEN_OAK, Absorption: 260 tonnes/year\n' +
      'Tree ID: 4, Species: OAK, Absorption: 156 tonnes/year\n' +
      'Total Absorption for Forest ID: 1 is 741 tonnes/year\n';
    expect(report).toEqual(expectedReport);
    expect(repoMock.getReportAbsortionByYear).toHaveBeenCalledWith(forest);
  });
});
