const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config/constants");

//working with cookies. Sent token via cookie
const authToken = (req, res, next) => {
  const token = req.cookies["ecomm23"];
  if (!token) {
    return res.status(401).json({ error: "Not Authenticated" });
  }

  jwt.verify(token, SECRET_KEY, (error, credentials) => {
    if (error) {
      return res.status(403).json({ error: "Not authorized" });
    }
    req.user = credentials.user;
    next();
  });
};

//working with headers

// const authToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     return res.status(401).json({ error: "Not Authenticated" });
//   }
//   const token = authHeader.split(" ")[1];
//   jwt.verify(token, SECRET_KEY, (error, credentials) => {
//     if (error) {
//       return res.status(403).json({ error: "Not authorized" });
//     }
//     req.user = credentials.user;
//     next();
//   });
// };

module.exports = {
  authToken,
};
