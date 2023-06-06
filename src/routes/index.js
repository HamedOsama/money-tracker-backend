const { Router } = require('express');

const userRoutes = require('./api/user.routes');
const productRoutes = require('./api/product.routes');
const adminRoutes = require('./api/admin.routes');
const imageRoutes = require('./api/image.routes');

const routes = Router();

routes.use('/users', userRoutes);
routes.use('/products', productRoutes);
routes.use('/admin', adminRoutes);
// routes.use('/images', imageRoutes);

module.exports = routes;