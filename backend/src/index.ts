import express from 'express';

const app = express();
const PORT = 8000;
app.get('/', (req, res) => res.send('Pathways Backend'));
app.listen(PORT);
