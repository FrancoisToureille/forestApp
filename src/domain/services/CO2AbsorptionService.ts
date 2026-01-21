import { CO2AbsorptionServicePort } from '../../application/ports/inbound/CO2AbsorptionServicePort';
import Forest from '../models/Forest';

export class CO2AbsorptionService implements CO2AbsorptionServicePort {
  getDiversityFactor(forest: Forest): number {
    const numberSpiecies = new Set<string>();
    forest.trees.forEach((tree) => numberSpiecies.add(tree.species));
    const diversityFactor = 1 + numberSpiecies.size * 0.1;
    return diversityFactor;
  }
  getSurfaceNeeded(co2Amount: number): number {
    return co2Amount / 222;
  }

  getTotalAbsorption(forest: Forest, diversityFactor: number): number {
    let total = 0;
    forest.trees.forEach((tree) => {
      total += tree.carbonStorageCapacity * diversityFactor;
    });
    return total;
  }

  getReportAbsortionByYear(forest: Forest): string {
    const diversityFactor = this.getDiversityFactor(forest);
    let report = 'Absorption Report per Tree:\n';
    forest.trees.forEach((tree) => {
      const absorption = tree.carbonStorageCapacity * diversityFactor;
      report += `Tree ID: ${tree.id}, Species: ${tree.species}, Absorption: ${absorption} tonnes/year\n`;
    });
    report += `Total Absorption for Forest ID: ${forest.id} is ${this.getTotalAbsorption(forest, diversityFactor)} tonnes/year\n`;
    return report;
  }
}
