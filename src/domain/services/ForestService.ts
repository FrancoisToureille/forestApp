import { ForestServicePort } from '../../application/ports/inbound/ForestServicePort';
import Forest from '../models/Forest';
import { NotFoundError } from '../errors/NotFoundError';
import { ForestRepositoryPort } from '../../application/ports/outbound/ForestRepositoryPort';

export class ForestService implements ForestServicePort {
  constructor(private readonly repo: ForestRepositoryPort) {}

  delete(uuid: string): void {
    const forest = this.repo.findbyId(uuid);
    if (!forest) {
      throw new NotFoundError('Forest not found');
    }
    this.repo.delete(uuid);
  }

  get(uuid: string): Forest {
    const forest = this.repo.findbyId(uuid);
    if (!forest) {
      throw new NotFoundError('Forest not found');
    }
    return forest;
  }

  list(): Forest[] {
    return this.repo.findAll();
  }

  save(forest: Omit<Forest, 'id'>): Forest {
    if (!forest.type) {
      throw new Error('Forest type must be defined');
    }
    if (forest.surface <= 0) {
      throw new Error('Forest surface must be greater than zero');
    }
    return this.repo.insert(forest);
  }

  update(uuid: string, forest: Forest): Forest {
    const existingForest = this.repo.findbyId(uuid);
    if (!existingForest) {
      throw new NotFoundError('Forest not found');
    }
    return this.repo.update(forest);
  }
  findSpecies(uuid: string): string[] {
    const forest = this.repo.findbyId(uuid);
    if (!forest) {
      throw new NotFoundError('Forest not found');
    }
    return this.repo.findSpecies(uuid);
  }
}
