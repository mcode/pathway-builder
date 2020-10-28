import { Model, Document } from 'mongoose';
import { Response, Request, Router } from 'express';

interface Handler<T extends Document> {
  model: Model<T>;
  req: Request;
  res: Response;
}

const getAllHandler = <T extends Document>({ model, res }: Handler<T>): void => {
  model.find({}, (err, product) => {
    if (err) res.status(500).send('Error getting all pathways');
    else res.status(200).send(product);
  });
};

const putByIdHandler = <T extends Document>({ model, req, res }: Handler<T>): void => {
  if (req.params.id !== req.body.id) res.status(409).send('Pathway id does not match URL id');
  model.findOneAndUpdate(
    // Issues with TypeScript generics make it hard to handle the filter query parameters elegantly
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/46550
    // https://github.com/microsoft/TypeScript/pull/30639
    { id: req.params.id } as object,
    req.body,
    { overwrite: true, new: true, upsert: true, rawResult: true },
    (err, product) => {
      if (err) res.status(500).send(err);
      else res.status(product.lastErrorObject.updatedExisting ? 200 : 201).send(product.value);
    }
  );
};

const deleteByIdHandler = <T extends Document>({ model, req, res }: Handler<T>): void => {
  model.deleteOne({ id: req.params.id } as object, (err) => {
    if (err) res.status(500).send(err);
    else res.status(200).send(`Deleted pathway ${req.params.id}`);
  });
};

const getByIdHandler = <T extends Document>({ model, req, res }: Handler<T>): void => {
  model.findOne({ id: req.params.id } as object, { _id: 0 }, (err, pathway) => {
    if (err) res.status(500).send(err);
    if (pathway) {
      res.status(200).send(pathway);
    } else res.status(404).send(pathway);
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
