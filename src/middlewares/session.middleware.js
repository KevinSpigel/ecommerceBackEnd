const sessionMiddleware = async (req, res, next) => {
  // const user = await req.session.user;
  const user = await req.user;

  if (user) {
    return res.redirect("/products");
  } else {
    next();
  }
};

module.exports = {
  sessionMiddleware,
};
