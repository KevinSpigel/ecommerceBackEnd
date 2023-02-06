const mongoose = require("mongoose");
const { options } = require("../config/options");

//connect with the database

mongoose.set("strictQuery", false);

mongoose.connect(options.mongoDb.url, (err) => {
  if (err) return console.log(`Database connection error: ${err}`);
  console.log("Database connection successful");
});
