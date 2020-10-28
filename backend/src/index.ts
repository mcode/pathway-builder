import express from 'express';
import mongoose from 'mongoose';
import 'extensions/mongoose.extension';
import pathwayRouter from 'routes/pathway';
import criteriaRouter from 'routes/criteria';
import workspaceRouter from 'routes/workspace';
import resetRouter from 'routes/reset';
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

mongoose.connect('mongodb://localhost/pathway', { useNewUrlParser: true });

app.get('/', (req, res) => res.send('Pathways Backend'));
app.use('/pathway', pathwayRouter);
app.use('/criteria', criteriaRouter);
app.use('/workspace', workspaceRouter);
app.use('/reset', resetRouter);
app.listen(PORT);
