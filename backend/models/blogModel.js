import mongoose from "mongoose";
import slugify from "slugify";
const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide title."],
    },
    cover: {
      type: String,
      required: [true, "Cover pic field cannot be empty!"],
    },
    slug: {
      type: String,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Categorie",
    },

    tags: [String],
    body: {
      type: String,
      trim: true,
      required: [true, "Please enter blog content"],
    },
    publish: {
      type: Boolean,
      default: true,
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    like: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Middleware to create slug
blogSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
