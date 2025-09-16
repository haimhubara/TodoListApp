# TodoListApp

A simple Todo List application that allows users to create, manage, and track their tasks efficiently.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/haimhubara/TodoListApp.git
   cd TodoListApp
   npm install

2. Create a `.env` file in the project root with:
   ```env
   DATABASE_CONNECTION=<your_mongodb_connection_string>
   SESSION_SECRET=<strong_random_string>
   PORT=3000
   ```

   - MongoDB options:
     - MongoDB Atlas (recommended): create a cluster, user, and get the connection string.
     - Local MongoDB: e.g. `mongodb://localhost:27017/toDoList`

3. Start the server:
   ```bash
   npm run devStart
   ```

## Usage
  Open your browser and go to http://localhost:3000 to access the app.

## Features
Add, edit, and delete tasks

## Notes
- Passwords are hashed using bcrypt; existing plaintext users must re-register.
- If port is in use (EADDRINUSE), either kill the process on that port or change `PORT` in `.env`.
