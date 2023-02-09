const { Router } = require("express");
const session = require("express-session");
const FileStore = require("session-file-store")(session);

const router = Router();

// SESSION

//Middleware
router.use(
  session({
    name: "my-session", //Naming the session will set the same name to the cookie
    secret: "top-secret", //protect info with password
    resave: false, //depends on the store method. If value is "true" the session would be active and not expire
    saveUninitialized: false, //store session before it is initialize
    store: new FileStore({
      path: "./sessions",
      ttl: 20, //Time to live of the sessions in seconds
      retries: 3, // retries of the session
    }),
  })
);

//Middleware of authentification
async function auth(req, res, next) {
  if (await req.session?.user === "Kevin" && req.session?.admin) {
    return next();
  }
  return res.status(401).send("Authentification error");
}

//How to login with a session

router.get("/", async (req, res) => {
  const user = await req.session.user;
  if (user) {
    return res.redirect("/login");
  } else {
    return res.redirect(__dirname, "static/login.html"); //need to create the html file in publc folder
  }
});

router.get("/login", (req, res) => {
  const { username, password } = req.query;
  if (username !== "Kevin" || password !== "kevpass") {
    return res.send("Login failed");
  } else {
    req.session.user = username;
    req.session.admin = true; // The logged in user is admin
    // res.send("Login success!");
    res.redirect(`${req.baseUrl}/profile`);
  }
});

router.get("/profile", auth, async (req, res) => {
  const username = await req.session.user;
  const html = `<h1>Welcome ${username}</h1>
  <a href="${req.baseUrl}/admin">Go to Admin</a>`;
  res.send(html);
});

router.get("/admin", (req, res) => {
  res.send("<h1>Admin content</h1>");
});

//How to initialize a session

router.get("/", async (req, res) => {
  if (await req.session.counter) {
    req.session.counter++;
    res.send(`The website has been visited ${req.session.counter} times.`);
  } else {
    req.session.counter = 1;
    res.send("Welcome!");
  }
});

//How to close/logout a session
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (!err) {
      res.send("LogOut ok!");

      // res.redirect("/"); Can redirect to login view to be able to log in again
    } else {
      res.send({ status: "Logout ERROR", body: err });
    }
  });
});

module.exports = router;
