import Forest from '../../../domain/models/Forest';

export interface CO2AbsorptionServicePort {
  getDiversityFactor(forest: Forest): number;
  getSurfaceNeeded(co2Amount: number): number; // co2Amount : tonnes //retour en hectares
  getTotalAbsorption(forest: Forest, diversityFactor: number): number;
  getReportAbsortionByYear(forest: Forest): string;
}
