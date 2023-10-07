import catchAsync from "../utils/catchAsync.js";
import User from "../models/userModel.js";
export const getUser = catchAsync(async (req, res, next) => {
  const user = await User.find({}, { password: 0 });

  return res.status(200).json({
    status: "success",
    record: user.length,
    data: user,
  });
});
