import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category name must not be empty."],
    unique: true,
  },
  publish: {
    type: Boolean,
    default: true,
  },
});

const Category = mongoose.model("Categorie", categorySchema);

export default Category;
