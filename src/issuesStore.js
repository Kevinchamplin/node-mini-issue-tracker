const { randomUUID } = require('crypto');

function createIssueStore() {
  /** @type {Record<string, any>} */
  const issues = {};

  function seed() {
    const sample = [
      {
        title: 'Can\'t submit contact form',
        description: 'Submission hangs on step 2 on mobile Safari.',
        status: 'open',
        assignee: 'kevin',
        priority: 'high',
      },
      {
        title: 'Improve error logging',
        description: 'Add structured logging for API failures.',
        status: 'in_progress',
        assignee: 'service-bot',
        priority: 'medium',
      },
    ];

    sample.forEach((item) => {
      const id = randomUUID();
      issues[id] = {
        id,
        ...item,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });
  }

  seed();

  function list({ status, assignee, q, limit, offset }) {
    let all = Object.values(issues);

    if (status) {
      all = all.filter((issue) => issue.status === status);
    }

    if (assignee) {
      all = all.filter((issue) => issue.assignee === assignee);
    }

    if (q) {
      const needle = String(q).toLowerCase();
      all = all.filter(
        (issue) =>
          issue.title.toLowerCase().includes(needle)
          || (issue.description && issue.description.toLowerCase().includes(needle)),
      );
    }

    const total = all.length;
    const items = all.slice(offset, offset + limit);

    return { items, total };
  }

  function get(id) {
    return issues[id] || null;
  }

  function create({ title, description, status, assignee, priority }) {
    const now = new Date().toISOString();
    const id = randomUUID();

    const issue = {
      id,
      title,
      description: description || '',
      status,
      assignee,
      priority,
      createdAt: now,
      updatedAt: now,
    };

    issues[id] = issue;

    return issue;
  }

  function update(id, patch) {
    const existing = issues[id];

    if (!existing) {
      return null;
    }

    const updated = {
      ...existing,
      ...patch,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };

    issues[id] = updated;

    return updated;
  }

  function remove(id) {
    if (!issues[id]) {
      return false;
    }

    delete issues[id];
    return true;
  }

  return {
    list,
    get,
    create,
    update,
    remove,
  };
}

module.exports = { createIssueStore };
