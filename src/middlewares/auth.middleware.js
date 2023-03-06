const auth = async (req, res, next) => {
  // const user = await req.session.user;
  const user = await req.user;

  if (user) {
    next();
  } else {
    res.redirect("/");
  }
};

module.exports = {
  auth,
};
