import { TreeServicePort } from '../../application/ports/inbound/TreeServicePort';
import { Tree } from '../models/Tree';
import { TreeRepositoryPort } from '../../application/ports/outbound/TreeRepositoryPort';
import { NotFoundError } from '../errors/NotFoundError';

export class TreeService implements TreeServicePort {
  constructor(private readonly repo: TreeRepositoryPort) {}

  delete(uuid: string): void {
    const tree = this.repo.findbyId(uuid);
    if (!tree) {
      throw new NotFoundError('Tree not found');
    }
    this.repo.delete(uuid);
  }

  get(uuid: string): Tree {
    const tree = this.repo.findbyId(uuid);
    if (!tree) {
      throw new NotFoundError('Tree not found');
    }
    return tree;
  }

  list(): Tree[] {
    return this.repo.findAll();
  }

  save(tree: Omit<Tree, 'id'>): Tree {
    if (tree.birth === null) {
      throw new Error('Tree birth date cannot be null');
    }
    if (tree.carbonStorageCapacity < 10 || tree.carbonStorageCapacity > 50) {
      throw new Error(
        'Carbon storage capacity must be between 10 and 50 kg/year',
      );
    }
    if (!tree.species) {
      throw new Error('Tree species must be defined');
    }
    if (!tree.exposure) {
      throw new Error('Tree exposure must be defined');
    }
    return this.repo.insert(tree);
  }

  update(uuid: string, tree: Tree): Tree {
    const existingTree = this.repo.findbyId(uuid);
    if (!existingTree) {
      throw new NotFoundError('Tree not found');
    }
    return this.repo.update(tree);
  }
}
