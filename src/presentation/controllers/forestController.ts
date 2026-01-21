import { ForestServicePort } from '../../application/ports/inbound/ForestServicePort';
import { Express, Response, Request } from 'express';

export class ForestController {
  constructor(private forestService: ForestServicePort) {}
  registerRoutes(app: Express) {
    app.get('/forest', this.listAllForests.bind(this));
    app.get('/forest/:uuid', this.getForestById.bind(this));
    app.post('/forest', this.createForest.bind(this));
    app.put('/forest/:uuid', this.updateForest.bind(this));
    app.delete('/forest/:uuid', this.deleteForest.bind(this));
  }

  listAllForests(req: Request, res: Response) {
    const forests = this.forestService.list();
    res.status(200).send(forests);
  }

  getForestById(req: Request, res: Response) {
    const uuid: string = req.params.uuid;
    const forest = this.forestService.get(uuid);
    if (forest) {
      res.status(200).send(forest);
    } else {
      res.status(404).send({ message: 'Forest not found' });
    }
  }

  createForest(req: Request, res: Response) {
    const forestData = req.body;
    const newForest = this.forestService.save(forestData);
    res.status(201).send(newForest);
  }

  updateForest(req: Request, res: Response) {
    const uuid: string = req.params.uuid;
    const forestData = req.body;
    const updatedForest = this.forestService.update(uuid, forestData);
    res.status(200).send(updatedForest);
  }

  deleteForest(req: Request, res: Response) {
    const uuid: string = req.params.uuid;
    this.forestService.delete(uuid);
    res.status(204).send();
  }
}
