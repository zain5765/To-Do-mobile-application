const categoryService = require('../services/categoryService');
const categoryView = require('../views/categoryView');

async function listCategories(req, res) {
  const categories = await categoryService.listCategories(req.user._id);
  res.json(categoryView.formatCategoryList(categories));
}

async function createCategory(req, res) {
  const category = await categoryService.createCategory(req.user._id, req.body);
  res.status(201).json(categoryView.formatCategory(category));
}

async function updateCategory(req, res) {
  const category = await categoryService.updateCategory(
    req.user._id,
    req.params.id,
    req.body,
  );
  res.json(categoryView.formatCategory(category));
}

async function deleteCategory(req, res) {
  await categoryService.deleteCategory(req.user._id, req.params.id);
  res.status(204).send();
}

module.exports = {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
