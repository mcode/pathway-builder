import express from 'express';
import pathwayRouter from 'routes/pathway';

const app = express();
const PORT = 8000;
app.get('/', (req, res) => res.send('Pathways Backend'));
app.use('/pathway', pathwayRouter);
app.listen(PORT);
