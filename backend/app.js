import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import userRouter from "./routes/userRoute.js";
import AppError from "./utils/appError.js";
import globalErrorHandler from "./controller/errorHandler.js";
const app = express();

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes For Application
app.use("/api/v1/user", userRouter);

// If user visit unwanted route
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error Handler
app.use(globalErrorHandler);
export default app;
