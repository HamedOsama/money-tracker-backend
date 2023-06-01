const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs/promises');

console.log(path.join(__dirname, '../uploads'));


exports.Uploads = multer({
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/))
      return cb(new Error('please upload image !'))
    cb(null, true)
  },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const fullPath = path.join(__dirname, '../images')
      cb(null, fullPath)
    },
    filename: (req, file, cb) => {
      // console.log(req.body);
      const fileName = Date.now().toString() + "_" + file.originalname
      cb(null, fileName)
    }
  }),
})

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadImage = upload.fields([
  { name: 'file', maxCount: 1 }
]);

exports.uploadImageController = async (req, res, next) => {
  if (req.file)
    res.status(201).json({
      ok: true,
      code: 201,
      message: "Image uploaded successfully",
      filename: req.file.filename
    });
  else
    res.status(400).json({
      ok: false,
      code: 400,
      message: "No image uploaded"
    });
}




