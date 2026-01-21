import { CO2AbsorptionServicePort } from '../../application/ports/inbound/CO2AbsorptionServicePort';
import { Express, Response, Request } from 'express';
import Forest from '../../domain/models/Forest';
import { ForestService } from '../../domain/services/ForestService';

export class CO2AbsorptionController {
  constructor(
    private co2AbsorptionService: CO2AbsorptionServicePort,
    private forestService: ForestService,
  ) {}
  registerRoutes(app: Express) {
    app.get('/co2/:uuid', this.listForestReportById.bind(this));
  }

  listForestReportById(req: Request, res: Response) {
    const uuid: string = req.params.uuid;
    const forest = this.forestService.get(uuid);
    if (!forest) {
      res.status(404).send({ message: 'Forest not found' });
      return;
    }
    const report = this.co2AbsorptionService.getReportAbsortionByYear(forest);
    if (report) {
      res.status(200).send(report);
    } else {
      res.status(404).send({ message: 'Forest report not found' });
    }
  }
}
