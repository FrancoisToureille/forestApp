import { TreeRepositoryAdapter } from '../infrastructure/adapters/treeRepositoryAdapter';
import Forest from '../domain/models/Forest';
import { ForestService } from '../domain/services/ForestService';
import { forestIntegrationTests } from './ForestIntegrationTests';
import { ForestRepositoryAdapter } from '../infrastructure/adapters/forestRepositoryAdapter';
forestIntegrationTests('ForestInMemoryIntegration', () => {
  const repo = new ForestRepositoryAdapter();
  const service = new ForestService(repo);

  return { service };
});