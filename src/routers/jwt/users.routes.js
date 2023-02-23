const { Router } = require("express");
const { userModel } = require("../../models/users.model");
const { generateToken } = require("../../jwt");
const { hashPassword, isValidPassword } = require("../../hash");
const { authToken, authtorization } = require("../../middlewares/authtorization.middleware");
const passport = require("../../middlewares/passport.middleware");
const {
  passportCustom,
} = require("../../middlewares/passport-custom.middleware");

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

  const role =
    email === "adminCoder@coder.com" && password === "adminCod3r123"
      ? "admin"
      : "user";

  const access_token = generateToken({ user, role });
  res.cookie("ecomm23", access_token, {
    maxAge: 60 * 60 * 100,
    httpOnly: true,
  });
  res.json({ payload: "OK" });
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

router.get("/current", passportCustom("login"), authtorization(role), async (req, res) => {
  res.json({ payload: req.user });
});

module.exports = router;
