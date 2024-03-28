// routes/api.js
const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const { register, login, logout, google, editProfile } = require("../controller/user");
const { authUser } = require("../middleware/auth");

router.post("/register", register);
// route to authenticate a user (access

router.post("/login", login);

router.post("/logout", logout)

router.put("/editProfile", authUser, editProfile);

router.get("/google", google)

// router.get("/faceBook", google)

// router.get("/gitHub", google)

router.get("/profiles", async (req, res) => {
});

router.get("/profiles/:username", async (req, res) => {
});

router.put(
  "/profiles/:username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
  }
);

// Export the router
module.exports = router;
