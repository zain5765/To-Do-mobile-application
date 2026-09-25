function formatTodo(todo) {
  return {
    id: todo._id.toString(),
    userId: todo.userId.toString(),
    title: todo.title,
    description: todo.description ?? null,
    completed: todo.completed,
    dueDate: todo.dueDate ? todo.dueDate.toISOString() : null,
    priority: todo.priority,
    tags: todo.tags ?? [],
    categoryId: todo.categoryId ? todo.categoryId.toString() : null,
    createdAt: todo.createdAt.toISOString(),
    updatedAt: todo.updatedAt.toISOString(),
  };
}

function formatTodoList(todos) {
  return todos.map(formatTodo);
}

function formatPaginatedTodos(todos, pagination) {
  return {
    todos: formatTodoList(todos),
    pagination,
  };
}

module.exports = {
  formatTodo,
  formatTodoList,
  formatPaginatedTodos,
};
