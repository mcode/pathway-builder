import express from 'express';
import pathwayRouter from 'routes/pathway';
import mongoose from 'mongoose';

const app = express();
const PORT = 8000;

mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true });

app.get('/', (req, res) => res.send('Pathways Backend'));
app.use('/pathway', pathwayRouter);
app.listen(PORT);
