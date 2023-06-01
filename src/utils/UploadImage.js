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

exports.uploadProductImages = upload.fields([
    { name: 'images', maxCount: 8 }
]);
exports.resizeProductImages = async (req, res, next) => {
    try {
        if (!req.files.images) return next();
        req.body.images = [];
        await Promise.all(
            req.files.images.map(async (file, i) => {
                const filename = `product-${Date.now()}-${i + 1}.png`;
                // const maskBuffer = await sharp(file.buffer)
                // .toColorspace('')
                // .negate()
                // .toBuffer();

                // const pngBuffer =
                await sharp(file.buffer)
                    // .composite([{ input: maskBuffer }])
                    .resize(800, 600) // Resize the image if needed
                    .flatten({ background: { r: 0, g: 0, b: 0, alpha: 0 } }) // Flatten to remove any alpha channels
                    .png({ transparent: true }) // Convert to PNG with transparent background
                    .toFile(`${path.join(__dirname, '../images')}/${filename}`);

                // await fs.writeFile(`${path.join(__dirname, '../images')}/${filename}`, pngBuffer);

                // (async (err, mask => {
                //         await sharp(file.buffer)
                //             .composite([{ input: mask }])
                //             .png({ transparent: true })
                //             .toFile(`${path.join(__dirname, '../images')}/${filename}`);
                //     }))

                // .ensureAlpha()
                // .toFormat('png')
                // .png({ transparent: true })
                // .resize(433, 346)
                // .toFile(`${path.join(__dirname, '../images')}/${filename}`);
                req.body.images.push(filename);
            })
        );
        next();
    }
    catch (e) {
        next(e)
    }

};
