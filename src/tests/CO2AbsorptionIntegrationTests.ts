import Forest from '../domain/models/Forest';
import { ForestService } from '../domain/services/ForestService';
import { ForestType } from '../domain/models/ForestType';
import { CO2AbsorptionService } from '../domain/services/CO2AbsorptionService';
import { Species } from '../domain/models/Species';
import { Tree } from '../domain/models/Tree';
import { Exposure } from '../domain/models/Exposure';
import { TreeService } from '../domain/services/TreeService';
type C02AbsorptionTestContext = {
  service: CO2AbsorptionService;
  serviceForest: ForestService;
  serviceTree: TreeService;
  cleanup?: () => void | Promise<void>;
};

export const co2AbsorptionIntegrationTests = (
  suiteName: string,
  setup: () => C02AbsorptionTestContext | Promise<C02AbsorptionTestContext>,
) => {
  describe(suiteName, () => {
    let context: C02AbsorptionTestContext;

    beforeEach(async () => {
      context = await setup();
    });

    afterEach(async () => {
      if (context.cleanup) {
        await context.cleanup();
      }
    });

    it('should create a forest and retrive the diversity factor', async () => {
      const { service } = context;
      const newTree: Omit<Tree, 'id'> = {
        birth: new Date('2020-01-01'),
        carbonStorageCapacity: 25,
        exposure: Exposure.SUNNY,
        species: Species.OAK,
      };

      let newTreeSaved = context.serviceTree.save(newTree);

      const newForest: Omit<Forest, 'id'> = {
        type: ForestType.TROPICAL,
        surface: 1000,
        trees: [newTreeSaved],
      };
      let forestCreated = context.serviceForest.save(newForest);

      context.service.getDiversityFactor(forestCreated);
      const diversityFactor = service.getDiversityFactor(forestCreated);
      expect(diversityFactor).toBe(1.1);
    });
    it('should create a forest and retrive the CO2 absorption', async () => {
      const { service } = context;
      const newTree1: Omit<Tree, 'id'> = {
        birth: new Date('2020-01-01'),
        carbonStorageCapacity: 25,
        exposure: Exposure.SUNNY,
        species: Species.OAK,
      };

      const newTree2: Omit<Tree, 'id'> = {
        birth: new Date('2019-05-15'),
        carbonStorageCapacity: 30,
        exposure: Exposure.MID_SHADOW,
        species: Species.ASH,
      };
      let newTreeSaved1 = context.serviceTree.save(newTree1);
      let newTreeSaved2 = context.serviceTree.save(newTree2);
      const newForest: Omit<Forest, 'id'> = {
        type: ForestType.TROPICAL,
        surface: 1000,
        trees: [newTreeSaved1, newTreeSaved2],
      };
      let forestCreated = context.serviceForest.save(newForest);
      const co2Absorption = service.getReportAbsortionByYear(forestCreated);
      expect(co2Absorption).toBe(
        `Absorption Report per Tree:\nTree ID: ${newTreeSaved1.id}, Species: OAK, Absorption: 30 tonnes/year\nTree ID: ${newTreeSaved2.id}, Species: ASH, Absorption: 36 tonnes/year\nTotal Absorption for Forest ID: ${forestCreated.id} is 66 tonnes/year\n`,
      );
    });
  });
};
