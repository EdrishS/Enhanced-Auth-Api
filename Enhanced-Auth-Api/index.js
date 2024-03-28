require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const mongoose = require("mongoose");
const { readdirSync } = require("fs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

//routes
readdirSync("./routes").map((r) => app.use("/", require("./routes/" + r)));

mongoose
  .connect("mongodb+srv://EdrishS:root@mernstack.bz6grue.mongodb.net/loginpanel?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("database connected successfully"))
  .catch((err) => console.log("error connecting to mongodb", err));
mongoose.connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());

// Secure the '/api/profiles/:username' PUT route
function authenticateUser(req, res, next) {
  if (
    req.isAuthenticated() &&
    (req.user.isAdmin || req.params.username === req.user.username)
  ) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
}


app.listen(3000, () => {
  console.log("Server started on port 3000");
});
