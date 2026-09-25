const express = require('express');
const categoryController = require('../controllers/categoryController');
const requireAuth = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.use(requireAuth);

router.get('/', asyncHandler(categoryController.listCategories));
router.post('/', asyncHandler(categoryController.createCategory));
router.patch('/:id', asyncHandler(categoryController.updateCategory));
router.delete('/:id', asyncHandler(categoryController.deleteCategory));

module.exports = router;
