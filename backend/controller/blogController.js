import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import Blog from "../models/blogModel.js";
import {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} from "./handlerFactory.js";

export const getAllBlog = getAll(Blog);
export const getOneBlog = getOne(Blog);

/*
***********************************************************
This function will create blog and store
it into database.
***********************************************************
*/

export const createBlog = createOne(Blog);

/*
***********************************************************
This function will update blog and store
it into database.
***********************************************************
*/

export const updateBlog = updateOne(Blog);

/*
***********************************************************
This function will delete blog
***********************************************************
*/

export const deleteBlog = deleteOne(Blog);
