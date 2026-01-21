import { TreeServicePort } from '../../application/ports/inbound/TreeServicePort';
import { Express, Response, Request } from 'express';

export class TreeController {
  constructor(private treeService: TreeServicePort) {}

  registerRoutes(app: Express) {
    app.get('/tree', this.listAllTrees.bind(this));
    app.get('/tree/:uuid', this.getTreeById.bind(this));
    app.post('/tree', this.createTree.bind(this));
    app.put('/tree/:uuid', this.updateTree.bind(this));
    app.delete('/tree/:uuid', this.deleteTree.bind(this));
  }

  listAllTrees(req: Request, res: Response) {
    const trees = this.treeService.list();
    res.status(200).send(trees);
  }

  getTreeById(req: Request, res: Response) {
    const uuid: string = req.params.uuid;
    const tree = this.treeService.get(uuid);
    if (tree) {
      res.status(200).send(tree);
    } else {
      res.status(404).send({ message: 'Tree not found' });
    }
  }

  createTree(req: Request, res: Response) {
    const treeData = req.body;
    const newTree = this.treeService.save(treeData);
    res.status(201).send(newTree);
  }

  updateTree(req: Request, res: Response) {
    const uuid: string = req.params.uuid;
    const treeData = req.body;
    const updatedTree = this.treeService.update(uuid, treeData);
    res.status(200).send(updatedTree);
  }

  deleteTree(req: Request, res: Response) {
    const uuid: string = req.params.uuid;
    this.treeService.delete(uuid);
    res.status(204).send();
  }
}
