import { Model, Document } from 'mongoose';
import { Response, Request, Router } from 'express';
import { wrapData } from 'models/wrappedSchema';

interface ProductWithValue extends Document {
  value?: string;
}

interface Handler<T extends ProductWithValue> {
  model: Model<T>;
  req: Request;
  res: Response;
}

// https://docs.mongodb.com/manual/tutorial/project-fields-from-query-results/
// Do not include _id or __v
const defaultProjection = { __v: 0, _id: 0 };

const getAllHandler = <T extends Document>({ model, res }: Handler<T>): void => {
  model.find({}, defaultProjection, (err, product) => {
    if (err) res.status(500).send(`Error getting all ${model.modelName} instances`);
    else res.status(200).send(product.map((p) => (p as ProductWithValue).value));
  });
};

const putByIdHandler = <T extends Document>({ model, req, res }: Handler<T>): void => {
  if (req.params.id !== req.body.id) {
    res.status(409).send(`${model.modelName} id does not match URL id`);
  } else {
    model.findOneAndUpdate(
      // Issues with TypeScript generics make it hard to handle the
      // filter query parameters elegantly
      // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/46550
      // https://github.com/microsoft/TypeScript/pull/30639
      { id: req.params.id } as object,
      wrapData(req.body),
      { overwrite: true, new: true, upsert: true, rawResult: true, projection: defaultProjection },
      (err, product) => {
        if (err) res.status(500).send(err);
        else
          res
            .status(product.lastErrorObject.updatedExisting ? 200 : 201)
            .send((product.value as ProductWithValue).value);
      }
    );
  }
};

const deleteByIdHandler = <T extends Document>({ model, req, res }: Handler<T>): void => {
  model.deleteOne({ id: req.params.id } as object, (err) => {
    if (err) res.status(500).send(err);
    else res.status(200).send(`Deleted ${model.modelName} ${req.params.id}`);
  });
};

const getByIdHandler = <T extends Document>({ model, req, res }: Handler<T>): void => {
  model.findOne({ id: req.params.id } as object, defaultProjection, (err, document) => {
    if (err) res.status(500).send(err);
    if (document) {
      res.status(200).send((document as ProductWithValue).value);
    } else res.status(404).send();
  });
};

const addCrudRoutes = <T extends Document>(router: Router, model: Model<T>): void => {
  router.get('/', (req, res) => {
    getAllHandler({ model: model, req: req, res });
  });

  router.put('/:id', (req, res) => {
    putByIdHandler({ model: model, req: req, res: res });
  });

  router.delete('/:id', (req, res) => {
    deleteByIdHandler({ model: model, req: req, res: res });
  });

  router.get('/:id', (req, res) => {
    getByIdHandler({ model: model, req: req, res: res });
  });
};

export { getAllHandler, putByIdHandler, deleteByIdHandler, getByIdHandler, addCrudRoutes };
