import Forest from "../../../domain/models/Forest";

export interface ForestRepositoryPort {
  findAll(): Forest[];
  findbyId(uuid: string): Forest | null;
  update(forest: Forest): Forest;
  delete(uuid: string): void;
  insert(forest: Omit<Forest, 'id'>): Forest;
  findSpecies(uuid: string): string[];
}