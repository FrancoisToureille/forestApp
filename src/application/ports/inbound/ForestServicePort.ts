import Forest from '../../../domain/models/Forest';
export interface ForestServicePort {
  get(uuid: string): Forest | null;
  update(uuid: string, forest: Forest): Forest;
  list(): Forest[];
  delete(uuid: string): void;
  save(forest: Omit<Forest, 'id'>): Forest;
}
