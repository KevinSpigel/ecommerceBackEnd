const { Router } = require("express");
const passport = require("../../middlewares/passport.middleware");

const router = Router();

// SESSION

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "api/sessions/failedPetition",
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(400).send({
        status: "error",
        error: "Wrong User or Password",
      });
    }

    const sessionUser = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
      role: req.user.role,
    };

    req.session.user = sessionUser;
    res.status(200).json({ status: "success", payload: sessionUser });
  }
);

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "api/sessions/failedPetition",
  }),
  async (req, res) => {
    const sessionUser = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
      role: req.user.role,
    };
    req.session.user = sessionUser;

    res.status(201).json({ status: "success", payload: sessionUser });
  }
);

//github
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "api/sessions/failedPetition",
  }),
  async (req, res) => {
    const sessionUser = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
      role: "user",
    };

    req.session.user = sessionUser;
    res.redirect("/products");
  }
);

router.get("/failedPetition", (req, res) => {
  res.send({ error: "Failed Petition" });
});

router.get("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.clearCookie("my-session");
      res.redirect("/login");
    }
  });
});

module.exports = router;