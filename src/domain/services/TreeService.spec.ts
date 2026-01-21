import { Tree } from '../models/Tree';
import { Species } from '../models/Species';
import { Exposure } from '../models/Exposure';
import { TreeService } from './TreeService';

describe('TreeService', () => {
  let repoMock: {
    findbyId: jest.Mock;
    findAll: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    insert: jest.Mock;
  };
  let treeService: TreeService;

  beforeEach(() => {
    repoMock = {
      findbyId: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      insert: jest.fn(),
    };
    treeService = new TreeService(repoMock);
  });

  it('should get the correct tree by UUID', () => {
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
    ];

    repoMock.findbyId.mockImplementation(
      (uuid: string) => trees.find((tree) => tree.id === uuid) || null,
    );

    const tree = treeService.get('2');

    expect(tree).toEqual(trees[1]);
    expect(repoMock.findbyId).toHaveBeenCalledWith('2');
  });

  it('should throw NotFoundError when tree UUID does not exist', () => {
    repoMock.findbyId.mockReturnValue(null);
    expect(() => treeService.get('non-existent-uuid')).toThrowError(
      'Tree not found',
    );
  });

  it('should list all trees', () => {
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
    ];
    repoMock.findAll.mockReturnValue(trees);
    const result = treeService.list();
    expect(result).toEqual(trees);
    expect(repoMock.findAll).toHaveBeenCalled();
  });

  it('should save a valid tree', () => {
    const newTree: Omit<Tree, 'id'> = {
      birth: new Date('2021-06-10'),
      species: Species.BEECH,
      exposure: Exposure.SHADOW,
      carbonStorageCapacity: 30,
    };
    repoMock.insert.mockReturnValue(newTree);
    const savedTree = treeService.save(newTree);
    expect(savedTree).toEqual(newTree);
    expect(repoMock.insert).toHaveBeenCalledWith(newTree);
  });

  it('should update a tree', () => {
    const existingTree: Tree = {
      id: '1',
      birth: new Date('2020-01-01'),
      species: Species.OAK,
      exposure: Exposure.SUNNY,
      carbonStorageCapacity: 100,
    };
    const updatedTree: Tree = {
      id: '1',
      birth: new Date('2020-01-01'),
      species: Species.FIR,
      exposure: Exposure.MID_SHADOW,
      carbonStorageCapacity: 120,
    };
    repoMock.findbyId.mockReturnValue(existingTree);
    repoMock.update.mockReturnValue(updatedTree);
    const result = treeService.update('1', updatedTree);
    expect(result).toEqual(updatedTree);
    expect(repoMock.findbyId).toHaveBeenCalledWith('1');
    expect(repoMock.update).toHaveBeenCalledWith(updatedTree);
  });

  it('should delete a tree by UUID', () => {
    const existingTree: Tree = {
      id: '1',
      birth: new Date('2020-01-01'),
      species: Species.OAK,
      exposure: Exposure.SUNNY,
      carbonStorageCapacity: 100,
    };
    repoMock.findbyId.mockReturnValue(existingTree);
    treeService.delete('1');
    expect(repoMock.findbyId).toHaveBeenCalledWith('1');
    expect(repoMock.delete).toHaveBeenCalledWith('1');
  });
});
