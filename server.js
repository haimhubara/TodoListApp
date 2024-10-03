const express = require("express");
const path = require("path");
const app = express();
const session = require("express-session");
const methodOverride = require("method-override");

const { MongoClient } = require('mongodb');
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function connectToMongoDB() {
  try {
      await client.connect();
      console.log('Connected to MongoDB');
      
      // Define the 'todos' collection
      const db = client.db("toDoList");
      await db.createCollection("users");
      console.log('Todos collection created');
  } catch (err) {
      console.error('Error connecting to MongoDB:', err);
  }
}

connectToMongoDB();



const todoSchema = {
  id: Date.now().toString(),
  name : String,
  email : String,
  password: String,
  todos: [{todo:String,id:String}],
};

async function insertUser(user) {
  try {
    // Connect to the MongoDB database
    const db = client.db("toDoList");
    
    // Access the 'users' collection
    const usersCollection = db.collection("users");
    
    // Insert the user object into the collection
    await usersCollection.insertOne(user);
    
    console.log('User inserted successfully');
  } catch (error) {
    console.error('Error inserting user:', error);
  }
}



app.use(
  session({
    secret: "your-secret-key", // Set a secret key for session encryption
    resave: false,
    saveUninitialized: true,
  })
);


const gmailRegex = /^[a-zA-Z0-9._]+@gmail\.com$/;

let registerErrorMessege = "";
let loginErrorMessege = "";

app.use(express.static("Client"));

app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.json());

app.use(express.urlencoded({extended:true}));

app.post("/register", async (req, res) => {
  try {
    // Check if the email is already registered
    const existingUser = await client.db('toDoList').collection('users').findOne({ email: req.body.email });
    if (existingUser) {
      throw new Error("User already registered");
    }
    if (req.session.user) {
      throw new Error("There is a user logged");
    }

    if (req.body.password !== req.body.repeatPassword) {
      throw new Error("Passwords do not match");
    }
    if (req.body.password.length <= 8 || req.body.repeatPassword.length <= 8) {
      throw new Error("Passwords length should be greater than 8");
    }
    if (!gmailRegex.test(req.body.email)) {
      throw new Error("Invalid email");
    }

    // Insert the user registration data into the MongoDB collection
    await insertUser({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      todos: [] // Initialize todos as an empty array
      
    });


    res.redirect("/login");
  } catch (error) {
    registerErrorMessege = error.message;
    console.error(error);
    res.redirect("/register");
  }
});

app.get("/getSession", async (req, res) => {
  try {
    // Check if the user session exists
    if (req.session && req.session.user) {
      // Retrieve session data
      const userEmail = req.session.user.email;
      const userName = req.session.user.name;
      let sessionData = req.session.user.todos;
      
      // You can retrieve any other session data you need
      // Send the session data as JSON response
      res.json({ userEmail: userEmail, userName: userName, todo: sessionData });
    } else {
      // Handle the case where the user is not logged in or the session does not exist
      res.status(404).send("Session not found");
    }
  } catch (error) {
    console.error("Error retrieving session data:", error);
    res.status(500).send("Error retrieving session data");
  }
});


app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Connect to MongoDB and select the 'users' collection
    const db = client.db("toDoList");
    const usersCollection = db.collection("users");

    // Find the user by email in the 'users' collection
    const user = await usersCollection.findOne({ email: email });

    if (!user) {
      throw new Error("User not found. Please register.");
    }

    // Check if the password matches
    if (user.password !== password) {
      throw new Error("Incorrect password. Please try again.");
    }
    // Fetch the user's todo list from the 'todos' collection
    const todos = user.todos;

    // If email and password are correct, store user details and todos in session
    req.session.user ={
      name: user.name,
      email: email,
      password: password,
      todos: todos // Store the todos in the session
    };
    

    // Redirect to the todos page or any other desired route
    res.redirect("/todos");
  } catch (error) {
    loginErrorMessege = error.message;
    console.error(error);
    res.redirect("/login");
  }
});



