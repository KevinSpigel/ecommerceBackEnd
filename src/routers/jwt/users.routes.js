const { Router } = require("express");
const { userModel } = require("../../models/users.model");
const { generateToken } = require("../../jwt");
const { hashPassword, isValidPassword } = require("../../hash");
const { authToken } = require("../../middlewares/authToken.middleware");

const router = Router();

router.post("/login", async (req, res) => {
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "Invalid credentials" });
  }
  if (!isValidPassword(user, password)) {
    return false;
  }

  const access_token = generateToken(user);
  res.json({ access_token });
});

router.post("/register", async (req, res) => {
  const { first_name, last_name, age, email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "Invalid credentials" });
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

router.post("/current", authToken, (req, res) => {
  res.json({ payload: req.user });
});

module.exports = router;
