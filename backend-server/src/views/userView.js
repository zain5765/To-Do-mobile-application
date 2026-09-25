function formatUser(user) {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    createdAt: user.createdAt.toISOString(),
  };
}

function formatAuthResponse(user, token) {
  return {
    user: formatUser(user),
    token,
  };
}

function formatMessage(message) {
  return { message };
}

module.exports = {
  formatUser,
  formatAuthResponse,
  formatMessage,
};
