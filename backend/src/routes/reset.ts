import { Router } from 'express';
import Pathway from 'models/pathway';
import Criteria from 'models/criteria';
import Workspace from 'models/workspace';
import { Response, Request } from 'express';
import { criteria as baseCriteria } from 'defaultData/criteria';
import { pathways as basePathways } from 'defaultData/pathways';
import { Model, Document } from 'mongoose';

const resetRouter = Router();

const resetData = <T extends Document>(
  model: Model<T>,
  defaultData: Array<object> | undefined,
  req: Request,
  res: Response
): void => {
  model.remove({}, (err) => {
    if (err) res.status(500).send('Error purging the table').end();
    else if (defaultData)
      model.insertMany(defaultData, (err, product) => {
        if (err) res.status(500).send('Error inserting new criteria').end();
        else res.status(200);
      });
  });
};

resetRouter.post('/', (req, res) => {
  resetData(Workspace, undefined, req, res);
  resetData(Criteria, baseCriteria, req, res);
  resetData(Pathway, basePathways, req, res);
  res.send();
});

export default resetRouter;
