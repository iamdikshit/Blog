import config from "./configuration.js";
import app from "./app.js";
import mongoose from "mongoose";

// MONGO DB Setup
const url = config.MONGODB_URI.replace(
  "<password>",
  process.env.MONGODB_PASSWORD
);

mongoose
  .connect(url, {
    useNewUrlParser: true,
  })
  .then(() => console.log("DB connection successfull"));

const PORT = config.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
  console.log(`Server : http://127.0.0.1:${PORT}`);
});
