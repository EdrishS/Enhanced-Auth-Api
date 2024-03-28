const UserModel = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { validateUsername } = require("../helpers/validation");
const { generateToken } = require("../helpers/token");

exports.register = async (req, res) => {
  try {
    // console.log("email",req)
    const { first_name, last_name, phone, email, password } = req.body;

    let tempUsername = first_name + last_name;
    let newUsername = await validateUsername(tempUsername);
    const cryptedPassword = await bcrypt.hash(password, 10);

    const user = await new UserModel({
      first_name,
      last_name,
      email,
      phone,
      password: cryptedPassword,
      username: newUsername,
    }).save();

    res.send({
      id: user._id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      message: "Register Success !",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log('req',req.body)

    // // Find the user in the database
    const user = await UserModel.findOne({
      $or: [{ email: email }, { phone: email }],
    });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password or phone number",
      });
    }
    console.log("user ,", user);

    // // Compare the provided password with the stored password hash
    // const hashedPassword = await bcrypt.hash(password, 12);

    const check = await bcrypt.compare(password, user.password);
    console.log("check, ",check)
    if (!check) {
      return res.status(400).json({
        message: "Invalid credentials.Please try again.",
      });
    }

    const token = generateToken({ id: user._id.toString() }, "7d");
    res.send({
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      token: token,
    });

    // res.json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logout = async (_, res, next) => {
  try {
    res.clearCookie("__session");
    return res.status(200).json({ message: "User logged out" });
  } catch (err) {
    return next(err);
  }
};
exports.editProfile = async (req, res) => {
  try {
    const { email, phone } = req.body;
    const id = req.params.id;

    const updatedProfile = await User.findByIdAndUpdate(id, {
      email,
      phone,
    });

    res.status(200).json({ updatedProfile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

(exports.google = passport.authenticate("google")),
  (req, res) => {
    if (req.isAuthenticated()) {
      // If the user is successfully authenticated, redirect them to a successful login page
      res.redirect("/success");
    } else {
      // If the user is not authenticated, display an error message
      res.status(500).json({ message: "Error during authentication" });
    }
  };
