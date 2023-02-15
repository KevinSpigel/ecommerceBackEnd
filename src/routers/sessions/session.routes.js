const { Router } = require("express");
const { roleMiddleware } = require("../../middlewares/role.middleware");

const passport = require("../../middlewares/passport.middleware");

const router = Router();

// SESSION

router.post(
  "/login",
  roleMiddleware,
  passport.authenticate("login", { failureRedirect: "/failrequest" }),
  (req, res) => {
    if (!req.user) {
      return res
        .status(400)
        .json({ status: "error", error: "Wrong user or password" });
    }
    const sessionUser = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
      role: "user",
    };
    req.session.user = sessionUser;
    res.json({ status: "success", payload: sessionUser });
  }
);

router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failrequest" }),
  (req, res) => {
    const sessionUser = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
    };
    req.session.user = sessionUser;
    res.json({ status: "success", payload: sessionUser });
  }
);

router.get("/failrequest", (req, res) => {
  res.send({ error: "Failed request. Try again later" });
});

// Github
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/failrequest" }),
  async (res, req) => {
    const sessionUser = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
    };
    req.session.user = sessionUser;
    res.redirect("/");
  }
);

router.get("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.clearCookie("my-session");
      res.redirect("/");
    }
  });
});

module.exports = router;

// //How to login with a session

// router.get("/", async (req, res) => {
//   const user = await req.session.user;
//   if (user) {
//     return res.redirect("/login");
//   } else {
//     return res.redirect(__dirname, "static/login.html"); //need to create the html file in publc folder
//   }
// });

// router.get("/login", (req, res) => {
//   const { username, password } = req.query;
//   if (username !== "Kevin" || password !== "kevpass") {
//     return res.send("Login failed");
//   } else {
//     req.session.user = username;
//     req.session.admin = true; // The logged in user is admin
//     // res.send("Login success!");
//     res.redirect(`${req.baseUrl}/profile`);
//   }
// });

// router.get("/profile", auth, async (req, res) => {
//   const username = await req.session.user;
//   const html = `<h1>Welcome ${username}</h1>
//   <a href="${req.baseUrl}/admin">Go to Admin</a>`;
//   res.send(html);
// });

// router.get("/admin", (req, res) => {
//   res.send("<h1>Admin content</h1>");
// });

// //How to initialize a session

// router.get("/", async (req, res) => {
//   if (await req.session.counter) {
//     req.session.counter++;
//     res.send(`The website has been visited ${req.session.counter} times.`);
//   } else {
//     req.session.counter = 1;
//     res.send("Welcome!");
//   }
// });

// //How to close/logout a session
// router.get("/logout", (req, res) => {
//   req.session.destroy((err) => {
//     if (!err) {
//       res.send("LogOut ok!");

//       // res.redirect("/"); Can redirect to login view to be able to log in again
//     } else {
//       res.send({ status: "Logout ERROR", body: err });
//     }
//   });
// });

// module.exports = router;
