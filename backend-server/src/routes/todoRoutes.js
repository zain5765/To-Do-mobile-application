const express = require('express');
const todoController = require('../controllers/todoController');
const { requireAuth } = require('../middleware/auth');
const { asyncHandler } = require('../utils/asyncHandler');

const router = express.Router();

router.get('/tags', requireAuth, asyncHandler(todoController.getTags));
router.get(
  '/overdue/reminders',
  requireAuth,
  asyncHandler(todoController.getOverdueReminders),
);
router.get('/', requireAuth, asyncHandler(todoController.getTodos));
router.post('/', requireAuth, asyncHandler(todoController.createTodo));
router.patch('/:id', requireAuth, asyncHandler(todoController.updateTodo));
router.delete('/:id', requireAuth, asyncHandler(todoController.deleteTodo));

module.exports = router;
