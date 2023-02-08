const { Router } = require("express");
const cookieParser = require("cookie-parser");
const router = Router();

// COOKIES
//RES is use to create, delete a cookie
//REQ is to obtain the value of the cookie

//Middleware
// router.use(cookieParser());
router.use(cookieParser(["principal-password", "alternative-password"])); //signed cookie

//How to set a cookie
router.use("/set", (req, res) => {
  res.cookie("server1", "test1").send("Cookie set");
});

router.use("/set2", (req, res) => {
  res
    .cookie("server2", "test2", {
      maxAge: 10000,
      // httpOnly:true
    })
    .send("Cookie set2");
});

//How to obtain info from a cookie
router.use("/get", (req, res) => {
  console.log(req.cookies);
  res.send(req.cookies.server1);
});

//How to delete a cookie
router.use("/clr", (req, res) => {
  res.clearCookie("server1").send("cookie erased");
});

//example cookie
router.post("/logi", (req, res) => {
  const { email, password } = req.body;
  res.cookie("userEmail", email, {
    httpOnly: true,
    signed: true,
  });
});

router.get("/home", (req, res) => {
  res.send(req.signedCookies.userEmail);
});

module.exports = router;
