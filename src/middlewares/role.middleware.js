const roleMiddleware = async (req, res, next) => {
  const { email, password } = req.body;
  if (email == "adminCoder@coder.com" && password == "adminCod3r123") {
    req.session.user = {
      first_name: "admin",
      last_name: "Coder",
      email: "adminCoder@coder.com",
      age: 30,
      password: "adminCod3r123",
      role: "admin",
    };
    req.session.save((err) => {
      if (err) {
        console.log("session error: ", err);
      } else {
        res.redirect("/products");
      }
    });
  } else {
    next();
  }
};

module.exports = {
  roleMiddleware,
};
