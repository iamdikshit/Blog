import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    blog: {
      type: mongoose.Schema.ObjectId,
      ref: "Blog",
    },
    like: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const LikeSchema = mongoose.model("Like", likeSchema);
export default LikeSchema;
