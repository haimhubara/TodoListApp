const { getCollection } = require('../config/db');

async function createUser({ name, email, password }) {
  const users = getCollection('users');
  await users.insertOne({ name, email, password, todos: [] });
}

async function findUserByEmail(email) {
  const users = getCollection('users');
  return users.findOne({ email });
}

async function replaceAllUsers(usersArray) {
  const users = getCollection('users');
  await users.deleteMany({});
  if (usersArray && usersArray.length > 0) {
    await users.insertMany(usersArray);
  }
}

async function getAllUsers() {
  const users = getCollection('users');
  return users.find({}).toArray();
}

async function setTodosForUser(email, todos) {
  const users = getCollection('users');
  await users.updateOne({ email }, { $set: { todos } });
}

module.exports = {
  createUser,
  findUserByEmail,
  replaceAllUsers,
  getAllUsers,
  setTodosForUser,
};


