import { TreeRepositoryAdapter } from '../infrastructure/adapters/treeRepositoryAdapter';
import Forest from '../domain/models/Forest';
import { ForestService } from '../domain/services/ForestService';
import { CO2AbsorptionService } from '../domain/services/CO2AbsorptionService';
import { co2AbsorptionIntegrationTests } from './CO2AbsorptionIntegrationTests';
import { ForestRepositoryAdapter } from '../infrastructure/adapters/forestRepositoryAdapter';
import { TreeService } from '../domain/services/TreeService';
co2AbsorptionIntegrationTests('CO2AbsorptionInMemoryIntegration', () => {
  const repoForest = new ForestRepositoryAdapter();
  const repoTree = new TreeRepositoryAdapter();

  const service = new CO2AbsorptionService();
  const serviceForest = new ForestService(repoForest);
  const serviceTree = new TreeService(repoTree);

  return { service, serviceForest, serviceTree };
});