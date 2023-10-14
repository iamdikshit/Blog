import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import AppError from "./utils/appError.js";
import globalErrorHandler from "./controller/errorHandler.js";
import config from "./configuration.js";

// router imports
import userRouter from "./routes/userRoute.js";
import categoryRouter from "./routes/categoryRoute.js";
import blogRouter from "./routes/blogRoute.js";

const app = express();

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

// Development logging

if (config.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes For Application
app.use("/api/v1/user", userRouter);
// Category Route
app.use("/api/v1/category", categoryRouter);
// Blog Route
app.use("/api/v1/blog", blogRouter);

// If user visit unwanted route
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error Handler
app.use(globalErrorHandler);
export default app;
