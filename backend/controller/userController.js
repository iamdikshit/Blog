import catchAsync from "../utils/catchAsync.js";
import User from "../models/userModel.js";
import ApiFeatures from "../utils/apiFeatures.js";
import { updateOne, deleteOne } from "./handlerFactory.js";
import AppError from "../utils/appError.js";

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

export const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password)
    return next(new AppError("This route is not for password update", 400));

  // filter unwanted field like name,email
  const filteredBody = filterObj(req.body, "name", "email");
  if (req.body.photo) filteredBody.photo = req.body.photo;

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  if (updatedUser) {
    updatedUser.password = undefined;
    updatedUser.active = undefined;
  }

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// CRUD function for Admin

export const getUser = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.id) filter = { id: req.params.id };
  const feature = new ApiFeatures(User.find(filter, { password: 0 }), req.query)
    .filter()
    .sorting()
    .limitFields()
    .paginate();
  const user = await feature.dbquery;
  return res.status(200).json({
    status: "success",
    results: user.length,
    data: {
      data: user,
    },
  });
});

export const getOneUser = catchAsync(async (req, res, next) => {
  const doc = await User.findById(req.params.id, { password: 0 });
  if (!doc) {
    return next(new AppError("No document found with this ID", 404));
  }

  return res.status(200).json({
    status: "success",
    data: {
      data: doc,
    },
  });
});

export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);
