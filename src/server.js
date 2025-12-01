const express = require('express');
const cors = require('cors');
const { createIssueStore } = require('./issuesStore');

const PORT = process.env.PORT || 4000;

const app = express();
const store = createIssueStore();

app.use(cors());
app.use(express.json());

// Basic health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'node-mini-issue-tracker' });
});

// List issues with simple filtering + pagination
app.get('/api/v1/issues', (req, res) => {
  const { status, assignee, q, limit = '10', offset = '0' } = req.query;

  const pageSize = Math.min(parseInt(limit, 10) || 10, 50);
  const start = parseInt(offset, 10) || 0;

  const { items, total } = store.list({ status, assignee, q, limit: pageSize, offset: start });

  res.json({
    data: items,
    meta: {
      total,
      limit: pageSize,
      offset: start,
    },
  });
});

// Create issue
app.post('/api/v1/issues', (req, res) => {
  const { title, description, status = 'open', assignee = null, priority = 'medium' } = req.body || {};

  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'title is required' });
  }

  const issue = store.create({ title, description, status, assignee, priority });

  return res.status(201).json(issue);
});

// Get single issue
app.get('/api/v1/issues/:id', (req, res) => {
  const issue = store.get(req.params.id);

  if (!issue) {
    return res.status(404).json({ error: 'Issue not found' });
  }

  return res.json(issue);
});

// Update issue (partial)
app.patch('/api/v1/issues/:id', (req, res) => {
  const issue = store.update(req.params.id, req.body || {});

  if (!issue) {
    return res.status(404).json({ error: 'Issue not found' });
  }

  return res.json(issue);
});

// Delete issue
app.delete('/api/v1/issues/:id', (req, res) => {
  const deleted = store.remove(req.params.id);

  if (!deleted) {
    return res.status(404).json({ error: 'Issue not found' });
  }

  return res.status(204).send();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`node-mini-issue-tracker listening on http://localhost:${PORT}`);
});
