import express from 'express';
import pathwayRouter from 'routes/pathway';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

// Fix Deprecation Warnings
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);

const app = express();
const PORT = 8000;
const payloadSizeLimit = '50mb';

app.use(bodyParser.json({ limit: payloadSizeLimit }));
app.use(cors());

mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true });

app.get('/', (req, res) => res.send('Pathways Backend'));
app.use('/pathway', pathwayRouter);
app.listen(PORT);