app.post("/saveUser", async (req, res) => {
  try {
    const users = req.body.users; // Assuming req.body.users is an array of user objects
    // Connect to MongoDB and select the 'users' collection
    const db = client.db("toDoList");
    const usersCollection = db.collection("users");

    // Delete existing users and insert the new users
    await usersCollection.deleteMany({});
    await usersCollection.insertMany(users);

    res.send("User list saved successfully");
  } catch (error) {
    console.error("Error saving user list:", error);
    res.status(500).send("Error saving user list");
  }
});

app.get("/getUsers", async (req, res) => {
  try {
    // Connect to MongoDB and select the 'users' collection
    const db = client.db("toDoList");
    const usersCollection = db.collection("users");

    // Retrieve users from MongoDB
    const users = await usersCollection.find({}).toArray();

    res.json(users); // Send the users as JSON response
  } catch (error) {
    console.error("Error retrieving user list:", error);
    res.status(500).send("Error retrieving user list");
  }
});

app.post("/saveTodos", async (req, res) => {
  try {
    const todos = req.body.todos; // Extract todos from the request body
    const userEmail = req.session.user.email; // Get the email of the logged-in user

    // Connect to MongoDB and select the 'users' collection
    const db = client.db("toDoList");
    const usersCollection = db.collection("users");

    // Set the user's todos array in the database to the new todos array
    await usersCollection.updateOne(
      { email: userEmail }, // Find the user by email
      { $set: { todos: todos } } // Set the todos array to the new todos
    );

    res.send("New todos added successfully");
  } catch (error) {
    console.error("Error adding new todos:", error);
    res.status(500).send("Error adding new todos");
  }
});







//Routes
app.get("/login", (req, res) => {
  
  // Send the HTML file directly
  registerErrorMessege = "";
  res.sendFile(path.join(__dirname, "Client", "LoginUser.html"));
});


app.get("/register", (req, res) => {
  // Send the HTML file directly
  loginErrorMessege = "";
  res.sendFile(path.join(__dirname, "Client", "RegisterUser.html"));
});

app.get("/todos", (req, res) => {
  // Send the HTML file directly
  res.sendFile(path.join(__dirname, "Client", "todos.html"));
});

//End Routes

//errors
app.get("/register/error", (req, res) => {
  res.send(registerErrorMessege);
});

// Route to handle login errors
app.get("/login/error", (req, res) => {
  res.send(loginErrorMessege );
});



app.get("/logout", (req, res) => {
  try {
    // Clear the session to log the user out
    req.session.destroy(err => {
       registerErrorMessege = "";
       loginErrorMessege = "";
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).send("Internal Server Error");
      }
      // Clear the todo items from local storage
     // localStorage.removeItem("todo");
      // Redirect the user to the login page
      res.redirect("/login");
    });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).send("Error logging out");
  }
});








process.on('SIGINT', async () => {
  try {
      await client.close();
      console.log('MongoDB connection closed');
      process.exit(0);
  } catch (err) {
      console.error('Error closing MongoDB connection:', err);
      process.exit(1);
  }
});


app.get("/get-title", (req, res) => {
  // Check if req.session.user exists and has an email property
  if (req.session.user && req.session.user.email) {
    // Send the user's email as the response
    res.send("Email: " + req.session.user.email);
  } else {
    // Handle the case where req.session.user or req.session.user.email is undefined
    res.status(404).send("User email not found");
  }
});

app.get("/get-name", (req, res) => {
  try {
    // Check if req.session.user exists and has a name property
    if (req.session.user && req.session.user.name) {
      // Send the user's name as the response
      res.send("Username: " + req.session.user.name);
    } else {
      // Handle the case where req.session.user or req.session.user.name is undefined
      res.status(404).send("Username not found");
    }
  } catch (error) {
    console.error("Error retrieving username:", error);
    res.status(500).send("Error retrieving username");
  }
});

app.get("/getTodos", async (req, res) => {
  try {
    // Extract the email of the logged-in user from the session
    const userEmail = req.session.user.email;

    // Connect to MongoDB and select the 'users' collection
    const db = client.db("toDoList");
    const usersCollection = db.collection("users");

    // Find the user by email in the 'users' collection
    const user = await usersCollection.findOne({ email: userEmail });

    // If user exists, send their todos as JSON response
    if (user) {
      res.json(user.todos);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error retrieving todos:", error);
    res.status(500).send("Error retrieving todos");
  }
});






app.listen(3000);