const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
app.use(bodyParser.json());
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { usersRouter } = require("./controllers/usersControllers/usersControllers");
// const usersRouter = require("./routes/usersRoutes/usersRoutes");


// User
app.use("/api/users", usersRouter);

// -------------------------------------
app.get("/", (req, res) => {
  res.send("Hello World!");
});
// listening
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
