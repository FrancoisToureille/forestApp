import { TreeRepositoryAdapter } from '../infrastructure/adapters/treeRepositoryAdapter';
import { TreeService } from '../domain/services/TreeService';
import { Tree } from '../domain/models/Tree';
import { treeIntegrationTests } from './TreeIntegrationTests';

treeIntegrationTests('TreeInMemoryIntegration', () => {
  const repo = new TreeRepositoryAdapter();
  const service = new TreeService(repo);

  return { service };
});