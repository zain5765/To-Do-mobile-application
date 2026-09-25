function formatCategory(category) {
  return {
    id: category._id.toString(),
    userId: category.userId.toString(),
    name: category.name,
    color: category.color,
    icon: category.icon ?? '📁',
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}

function formatCategoryList(categories) {
  return categories.map(formatCategory);
}

module.exports = {
  formatCategory,
  formatCategoryList,
};
