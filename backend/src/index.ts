import express from 'express';
import pathwayRouter from 'routes/pathway';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const app = express();
const PORT = 8000;
const payloadSizeLimit = '50mb';

app.use(bodyParser.json({limit: payloadSizeLimit}));

mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true });

app.get('/', (req, res) => res.send('Pathways Backend'));
app.use('/pathway', pathwayRouter);
app.listen(PORT);
