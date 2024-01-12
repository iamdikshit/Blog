import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "crypto";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please tell us your email!"],
    unique: true,
    lowercase: true,
    // Validation for email
    validate: [validator.isEmail, "Please provide valid email!"],
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  photo: {
    type: String,
    default: "default.jpg",
  },
  role: {
    type: String,
    enum: ["admin", "author", "user", "employee"],
    default: "user",
  },
  password: {
    type: String,
    minlength: 8,
    select: true,
  },
  passwordChangedAt: Date,
  token: {
    type: String,
  },
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
  },
});

/*
  Here we are using pre-hook to encrypt aur password
*/
userSchema.pre("save", async function (next) {
  // this function will run only if password is modified
  if (!this.isModified("password")) return next();
  //encrypting password at cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Model function to set token
userSchema.methods.createResetToken = function () {
  // create reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  // save hashed token in token field
  this.token = crypto.createHash("sha256").update(resetToken).digest("hex");
  // save password reset expiry
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  // return reset token
  return resetToken;
};

// User model function to check wheater password is changed after token creation or not
userSchema.methods.changePassword = function (jwtTimeStamp) {
  // if pass word is change or password field has some value
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return jwtTimeStamp < changedTimeStamp;
  }
  // false means password is not changed
  return false;
};

const User = mongoose.model("User", userSchema);

export default User;
