const todoService = require('../services/todoService');
const todoView = require('../views/todoView');

async function getTags(req, res) {
  const tags = await todoService.getTags(req.user._id);
  res.json(tags);
}

async function getOverdueReminders(req, res) {
  const todos = await todoService.getOverdueReminders(req.user._id);
  res.json(todoView.formatTodoList(todos));
}

async function getTodos(req, res) {
  const result = await todoService.getTodos(req.user._id, req.query);
  res.json(todoView.formatPaginatedTodos(result.todos, result.pagination));
}

async function createTodo(req, res) {
  const todo = await todoService.createTodo(req.user._id, req.body);
  res.status(201).json(todoView.formatTodo(todo));
}

async function updateTodo(req, res) {
  const todo = await todoService.updateTodo(
    req.user._id,
    req.params.id,
    req.body,
  );
  res.json(todoView.formatTodo(todo));
}

async function deleteTodo(req, res) {
  await todoService.deleteTodo(req.user._id, req.params.id);
  res.status(204).send();
}

module.exports = {
  getTags,
  getOverdueReminders,
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
