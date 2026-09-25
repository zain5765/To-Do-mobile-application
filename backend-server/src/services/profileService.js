const bcrypt = require('bcryptjs');
const { validatePassword } = require('../utils/password');

async function updateProfile(user, { name }) {
  if (!name?.trim()) {
    const error = new Error('Name is required');
    error.status = 400;
    throw error;
  }

  user.name = name.trim();
  await user.save();
  return user;
}

async function changePassword(user, { currentPassword, newPassword }) {
  if (!currentPassword || !newPassword) {
    const error = new Error('Current and new password are required');
    error.status = 400;
    throw error;
  }

  const passwordError = validatePassword(newPassword);
  if (passwordError) {
    const error = new Error(passwordError);
    error.status = 400;
    throw error;
  }

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) {
    const error = new Error('Current password is incorrect');
    error.status = 401;
    throw error;
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return { message: 'Password changed successfully' };
}

module.exports = {
  updateProfile,
  changePassword,
};
