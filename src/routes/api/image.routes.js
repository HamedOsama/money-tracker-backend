const { Router } = require('express');
const { uploadImage, uploadImageController, Uploads } = require('../../utils/image');

const router = Router();

router.route('/').post(Uploads.single('file'), uploadImageController);

module.exports = router;