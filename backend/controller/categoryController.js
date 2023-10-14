import catchAsync from "../utils/catchAsync.js";
import Category from "../models/categoryModel.js";
import AppError from "../utils/appError.js";

// Create Category
export const createCategory = catchAsync(async (req, res, next) => {
  const category = await Category.create(req.body);
  res.status(200).json({
    status: "success",
    message: "Category Created!",
    data: category,
  });
});

// Read Category
export const getAllCategory = catchAsync(async (req, res, next) => {
  const allCategory = await Category.find();
  res.status(200).json({
    status: "success",
    record: allCategory.length,
    data: allCategory,
  });
});

// Update Category
export const updateCategoryByID = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    message: "updated successfully!",
    data: category,
  });
});

// Delete Category
export const deleteCategory = catchAsync(async (req, res, next) => {
  // Deleting category

  const doc = await Category.findByIdAndDelete(req.params.id);
  if (!doc) return next(new AppError("No document found with that ID", 404));
  res.status(204).json({
    status: "success",
    message: "Deleted successfully!",
    data: doc,
  });
});
