import { Tree } from '../../../domain/models/Tree';

export interface TreeServicePort {
  get(uuid: string): Tree | null;
  update(uuid: string, tree: Tree): Tree;
  list(): Tree[];
  delete(uuid: string): void;
  save(tree: Omit<Tree, 'id'>): Tree;
}
