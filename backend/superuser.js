import readline from "readline-sync";
import User from "./models/userModel.js";
import mongoose from "mongoose";
import config from "./configuration.js";
// Database connection
const url = config.MONGODB_URI.replace(
  "<password>",
  process.env.MONGODB_PASSWORD
);

mongoose
  .connect(url, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((err) => {
    console.log(err);
  });

const createSuperUser = async () => {
  const email = readline.question("Enter super user email :");
  let password = readline.question("Enter  password :");
  let confirmPassword = readline.question("Confirm your password :");

  if (!email || !password || !confirmPassword) {
    console.log("Fields cannot be empty. Please try again!");
    createSuperUser();
  }

  if (confirmPassword !== password) {
    console.log("Passwords miss matched. Please try again!");
    createSuperUser();
  }

  try {
    const user = await User.findOne({ email });

    if (user) {
      console.log("User is already exist.");
      process.exit();
    } else {
      const userData = {
        name: "admin",
        email: email,
        password: password,
        isEmailVerified: true,
        role: "admin",
        active: true,
      };
      const newUser = await User.create(userData);

      if (newUser) {
        console.log("Superuser successfully created.");
      }
    }
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

createSuperUser();
