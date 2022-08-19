const users = {
  new: {
    username: "new-user",
    password: "new-user-pass",
    role: "user",
  },
  existing: {
    username: "well-known-user",
    password: "well-known-user-pass",
  },
  unexisting: {
    username: "unknown-user",
    password: "unknown-user-pass",
  },
};

module.exports = {
  users,
};
