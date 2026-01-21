import { Species } from '../domain/models/Species';
import { Tree } from '../domain/models/Tree';
import { TreeService } from '../domain/services/TreeService';
import { Exposure } from '../domain/models/Exposure';

type TreeTestContext = {
  service: TreeService;
  cleanup?: () => void | Promise<void>;
};

export const treeIntegrationTests = (
  suiteName: string,
  setup: () => TreeTestContext | Promise<TreeTestContext>,
) => {
  describe(suiteName, () => {
    let context: TreeTestContext;

    beforeEach(async () => {
      context = await setup();
    });

    afterEach(async () => {
      if (context.cleanup) {
        await context.cleanup();
      }
    });

    it('should create and retrieve a tree', async () => {
      const { service } = context;
      const newTree: Omit<Tree, 'id'> = {
        birth: new Date('2020-01-01'),
        carbonStorageCapacity: 25,
        exposure: Exposure.SUNNY,
        species: Species.OAK,
      };
      service.save(newTree);
      const trees = service.list();
      expect(trees.length).toBeGreaterThan(0);
      const retrievedTree = service.get(trees[0].id!);
      expect(retrievedTree).toEqual(expect.objectContaining(newTree));
    });

    it('should delete a tree', async () => {
      const { service } = context;
      const newTree: Tree = {
        birth: new Date('2019-06-15'),
        carbonStorageCapacity: 30,
        exposure: Exposure.MID_SHADOW,
        species: Species.ASH,
      };
      const savedTree = service.save(newTree);
      service.delete(savedTree.id!);
      expect(() => service.get(savedTree.id!)).toThrowError('Tree not found');
    });

    it('should update a tree', async () => {
      const { service } = context;
      const newTree: Tree = {
        birth: new Date('2018-03-20'),
        carbonStorageCapacity: 20,
        exposure: Exposure.SHADOW,
        species: Species.BEECH,
      };
      const savedTree = service.save(newTree);
      const updatedTree: Tree = {
        ...savedTree,
        carbonStorageCapacity: 25,
      };
      service.update(updatedTree.id!, updatedTree);
      const retrievedTree = service.get(savedTree.id!);
      expect(retrievedTree).toEqual(expect.objectContaining(updatedTree));
    });
  });

  it('should handle errors when retrieving non-existent tree', async () => {
    const { service } = await setup();
    expect(() => service.get('non-existent-id')).toThrowError('Tree not found');
  });
};
