const multer = require('multer');
const Product = require('../models/product');
const ServerError = require('../utils/ErrorInterface');
const APIFeatures = require('../utils/apiFeatures');


const createProduct = async (req, res, next) => {
  try {
    const currentActiveProductsLength = await Product.find({ owner: req.user._id, status: 1 }).countDocuments();
    if (currentActiveProductsLength >= req.user.activeProductsLimit) {
      return next(ServerError.badRequest(400, 'لقد تجاوزت الحد الأقصى للمنتجات المسموح بها لحسابك'))
    }
    const product = new Product({ ...req.body, owner: req.user._id });
    await product.save();
    res.status(201).json({
      ok: true,
      code: 201,
      message: 'succeeded',
      body: product,
    });
  } catch (e) {
    next(e)
  }
};

const getAll = async (req, res, next) => {
  try {
    const { user } = req
    req.query.category = req?.query?.category?.split(',')
    const Query = new APIFeatures(Product.find({ owner: user._id }, '-__v -updatedAt'), req?.query).filter().sort().paginate()
    const lengthQuery = new APIFeatures(Product.find({ owner: user._id }), req?.query).filter()
    const [products, totalLength] = await Promise.all([Query.query, lengthQuery.query])

    res.status(200).json({
      ok: true,
      code: 200,
      message: 'succeeded',
      body: products,
      totalLength: totalLength.length,
    });

  } catch (e) {
    next(e)
    // next(ServerError.badRequest(500, e.message))
    // res.status.status(500).send(e.message);
  }
};
const updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const keys = Object.keys(req.body);
    const notAllowed = ['_id', 'updatedAt', 'createdAt' , 'owner'];
    const inValid = keys.filter(el => notAllowed.includes(el));
    if (inValid.length > 0) {
      return next(ServerError.badRequest(401, `not allowed to update (${inValidUpdates.join(', ')})`))
    }
    const product = await Product.findOne(
      { _id: productId, owner: req.user._id }
    );

    if (!product) {
      return next(ServerError.badRequest(400, 'المنتج غير موجود'))
    }

    const currentActiveProductsLength = await Product.find({ owner: req.user._id, status: 1 }).countDocuments();

    if (currentActiveProductsLength >= req.user.activeProductsLimit && req.body.status == 1) {
      return next(ServerError.badRequest(400, 'لقد تجاوزت الحد الأقصى للمنتجات المسموح بها لحسابك'))
    }

    //update product
    await product.update(
      req.body,
      {
        new: true,
        runValidators: true,
      })

    res.status(200).json({
      ok: true,
      code: 200,
      message: 'succeeded',
      body: product,
    });
  } catch (e) {
    console.log(e)
    next(e)
  }
};
const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findOneAndDelete({
      _id: productId,
      owner: req.user._id,
    });
    if (!product)
      return next(ServerError.badRequest(400, 'invalid id'))
    res.status(200).json({
      ok: true,
      code: 200,
      message: 'succeeded',
    });
  } catch (e) {
    next(e)
    // next(ServerError.badRequest(500, e.message))
    // res.status(500).send(e.message);
  }
};

module.exports = {
  createProduct,
  getAll,
  updateProduct,
  deleteProduct,
};
