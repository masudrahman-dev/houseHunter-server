const jwt = require("jsonwebtoken");

const createJwtToken = async (req, res, next) => {
  const { email, fullName, role, phoneNumber } = req.body;

  const token = jwt.sign(
    { email, fullName, role, phoneNumber },
    process.env.USER_JWT_TOKEN,
    {
      expiresIn: "1h",
    }
  );

  // console.log(token);
  res.status(201).json({ token });

};

module.exports = { createJwtToken };
