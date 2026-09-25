const Category = require('../models/Category');
const Todo = require('../models/Todo');

async function listCategories(userId) {
  return Category.find({ userId }).sort({ name: 1 });
}

async function createCategory(userId, data) {
  const name = data.name?.trim();
  if (!name) {
    const error = new Error('Category name is required');
    error.status = 400;
    throw error;
  }

  const existing = await Category.findOne({ userId, name });
  if (existing) {
    const error = new Error('Category already exists');
    error.status = 409;
    throw error;
  }

  return Category.create({
    userId,
    name,
    color: data.color || '#4f6ef7',
    icon: data.icon || '📁',
  });
}

async function updateCategory(userId, categoryId, data) {
  const category = await Category.findOne({ _id: categoryId, userId });
  if (!category) {
    const error = new Error('Category not found');
    error.status = 404;
    throw error;
  }

  if (data.name !== undefined) {
    const name = data.name.trim();
    if (!name) {
      const error = new Error('Category name is required');
      error.status = 400;
      throw error;
    }
    category.name = name;
  }
  if (data.color !== undefined) category.color = data.color;
  if (data.icon !== undefined) category.icon = data.icon;

  await category.save();
  return category;
}

async function deleteCategory(userId, categoryId) {
  const result = await Category.deleteOne({ _id: categoryId, userId });
  if (result.deletedCount === 0) {
    const error = new Error('Category not found');
    error.status = 404;
    throw error;
  }

  await Todo.updateMany({ userId, categoryId }, { $set: { categoryId: null } });
}

module.exports = {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
