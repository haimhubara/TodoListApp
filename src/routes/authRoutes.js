const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/authController');

router.get('/', (req, res) => res.redirect('/login'));
router.get('/login', renderLogin);
router.get('/register', renderRegister);
router.get('/todos', renderTodos);

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

router.get('/getSession', getSession);
router.get('/register/error', getRegisterError);
router.get('/login/error', getLoginError);
router.get('/get-title', getTitle);
router.get('/get-name', getName);

module.exports = router;


