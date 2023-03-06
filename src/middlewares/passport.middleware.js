const passport = require("passport");
const { userModel } = require("../models/schemas/users.model");
const { hashPassword, isValidPassword } = require("../utils/hash.utils");
const GithubStrategy = require("passport-github2").Strategy;

const passportJwt = require("passport-jwt");
const { SECRET_KEY } = require("../constants/sessions.constants");
const { cookieExtractor } = require("../utils/jwt.utils");

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt; //where are we going to extract token info

const CartMongoManager = require("../models/dao/mongoManager/cartManager.mongoose");
const cartsDao = new CartMongoManager();

//github strategy
passport.use(
  new GithubStrategy(
    {
      clientID: "Iv1.6105c4b4bc9e8628",
      clientSecret: "48b6ffd7d029ad78252aca60bf1d42a1ce5fb6c1",
      callbackURL: "http://localhost:8080/api/sessions/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userData = profile._json;
        const user = await userModel.findOne({ emai: userData.email });
        if (!user) {
          const cartForNewUser = await cartsDao.addCart();

          const newUser = {
            first_name: userData.name.split(" ")[0],
            last_name: userData.name.split(" ")[1],
            age: userData.age || null,
            email: userData.email || null,
            password: null,
            role: "user",
            github_username: userData.login,
            cart: cartForNewUser._id,
          };

          const response = await userModel.create(newUser);
          done(null, response._doc);
        } else {
          done(null, user);
        }
      } catch (error) {
        done(error);
      }
    }
  )
);

//JWT strategy
passport.use(
  "jwt",
  new JwtStrategy(
    {
      secretOrKey: SECRET_KEY,
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    },
    async (jwt_payload, done) => {
      try {
        const user = await userModel.findOne({ email: jwt_payload.email });
        if (!user) {
          done(null, false, { messages: "User not found" });
        }
        if (!isValidPassword(user, password)) {
          done(null, false, { messages: "Invalid credentials" });
        }
        return done(null, jwt_payload);
      } catch (error) {
        return done(error);
      }
    }
  )
);

module.exports = passport;
