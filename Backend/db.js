// server.js

const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/userModel'); // Import User model
const cors=require('cors')
const app = express();
app.use(cors());
// Middleware for JSON parsing
app.use(express.json());

// Connect to MongoD
mongoose.connect('mongodb://localhost:27017/my_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Signup route
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Create new user
    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if user with the provided email exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if the provided password matches the user's password
      if (password !== user.password) {
        return res.status(401).json({ message: 'Invalid password' });
      }
  
      // If authentication is successful, send a success response
      res.status(200).json({ message: 'Login successful' });
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
