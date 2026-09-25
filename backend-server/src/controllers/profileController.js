const profileService = require('../services/profileService');
const userView = require('../views/userView');

async function updateProfile(req, res) {
  const user = await profileService.updateProfile(req.user, req.body);
  res.json(userView.formatUser(user));
}

async function changePassword(req, res) {
  const result = await profileService.changePassword(req.user, req.body);
  res.json(userView.formatMessage(result.message));
}

module.exports = {
  updateProfile,
  changePassword,
};
