import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import ApiFeatures from "../utils/apiFeatures.js";

// Get all data functionality

export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    // return response
    res.status(204).json({
      status: "success",
      data: null,
    });
  });

export const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // find by id and delete

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) return next(new AppError("No document found with that ID", 404));

    return res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

export const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    return res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

export const getOne = (Model, populateOption) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOption) {
      query = query.populate(populateOption);
    }

    const doc = await query;
    if (!doc) {
      return next(new AppError("No document found with this ID", 404));
    }

    return res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

export const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.id) filter = { id: req.params.id };

    const feature = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .sorting()
      .limitFields()
      .paginate();
    const doc = await feature.dbquery;
    console.log(doc);

    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
