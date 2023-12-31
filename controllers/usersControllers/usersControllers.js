const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
const usersRouter = express.Router();

const {
  usersCollection,
} = require("../../DBConfig/DBConfig");
const { createJwtToken } = require("../../middleware/createJwtToken");

const createNewUser = async (req, res) => {
  const { fullName, role, phoneNumber, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      fullName,
      role,
      phoneNumber,
      email,
      hashedPassword,
    };

    const result = await usersCollection.insertOne(newUser);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user based on the email
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found. please register" });
    }

    // Check if the password matches
    const passwordMatches = await bcrypt.compare(password, user.hashedPassword);
    // console.log(passwordMatches);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid password" });
    }

    if (passwordMatches) {
      return res.status(200).json({ message: "Login Successful" });
    }
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};


// routes
usersRouter.route("/register").post(createNewUser);
usersRouter.route("/jwt").post(createJwtToken);
usersRouter.route("/login").post(handleLogin);

// exports router
module.exports = { usersRouter };
