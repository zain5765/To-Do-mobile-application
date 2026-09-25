const express = require('express');
const profileController = require('../controllers/profileController');
const { requireAuth } = require('../middleware/auth');
const { asyncHandler } = require('../utils/asyncHandler');

const router = express.Router();

router.patch('/', requireAuth, asyncHandler(profileController.updateProfile));
router.patch(
  '/password',
  requireAuth,
  asyncHandler(profileController.changePassword),
);

module.exports = router;
