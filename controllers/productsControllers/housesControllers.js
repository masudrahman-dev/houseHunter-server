const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
const housesRouter = express.Router();

const { housesCollection } = require("../../DBConfig/DBConfig");

const addNewHouse = async (req, res) => {
  try {
    // Check if the user already exists
    const { name } = req.body;
    const existingHouse = await housesCollection.findOne({ name });
    if (existingHouse) {
      return res.status(409).json({ message: "House already exists!" });
    }
    const result = await housesCollection.insertOne(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
const getAllHouses = async (req, res) => {
  try {
    const result = await housesCollection.find({}).toArray();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// routes
housesRouter.route("/addNewHouse").post(addNewHouse).get(getAllHouses);

// exports router
module.exports = { housesRouter };
