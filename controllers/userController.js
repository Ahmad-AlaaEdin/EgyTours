const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./../controllers/handlerFactory');
const multer = require('multer');
const sharp = require('sharp');
const cloudinary = require('./../utils/cloudinary');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};

// const multerStorage = multer.diskStorage({
// destination: (req, file, cb) => {
// cb(null, 'public/img/users');
// },
// filename: (req, file, cb) => {
// const ext = file.mimetype.split('/')[1];

// cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
// },
// });
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not An Image! Please Upload Only Images ', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
///exports.uploadUserPhoto = upload.single('photo');
exports.uploadUserPhoto = (req, res, next) => {

}
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});
exports.updateMe = catchAsync(async (req, res, next) => {
  console.log(req.file);
  console.log(req.body);

  if (req.body.password || req.body.passwordConfirm)
    next(
      new AppError(
        'This route is not for password updates, use /updatePassword',
        400,
      ),
    );

  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;

  const user = Object.assign(req.user, filteredBody);
  await user.save({ validateModifiedOnly: true });
  res.status(200).json({
    statsus: 'success',
    data: { user },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });
exports.test = (req, res, next) => {
  // cloudinary.config({
  //   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  //   api_key: process.env.CLOUDINARY_API_KEY,
  //   api_secret: process.env.CLOUDINARY_API_SECRET,
  // });

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Convert the buffer from memory storage into a stream and upload to Cloudinary
    const result = cloudinary.uploader
      .upload_stream(
        { folder: 'users_photos' }, // Cloudinary folder
        async (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return res
              .status(500)
              .json({ error: 'Error uploading to Cloudinary' });
          }

          console.log(result);
          res.status(200).json({
            message: 'File uploaded successfully',
          });
        },
      )
      .end(req.file.buffer);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error processing file' });
  }
};
exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
