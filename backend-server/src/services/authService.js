const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validatePassword } = require('../utils/password');

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

async function register({ email, password, name }) {
  if (!email?.trim() || !password || !name?.trim()) {
    const error = new Error('Email, password, and name are required');
    error.status = 400;
    throw error;
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    const error = new Error(passwordError);
    error.status = 400;
    throw error;
  }

  const exists = await User.findOne({ email: email.trim().toLowerCase() });
  if (exists) {
    const error = new Error('Email already registered');
    error.status = 409;
    throw error;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    email: email.trim().toLowerCase(),
    password: hashed,
    name: name.trim(),
  });

  return { user, token: signToken(user._id) };
}

async function login({ email, password }) {
  if (!email?.trim() || !password) {
    const error = new Error('Email and password are required');
    error.status = 400;
    throw error;
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  return { user, token: signToken(user._id) };
}

async function forgotPassword({ email }) {
  if (!email?.trim()) {
    const error = new Error('Email is required');
    error.status = 400;
    throw error;
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (user) {
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();
    console.log(`Password reset token for ${user.email}: ${resetToken}`);
  }

  return { message: 'If an account exists, a reset link has been sent.' };
}

async function resetPassword({ token, password }) {
  if (!token || !password) {
    const error = new Error('Token and password are required');
    error.status = 400;
    throw error;
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    const error = new Error(passwordError);
    error.status = 400;
    throw error;
  }

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: new Date() },
  });

  if (!user) {
    const error = new Error('Invalid or expired reset token');
    error.status = 400;
    throw error;
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetToken = null;
  user.resetTokenExpiry = null;
  await user.save();

  return { message: 'Password reset successfully. You can sign in now.' };
}

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};
