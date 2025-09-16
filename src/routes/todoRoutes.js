const express = require('express');
const router = express.Router();
const { saveUsers, getUsers, saveTodos, getTodos } = require('../controllers/todoController');

router.get('/getUsers', getUsers);
router.post('/saveUser', saveUsers);
router.post('/saveTodos', saveTodos);
router.get('/getTodos', getTodos);

module.exports = router;


