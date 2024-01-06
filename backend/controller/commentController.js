import catchAsync from "../utils/catchAsync.js";
import Blog from "../models/blogModel.js";
import AppError from "../utils/appError.js";
import Comment from "../models/commentModel.js";
import { getAll, getOne } from "./handlerFactory.js";

// get all comments
export const getAllComments = getAll(Comment);
export const getOneComment = getOne(Comment, "blog");
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
