import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please tell us tour email!"],
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
    enum: ["admin", "author", "user"],
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

const User = mongoose.model("User", userSchema);

export default User;
