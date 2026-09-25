const Todo = require('../models/Todo');
const Category = require('../models/Category');

const PRIORITY_ORDER = { low: 1, medium: 2, high: 3 };

function buildStatusFilter(status) {
  const now = new Date();
  switch (status) {
    case 'pending':
      return { completed: false };
    case 'completed':
      return { completed: true };
    case 'overdue':
      return {
        completed: false,
        dueDate: { $ne: null, $lt: now },
      };
    default:
      return {};
  }
}

function buildSort(sort, order) {
  const direction = order === 'asc' ? 1 : -1;
  switch (sort) {
    case 'dueDate':
      return { dueDate: direction, createdAt: -1 };
    case 'priority':
      return { priority: direction, createdAt: -1 };
    case 'title':
      return { title: direction };
    default:
      return { createdAt: direction };
  }
}

async function getTags(userId) {
  const todos = await Todo.find({ userId }, 'tags');
  return [...new Set(todos.flatMap(t => t.tags ?? []))].sort();
}

async function getOverdueReminders(userId) {
  return Todo.find({
    userId,
    completed: false,
    dueDate: { $ne: null, $lt: new Date() },
  }).sort({ dueDate: 1 });
}

async function getTodos(userId, query) {
  const {
    status = 'all',
    search,
    sort = 'createdAt',
    order = 'desc',
    page = '1',
    limit = '10',
    tag,
    priority,
    categoryId,
  } = query;

  const filter = {
    userId,
    ...buildStatusFilter(status),
  };

  if (priority) filter.priority = priority;
  if (tag) filter.tags = tag;
  if (categoryId === 'none') filter.categoryId = null;
  else if (categoryId) filter.categoryId = categoryId;

  if (search?.trim()) {
    const q = search.trim();
    filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  let todos = await Todo.find(filter).sort(buildSort(sort, order));

  if (sort === 'priority') {
    todos = todos.sort((a, b) => {
      const diff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      return order === 'asc' ? diff : -diff;
    });
  }

  const total = todos.length;
  const paged = todos.slice(skip, skip + limitNum);

  return {
    todos: paged,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.max(1, Math.ceil(total / limitNum)),
    },
  };
}

async function createTodo(userId, data) {
  const { title, description, dueDate, priority, tags, categoryId } = data;

  if (!title?.trim()) {
    const error = new Error('Title is required');
    error.status = 400;
    throw error;
  }

  if (categoryId) {
    const category = await Category.findOne({ _id: categoryId, userId });
    if (!category) {
      const error = new Error('Category not found');
      error.status = 400;
      throw error;
    }
  }

  return Todo.create({
    userId,
    title: title.trim(),
    description: description?.trim() || null,
    dueDate: dueDate ? new Date(dueDate) : null,
    priority: priority || 'medium',
    tags: Array.isArray(tags) ? tags : [],
    categoryId: categoryId || null,
  });
}

async function updateTodo(userId, todoId, data) {
  const todo = await Todo.findOne({ _id: todoId, userId });
  if (!todo) {
    const error = new Error('Todo not found');
    error.status = 404;
    throw error;
  }

  const { title, description, completed, dueDate, priority, tags, categoryId } = data;

  if (title !== undefined) todo.title = title.trim();
  if (description !== undefined) todo.description = description?.trim() || null;
  if (completed !== undefined) todo.completed = completed;
  if (dueDate !== undefined) todo.dueDate = dueDate ? new Date(dueDate) : null;
  if (priority !== undefined) todo.priority = priority;
  if (tags !== undefined) todo.tags = tags;
  if (categoryId !== undefined) {
    if (categoryId) {
      const category = await Category.findOne({ _id: categoryId, userId });
      if (!category) {
        const error = new Error('Category not found');
        error.status = 400;
        throw error;
      }
      todo.categoryId = categoryId;
    } else {
      todo.categoryId = null;
    }
  }

  await todo.save();
  return todo;
}

async function deleteTodo(userId, todoId) {
  const result = await Todo.deleteOne({ _id: todoId, userId });
  if (result.deletedCount === 0) {
    const error = new Error('Todo not found');
    error.status = 404;
    throw error;
  }
}

module.exports = {
  getTags,
  getOverdueReminders,
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
