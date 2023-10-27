import catchAsync from "../utils/catchAsync.js";
import Like from "../models/likeModel.js";
import Blog from "../models/blogModel.js";
import AppError from "../utils/appError.js";
export const updateLike = catchAsync(async (req, res, next) => {
  let doc = await Like.findOne({
    blog: req.params.id,
    user: req.user.id,
  });
  const blog = await Blog.findById(req.params.id);
  if (!blog) return next(new AppError("Blog with this id is not found!", 404));

  if (!doc) {
    doc = await Like.create({
      blog: blog.id,
      user: req.user.id,
      like: true,
    });
    blog.like = [...blog.like, doc.id];
    blog.save();
  } else {
    doc.like = !doc.like;
    if (doc.like) {
      blog.like = [...blog.like, doc.id];
    } else {
      blog.like.pull(doc.id);
    }
    blog.save();
    //   blog.like = [...blog.like.pull(doc.id)];
    //   blog.save();
    doc.save();
  }

  res.status(200).json({
    status: "success",
    message: "Liked successfully!",
    data: doc,
  });
});
