import { Species } from '../domain/models/Species';
import { Tree } from '../domain/models/Tree';
import { Exposure } from '../domain/models/Exposure';
import { ForestService } from '../domain/services/ForestService';
import Forest from '../domain/models/Forest';
import { ForestType } from '../domain/models/ForestType';

type ForestTestContext = {
  service: ForestService;
  cleanup?: () => void | Promise<void>;
};

export const forestIntegrationTests = (
  suiteName: string,
  setup: () => ForestTestContext | Promise<ForestTestContext>,
) => {
  describe(suiteName, () => {
    let context: ForestTestContext;

    beforeEach(async () => {
      context = await setup();
    });

    afterEach(async () => {
      if (context.cleanup) {
        await context.cleanup();
      }
    });

    it('should create and retrieve a forest', async () => {
      const { service } = context;
      const newForest: Omit<Forest, 'id'> = {
        type: ForestType.TROPICAL,
        surface: 1000,
        trees: [],
      };
      service.save(newForest);
      const forests = service.list();
      expect(forests.length).toBeGreaterThan(0);
      const retrievedForest = service.get(forests[0].id);
      expect(retrievedForest).toEqual(expect.objectContaining(newForest));
    });

    it('should delete a forest', async () => {
      const { service } = context;
      const newForest: Omit<Forest, 'id'> = {
        type: ForestType.TROPICAL,
        surface: 30,
        trees: [],
      };
      const savedForest = service.save(newForest);
      service.delete(savedForest.id!);
      expect(() => service.get(savedForest.id!)).toThrowError(
        'Forest not found',
      );
    });

    it('should update a forest', async () => {
      const { service } = context;
      const newForest: Omit<Forest, 'id'> = {
        type: ForestType.TROPICAL,
        surface: 20,
        trees: [],
      };
      const savedForest = service.save(newForest);
      const updatedForest: Forest = {
        id: savedForest.id!,
        type: ForestType.TROPICAL,
        surface: 50,
        trees: [],
      };
      service.update(updatedForest.id, updatedForest);
      const retrievedForest = service.get(savedForest.id!);
      expect(retrievedForest).toEqual(expect.objectContaining(updatedForest));
    });
  });

  it('should handle errors when retrieving non-existent forest', async () => {
    const { service } = await setup();
    expect(() => service.get('non-existent-id')).toThrowError(
      'Forest not found',
    );
  });
};
