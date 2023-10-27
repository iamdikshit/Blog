import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import Blog from "../models/blogModel.js";

export const getAllBlog = catchAsync(async (req, res, next) => {
  // filter
  const queryObject = { ...req.query };

  const excludeField = ["page", "sort", "fields", "limit"];
  // excluding field from query object
  excludeField.forEach((ele) => delete queryObject[ele]);

  // Advance filtering
  let queryStr = JSON.stringify(queryObject);
  // $ sign in front of operators
  queryStr = queryStr.replace(
    /\b(gte|gt|lte|lt|and|or)\b/g,
    (match) => `$${match}`
  );
  queryStr = JSON.parse(queryStr);

  // Sort
  let sortBy;
  if (req.query.sort) {
    sortBy = req.query.sort.split(",").join(" ");
  } else {
    sortBy = "-createdAt";
  }

  // Limiting fields
  let limitByField;
  if (req.query.fields) {
    limitByField = req.query.fields.split(",").join(" ");
  } else {
    limitByField = "-__v";
  }

  // Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  const totalRecord = await Blog.countDocuments();
  if (page * limit > totalRecord && page * limit > limit)
    return next(new AppError("Page does not exist", 404));

  const blog = await Blog.find(queryStr)
    .populate("category")
    .sort(sortBy)
    .select(limitByField)
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    status: "success",
    result: blog.length,
    data: blog,
  });
});

/*
***********************************************************
This function will create blog and store
it into database.
***********************************************************
*/

export const createBlog = catchAsync(async (req, res, next) => {
  // inserting blog
  const blog = await Blog.create(req.body);
  res.status(200).json({
    status: "success",
    message: "blog created successfully",
    data: blog,
  });
});

/*
***********************************************************
This function will update blog and store
it into database.
***********************************************************
*/

export const updateBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!blog) return next(new AppError("Document not found for id.", 404));
  blog.save({ runValidators: true });
  res.status(200).json({
    status: "success",
    message: "blog updated successfully",
    data: blog,
  });
});

/*
***********************************************************
This function will delete blog
***********************************************************
*/

export const deleteBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) return next(new AppError("No document found with this id."));
  res.status(204).json({
    status: "success",
    message: "Deleted successfully!",
  });
});
