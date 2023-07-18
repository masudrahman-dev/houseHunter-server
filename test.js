const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 3000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.270jmf9.mongodb.net/?retryWrites=true&w=majority`;

// User model
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  role: { type: String, enum: ['House Owner', 'House Renter'], required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Connect to MongoDB Atlas
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    // Start your Express.js server here
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error.message);
  });

app.use(express.json());

// User Registration
app.post("/api/register", async (req, res) => {
  const { fullName, role, phoneNumber, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      fullName,
      role,
      phoneNumber,
      email,
      hashedPassword,
    });

    await newUser.save();

    // Return the user data without the password
    const userWithoutPassword = { ...newUser.toObject() };
    delete userWithoutPassword.hashedPassword;

    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});
