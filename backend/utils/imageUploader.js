import multer from "multer";
import sharp from "sharp";
import AWS from "aws-sdk";
import AppError from "./appError.js";
import catchAsync from "./catchAsync.js";

// S3 configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,

  secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
});

// Multer Configuration

// Multer storage config
const storage = multer.memoryStorage();

// Multer filter
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Please select image file only!", 400), true);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: multerFilter,
});

export const uploadImage = upload.fields([
  {
    name: "cover",
    maxCount: 1,
  },
  {
    name: "photo",
    maxCount: 1,
  },
]);

export const imagePreProcessing = (text, size) => {
  return catchAsync(async (req, res, next) => {
    if (!req.files.cover && !req.files.photo) return next();

    // filename
    let imageFile;
    if (req.files.cover) {
      req.body.cover = `blog-${
        req.params.id ? req.params.id : Math.random(10).toString().split(".")[1]
      }-${Date.now()}.jpeg`;
      imageFile = req.files.cover[0].buffer;
    }

    if (req.files.photo) {
      req.body.photo = `user-${
        req.params.id ? req.params.id : Math.random(10).toString().split(".")[1]
      }-${Date.now()}.jpeg`;
      imageFile = req.files.photo[0].buffer;
    }

    // Resizing image
    const photo = await sharp(imageFile)
      .resize(size?.width, size?.height)
      .toFormat("jpeg")
      .jpeg({ quality: 90 });
    if (process.env.NODE_ENV === "production") {
      await photo.toBuffer((err, data, info) => {
        if (err) {
          next(new AppError(err, 400));
        }

        const params = {
          Bucket: process.env.AWS_BUCKET_NAME, // bucket that we made earlier

          Key: req.body.cover, // Name of the image

          Body: data, // Body which will contain the image in buffer format

          ContentType: "image/jpeg/webp", // Necessary to define the image content-type to view the photo in the browser with the link
        };

        s3.putObject(params, (error, data) => {
          if (error) {
            res.status(500).send({ err: error });
          }
        });
      });
    } else {
      if (text == "blog") photo.toFile(`public/images/blogs/${req.body.cover}`);
      else photo.toFile(`public/images/user/${req.body.photo}`);
    }
    next();
  });
};
