import User from "../../models/userModel.js";
import AppError from "../../utils/appError.js";
import catchAsync from "../../utils/catchAsync.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Email from "../../utils/email.js";

// function to create JSON Token
const createJWTToken = (id, expireTime) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: expireTime,
  });
  return token;
};

// function to send token and set cookie
const createSendToken = (user, statusCode, req, res) => {
  // create token using user id
  const expire = 24 * 60 * 60 * 1000;
  const token = createJWTToken(user.id, expire);

  // set cookies
  res.cookie("jwt", token, {
    expire: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  // Remove password from output
  user.password = undefined;
  user.active = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
// SignIn or Login
/*
**************************************
    SIGN IN 
    This function will
    Verify User and Logged In
*************************************
*/
export const signIn = catchAsync(async (req, res, next) => {
  if (!req.body.email || !req.body.password)
    return next(
      new AppError("Email or password cannot be empty! please try again.", 400)
    );

  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password)))
    return next(new AppError("Wrong email or password please try again", 401));

  if (!user.active)
    return next(
      new AppError("You are not activated! Contact your administration.")
    );

  if (!user.isEmailVerified) {
    const expire = 1 * 60 * 60 * 1000;
    const token = createJWTToken(user.id, expire);
    const url = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/user/activate/${token}`;

    const email = await new Email(user, url).sendActivation();
    return res.status(201).json({
      status: "success",
      message:
        "Your email is not activated.We have sent you email activation mail.Activate your mail.",
    });
  }

  createSendToken(user, 201, req, res);
});
// Sign Up

/*
**************************************
    SIGN UP
    This function will
    create new user based on request
*************************************
*/
export const signUp = catchAsync(async (req, res, next) => {
  if (!req.body.password)
    return next(new AppError("Please enter your password", 400));

  if (!req.body.confirmPassword)
    return next(new AppError("Confirm password field cannot be empty!", 400));

  if (req.body.password !== req.body.confirmPassword)
    return next(
      new AppError("Password mismatched! please check and try again.", 400)
    );
  //   console.log(req.body);
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  const user = await User.create(data);
  const expire = 1 * 60 * 60 * 1000;
  const token = createJWTToken(user.id, expire);
  const url = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/user/activate/${token}`;

  const email = await new Email(user, url).sendActivation();
  return res.status(201).json({
    status: "success",
    message:
      "Signup successfully. We have sent you email activation mail.Activate your mail ",
  });
});

/*
@activate function will take token from pramas 
and set verify mail true  
*/
export const activate = catchAsync(async (req, res, next) => {
  const token = req.params.token;
  const decode = await jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById({ _id: decode.id });
  if (!user) return next(new AppError("Token is invalid or has expired", 400));
  user.isEmailVerified = true;
  await user.save();
  createSendToken(user, 201, req, res);
});

/*
  Logout functionality
  this will set cookie null
*/

export const logout = (req, res) => {
  res.cookie("jwt", "", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
  });
};
