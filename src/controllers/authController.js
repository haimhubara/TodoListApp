const path = require('path');
const bcrypt = require('bcrypt');
const { createUser, findUserByEmail } = require('../services/userService');

const gmailRegex = /^[a-zA-Z0-9._]+@gmail\.com$/;

let registerErrorMessege = '';
let loginErrorMessege = '';

function getRegisterError(req, res) {
  res.send(registerErrorMessege);
}

function getLoginError(req, res) {
  res.send(loginErrorMessege);
}

function renderLogin(req, res) {
  registerErrorMessege = '';
  res.sendFile(path.join(process.cwd(), 'Client', 'LoginUser.html'));
}

function renderRegister(req, res) {
  loginErrorMessege = '';
  res.sendFile(path.join(process.cwd(), 'Client', 'RegisterUser.html'));
}

function renderTodos(req, res) {
  res.sendFile(path.join(process.cwd(), 'Client', 'todos.html'));
}

async function register(req, res) {
  try {
    const existingUser = await findUserByEmail(req.body.email);
    if (existingUser) {
      throw new Error('User already registered');
    }
    if (req.session.user) {
      throw new Error('There is a user logged');
    }
    if (req.body.password !== req.body.repeatPassword) {
      throw new Error('Passwords do not match');
    }
    if (req.body.password.length <= 8 || req.body.repeatPassword.length <= 8) {
      throw new Error('Passwords length should be greater than 8');
    }
    if (!gmailRegex.test(req.body.email)) {
      throw new Error('Invalid email');
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await createUser({ name: req.body.name, email: req.body.email, password: hashedPassword });
    res.redirect('/login');
  } catch (error) {
    registerErrorMessege = error.message;
    res.redirect('/register');
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      throw new Error('User not found. Please register.');
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Incorrect password. Please try again.');
    }
    req.session.user = { name: user.name, email, todos: user.todos };
    res.redirect('/todos');
  } catch (error) {
    loginErrorMessege = error.message;
    res.redirect('/login');
  }
}

function logout(req, res) {
  req.session.destroy(err => {
    registerErrorMessege = '';
    loginErrorMessege = '';
    if (err) {
      return res.status(500).send('Internal Server Error');
    }
    res.redirect('/login');
  });
}

function getSession(req, res) {
  if (req.session && req.session.user) {
    const userEmail = req.session.user.email;
    const userName = req.session.user.name;
    const sessionData = req.session.user.todos;
    res.json({ userEmail, userName, todo: sessionData });
  } else {
    res.status(404).send('Session not found');
  }
}

function getTitle(req, res) {
  if (req.session.user && req.session.user.email) {
    res.send('Email: ' + req.session.user.email);
  } else {
    res.status(404).send('User email not found');
  }
}

function getName(req, res) {
  if (req.session.user && req.session.user.name) {
    res.send('Username: ' + req.session.user.name);
  } else {
    res.status(404).send('Username not found');
  }
}

module.exports = {
  register,
  login,
  logout,
  getSession,
  getRegisterError,
  getLoginError,
  renderLogin,
  renderRegister,
  renderTodos,
  getTitle,
  getName,
};


