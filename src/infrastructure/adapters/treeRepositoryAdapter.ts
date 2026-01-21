import { Tree } from '../../domain/models/Tree';
import { v4 as uuidv4 } from 'uuid';

export class TreeRepositoryAdapter {
  trees: Tree[] = [];

  findAll(): Tree[] {
    return this.trees;
  }

  insert(tree: Tree): Tree {
    const persistedTree: Tree = {
      id: uuidv4(),
      birth: tree.birth,
      species: tree.species,
      exposure: tree.exposure,
      carbonStorageCapacity: tree.carbonStorageCapacity,
    };
    this.trees.push(persistedTree);
    return persistedTree;
  }
  findbyId(uuid: string): Tree | null {
    const tree = this.trees.find((t) => t.id === uuid);
    return tree || null;
  }
  update(tree: Tree): Tree {
    const index = this.trees.findIndex((t) => t.id === tree.id);
    if (index !== -1) {
      this.trees[index] = tree;
      return tree;
    }
    throw new Error('Tree not found');
  }
  delete(uuid: string): void {
    this.trees = this.trees.filter((t) => t.id !== uuid);
  }
}
