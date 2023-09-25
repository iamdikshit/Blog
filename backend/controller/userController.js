import catchAsync from "../utils/catchAsync.js";
export const getUser = catchAsync((req, res, next) => {
  return res.status(200).json({
    msg: "Bhai kaam Kam kr raha hai ye route",
  });
});
