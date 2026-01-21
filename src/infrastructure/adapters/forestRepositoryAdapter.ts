import Forest from '../../domain/models/Forest';
import { v4 as uuidv4 } from 'uuid';

export class ForestRepositoryAdapter {
  forests: Forest[] = [];

  findAll(): Forest[] {
    return this.forests;
  }

  insert(forest: Forest): Forest {
    const persistedForest: Forest = {
      id: uuidv4(),
      type: forest.type,
      trees: forest.trees,
      surface: forest.surface,
    };
    this.forests.push(persistedForest);
    return persistedForest;
  }
  findbyId(uuid: string): Forest | null {
    const forest = this.forests.find((f) => f.id === uuid);
    return forest || null;
  }
  update(forest: Forest): Forest {
    const index = this.forests.findIndex((f) => f.id === forest.id);
    if (index !== -1) {
      this.forests[index] = forest;
      return forest;
    }
    throw new Error('Forest not found');
  }
  delete(uuid: string): void {
    this.forests = this.forests.filter((f) => f.id !== uuid);
  }

  findSpecies(uuid: string): string[] {
    const forest = this.forests.find((f) => f.id === uuid);
    if (!forest) {
      throw new Error('Forest not found');
    }
    const speciesSet = new Set<string>();
    forest.trees.forEach((tree) => speciesSet.add(tree.species));
    return Array.from(speciesSet);
  }
}
