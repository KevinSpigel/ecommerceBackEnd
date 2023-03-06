const { Router } = require("express");
const SessionsController = require("../../controllers/sessions.controller");
const {
  passportCustom,
} = require("../../middlewares/passportCustom.middleware");

const router = Router();

router.post("/register", SessionsController.register);

router.post("/login", SessionsController.login);

router.get("/github", passportCustom("github", { scope: ["user:email"] }));

router.get(
  "/github/callback",
  passportCustom("github", { failureRedirect: "api/sessions/failedPetition" }),
  SessionsController.loginGithub
);

router.get(
  "/current",
  passportCustom("jwt"),
  SessionsController.currentSession
);

router.post("/logout", SessionsController.logOut);

router.get("/failedPetition", SessionsController.failedPetition);

module.exports = router;
