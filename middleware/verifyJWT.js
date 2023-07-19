const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res
      .status(401)
      .send({ error: true, message: "Authorization failed" });
  }
  
  const token = authorization.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .send({ error: true, message: "Authorization failed" });
  }
  
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .send({ error: true, message: "Authorization failed" });
    }
    req.decoded = decoded;
    next();
  });
};

module.exports = {verifyJWT};