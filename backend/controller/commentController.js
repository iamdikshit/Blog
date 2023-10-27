import catchAsync from "../utils/catchAsync.js";
import Blog from "../models/blogModel.js";
import AppError from "../utils/appError.js";
import Comment from "../models/commentModel.js";

// get all comments
export const getAllComments = catchAsync(async (req, res, next) => {
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

  // comment
  const allComment = await Comment.find(queryStr)
    .sort(sortBy)
    .select(limitByField)
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    status: "success",
    results: allComment.length,
    data: allComment,
  });
});
// create comment
// POST MethoblogDocumentd
export const createComment = catchAsync(async (req, res, next) => {
  // Find blog
  const blogDocument = await Blog.findById(req.body.blog);
  if (!blogDocument)
    return next(new AppError("No blog found with this id", 404));

  //  create new document and insert document id in blog
  const newCommentDocument = await Comment.create({
    blog: req.body.blog,
    user: req.user.id,
    comment: {
      text: req.body.comment,
    },
  });
  // insert new comment doc id blog
  if (newCommentDocument) {
    blogDocument.comment = [...blogDocument.comment, newCommentDocument.id];
    blogDocument.save({ validateBeforeSave: true });
  }

  res.status(200).json({
    status: "success",
    message: "comment created successfull!",
    data: newCommentDocument,
  });
});
// Update by ID.
export const updateComment = catchAsync(async (req, res, next) => {
  // find comment and modify it

  const commentDocument = await Comment.findByIdAndUpdate(req.params.id, {
    ...req.body,
    comment: {
      text: req.body.comment,
    },
  });

  res.status(200).json({
    status: "success",
    message: "comment updated successfull!",
    data: commentDocument,
  });
});

// Delete comment by comment ID

export const deleteComment = catchAsync(async (req, res, next) => {
  // delete comment
  const commentDoc = await Comment.findByIdAndDelete(req.params.id);
  if (!commentDoc)
    return next(new AppError("No comment found with this Id!", 404));

  // Find Blog
  const blogDocument = await Blog.findById(commentDoc.blog);
  if (!blogDocument)
    return next(new AppError("No blog found with this Id!", 404));

  blogDocument.comment.pull(commentDoc.id);
  blogDocument.save();
  res.status(204).json({
    status: "success",
    message: "comment updated successfull!",
  });
});
