const { getAllUsers, replaceAllUsers, setTodosForUser, findUserByEmail } = require('../services/userService');

async function saveUsers(req, res) {
  try {
    const users = req.body.users;
    await replaceAllUsers(users);
    res.send('User list saved successfully');
  } catch (error) {
    res.status(500).send('Error saving user list');
  }
}

async function getUsers(req, res) {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).send('Error retrieving user list');
  }
}

async function saveTodos(req, res) {
  try {
    const todos = req.body.todos;
    const userEmail = req.session.user.email;
    await setTodosForUser(userEmail, todos);
    res.send('New todos added successfully');
  } catch (error) {
    res.status(500).send('Error adding new todos');
  }
}

async function getTodos(req, res) {
  try {
    const userEmail = req.session.user.email;
    const user = await findUserByEmail(userEmail);
    if (user) {
      res.json(user.todos);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    res.status(500).send('Error retrieving todos');
  }
}

module.exports = {
  saveUsers,
  getUsers,
  saveTodos,
  getTodos,
};


