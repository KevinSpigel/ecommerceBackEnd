const { Router } = require("express");
const { userModel } = require("../../models/users.model");

const router = Router();

// SESSION

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });

  if (!user || user.password !== password) {
    return res
      .status(400)
      .json({ status: "error", error: "Wrong user or password" });
  }

  const role =
    email === "adminCoder@coder.com" && password === "adminCod3r123"
      ? "admin"
      : "user";

  const sessionUser = {
    ...user,
    role,
  };

  req.session.user = sessionUser;
  res.json({ status: "success", payload: sessionUser });
});

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;
  let user = await userModel.findOne({ email });
  if (user) {
    return res.send("Error: Email already registered");
  }

  const newUser = await userModel.create({
    first_name,
    last_name,
    email,
    age,
    password,
  });

  req.session.user = newUser;

  res.json({ status: "success", payload: newUser });
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
