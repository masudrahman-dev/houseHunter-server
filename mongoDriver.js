const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();

const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.270jmf9.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();
    // Send a ping to confirm a successful connection
    client.db("admin").command({ ping: 1 });

    const usersCollection = client.db("houseHunter-DB").collection("users");

    // User Registration
    app.post("/api/register", async (req, res) => {
      const { fullName, role, phoneNumber, email, password } = req.body;

      try {
        // Check if the user already exists
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
          res.status(500).json({ error: "Something went wrong" });
        } else {
          // Hash the password
          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = {
            fullName,
            role,
            phoneNumber,
            email,
            hashedPassword,
          };
          console.log(newUser);
          const existingUser = await usersCollection.insertOne(newUser);
          res.status(200).json(existingUser);
        }
      } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
      }
    });

    // User Login
    app.post("/api/login", async (req, res) => {
      const { email, password } = req.body;

      try {
        // Find the user based on the email
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        // Check if the password matches
        const passwordMatches = await bcrypt.compare(
          password,
          user.hashedPassword
        );
        if (!passwordMatches) {
          return res.status(401).json({ error: "Invalid password" });
        }

        // Create and send the JWT token in the response
        const token = jwt.sign({ userId: user._id }, "your-secret-key");
        res.json({ token });
      } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
      }
    });

    app.get("/", (req, res) => {
      res.send("Hello World!");
    });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
