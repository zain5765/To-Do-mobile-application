const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

function validatePassword(password) {
  if (!PASSWORD_REGEX.test(password)) {
    return 'Password must be 8+ characters with upper, lower, and a number';
  }
  return null;
}

module.exports = { validatePassword };
