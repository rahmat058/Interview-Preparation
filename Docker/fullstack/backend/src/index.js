import cors from 'cors';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const items = [
  { id: 1, name: 'React Interview Prep', tag: 'frontend' },
  { id: 2, name: 'Docker Compose', tag: 'devops' },
  { id: 3, name: 'System Design', tag: 'architecture' },
];

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'fullstack-api',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/items', (_req, res) => {
  res.json({ data: items, total: items.length });
});

app.get('/', (_req, res) => {
  res.json({ message: 'Fullstack API — use /api/health or /api/items' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API listening on http://0.0.0.0:${PORT}`);
});
