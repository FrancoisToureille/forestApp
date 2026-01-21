import { Tree } from '../../../domain/models/Tree';

export interface TreeRepositoryPort {
  findAll(): Tree[];
  findbyId(uuid: string): Tree | null;
  update(tree: Tree): Tree;
  delete(uuid: string): void;
  insert(tree: Omit<Tree, 'id'>): Tree;
}
