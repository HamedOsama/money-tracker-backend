const { Router } = require('express');
const orderController = require('../../controllers/order.controller');
const { authUser } = require('../../middleware/userAuth');

const routes = Router();


routes.route('/').post(authUser, orderController.addOrder).get(authUser, orderController.getUserOrders);
// routes.route('/all').get(orderController.getAllOrders)
routes.route('/:id').get(authUser , orderController.getOrder)
module.exports = routes
