const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');

function createApp() {
  const app = express();

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
  );

  app.use(express.static('Client'));
  app.set('view engine', 'ejs');
  app.use(methodOverride('_method'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(authRoutes);
  app.use(todoRoutes);

  return app;
}

module.exports = { createApp };


