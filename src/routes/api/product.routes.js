const { Router } = require('express');
const productController = require('../../controllers/product.controller');
const { authUserAsUser } = require('../../middleware/userAuth');

const routes = Router();

routes.route('/').post(authUserAsUser, productController.createProduct).get(authUserAsUser, productController.getAll);
routes.route('/:id')
  .patch(authUserAsUser, productController.updateProduct)
  .delete(authUserAsUser, productController.deleteProduct)

module.exports = routes
