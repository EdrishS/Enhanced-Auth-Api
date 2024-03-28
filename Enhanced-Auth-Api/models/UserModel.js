const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, "first name is required"],
    trim: true,
    text: true,
  },
  last_name: {
    type: String,
    required: [true, "last name is required"],
    trim: true,
    text: true,
  },
  username: {
    type: String,
    required: [true, "username is required"],
    trim: true,
    text: true,
    unique: true,
  },

  email: {
    type: String,
    required: [true, "email is required"],
    trim: true,
  },

  phone: {
    type: String,
    required: [true, "phone number is required"],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  // bio: { type: String },
  // photo: { type: String },
  // isPrivate: { type: Boolean, default: false },
  googleId: { type: String },
  // facebookId: { type: String },
  // twitterId: { type: String },
  // githubId: { type: String },
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
