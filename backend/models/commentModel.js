import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    blog: {
      type: mongoose.Schema.ObjectId,
      ref: "Blog",
    },
    comment: {
      text: {
        type: String,
        trim: true,
        required: [true, "Please write comment!"],
      },
      date: {
        type: Date,
        default: Date.now(),
      },
    },
    publish: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
