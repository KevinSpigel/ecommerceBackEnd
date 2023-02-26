const { Router } = require("express");
const { userModel } = require("../../models/users.model");
const { generateToken } = require("../../jwt");
const { hashPassword, isValidPassword } = require("../../hash");
const { authToken } = require("../../middlewares/authToken.middleware");



const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "Invalid credentials" });
  }
  if (!isValidPassword(user, password)) {
    return false;
  }

  const access_token = generateToken(user);

  //sent token via cookie
  res.cookie("ecomm23", access_token,{
    maxAge: 60*60*1000,
    httpOnly: true
  })

  // res.json({ access_token });
  res.json({ payload: "OK" });
});

router.post("/register", async (req, res) => {
  const { first_name, last_name, age, email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "User already exist" });
  }

  const newUser = {
    first_name,
    last_name,
    age,
    email: username,
    password: hashPassword(password),
  };
  await userModel.create(newUser);
  const access_token = generateToken(newUser);
  res.json({ access_token });
});

router.get("/current", authToken, async (req, res) => {
  res.json({ payload: req.user });
});

module.exports = router;
