const authService = require('../services/authService');
const userView = require('../views/userView');

async function register(req, res) {
  const result = await authService.register(req.body);
  res.status(201).json(userView.formatAuthResponse(result.user, result.token));
}

async function login(req, res) {
  const result = await authService.login(req.body);
  res.json(userView.formatAuthResponse(result.user, result.token));
}

async function forgotPassword(req, res) {
  const result = await authService.forgotPassword(req.body);
  res.json(userView.formatMessage(result.message));
}

async function resetPassword(req, res) {
  const result = await authService.resetPassword(req.body);
  res.json(userView.formatMessage(result.message));
}

function me(req, res) {
  res.json(userView.formatUser(req.user));
}

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  me,
};
