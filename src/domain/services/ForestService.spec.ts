import { Tree } from '../models/Tree';
import Forest from '../models/Forest';
import { Species } from '../models/Species';
import { Exposure } from '../models/Exposure';
import { ForestService } from './ForestService';
import { ForestType } from '../models/ForestType';

describe('ForestService', () => {
  let repoMock: {
    findbyId: jest.Mock;
    findAll: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    insert: jest.Mock;
    findSpecies: jest.Mock;
  };
  let forestService: ForestService;

  beforeEach(() => {
    repoMock = {
      findbyId: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      insert: jest.fn(),
      findSpecies: jest.fn(),
    };
    forestService = new ForestService(repoMock);
  });

  it('should get the correct forest by UUID', () => {
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

    repoMock.findbyId.mockImplementation(
      (uuid: string) => forests.find((forest) => forest.id === uuid) || null,
    );

    const forest = forestService.get('2');

    expect(forest).toEqual(forests[1]);
    expect(repoMock.findbyId).toHaveBeenCalledWith('2');
  });

  it('should throw NotFoundError when forest UUID does not exist', () => {
    repoMock.findbyId.mockReturnValue(null);
    expect(() => forestService.get('non-existent-uuid')).toThrowError(
      'Forest not found',
    );
  });

  it('should list all forests', () => {
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
    repoMock.findAll.mockReturnValue(forests);
    const result = forestService.list();
    expect(result).toEqual(forests);
    expect(repoMock.findAll).toHaveBeenCalled();
  });

  it('should find all species in a forest', () => {
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

    repoMock.findbyId.mockReturnValue(forest);
    repoMock.findSpecies.mockReturnValue([
      Species.OAK,
      Species.ASH,
      Species.EVERGREEN_OAK,
    ]);
    const species = forestService.findSpecies('1');
    expect(species).toEqual([
      Species.OAK,
      Species.ASH,
      Species.EVERGREEN_OAK,
    ]);
    expect(repoMock.findSpecies).toHaveBeenCalledWith('1');
  });

  it('should save a valid forest', () => {
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

    const newForest: Omit<Forest, 'id'> = {
      type: ForestType.TROPICAL,
      trees: [trees[0], trees[1]],
      surface: 500,
    };
    repoMock.insert.mockReturnValue(newForest);
    const savedForest = forestService.save(newForest);
    expect(savedForest).toEqual(newForest);
    expect(repoMock.insert).toHaveBeenCalledWith(newForest);
  });

  it('should update a forest', () => {
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

    const existingForest: Forest = {
      id: '1',
      type: ForestType.TROPICAL,
      trees: [trees[0], trees[1]],
      surface: 500,
    };
    const updatedForest: Forest = {
      id: '1',
      type: ForestType.TROPICAL,
      trees: trees,
      surface: 600,
    };
    repoMock.findbyId.mockReturnValue(existingForest);
    repoMock.update.mockReturnValue(updatedForest);
    const result = forestService.update('1', updatedForest);
    expect(result).toEqual(updatedForest);
    expect(repoMock.findbyId).toHaveBeenCalledWith('1');
    expect(repoMock.update).toHaveBeenCalledWith(updatedForest);
  });

  it('should delete a forest by UUID', () => {
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

    const existingForest: Forest = {
      id: '1',
      type: ForestType.TROPICAL,
      trees: [trees[0], trees[1]],
      surface: 500,
    };
    repoMock.findbyId.mockReturnValue(existingForest);
    forestService.delete('1');
    expect(repoMock.findbyId).toHaveBeenCalledWith('1');
    expect(repoMock.delete).toHaveBeenCalledWith('1');
  });
});
