import cors from 'cors';
import express from 'express';

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

let items = [
  { id: 1, name: 'React Interview Prep', tag: 'frontend' },
  { id: 2, name: 'Docker Compose', tag: 'devops' },
  { id: 3, name: 'System Design', tag: 'architecture' },
];

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'nodejs-api',
    node: process.version,
    env: process.env.NODE_ENV ?? 'development',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/items', (_req, res) => {
  res.json({ data: items, total: items.length });
});

app.post('/api/items', (req, res) => {
  const name = String(req.body?.name ?? '').trim();
  if (!name) {
    return res.status(400).json({ error: 'name is required' });
  }

  const item = {
    id: items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1,
    name,
    tag: req.body?.tag ?? 'general',
  };

  items = [...items, item];
  return res.status(201).json({ data: item });
});

app.delete('/api/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const before = items.length;
  items = items.filter((item) => item.id !== id);

  if (items.length === before) {
    return res.status(404).json({ error: 'item not found' });
  }

  return res.status(204).send();
});

app.get('/', (_req, res) => {
  res.json({
    message: 'Node.js API sample — try /api/health, GET/POST /api/items',
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Node API listening on http://0.0.0.0:${PORT}`);
});
