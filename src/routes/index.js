const { Router } = require('express');

const userRoutes = require('./api/user.routes');
const productRoutes = require('./api/product.routes');
const orderRoutes = require('./api/order.routes');
const maintenanceRoutes = require('./api/maintenance.routes');
const adminRoutes = require('./api/admin.routes');
const imageRoutes = require('./api/image.routes');

const routes = Router();

routes.use('/users', userRoutes);
routes.use('/products', productRoutes);
// routes.use('/orders', orderRoutes);
routes.use('/admin', adminRoutes);
// routes.use('/maintenances', maintenanceRoutes);
// routes.use('/images', imageRoutes);

module.exports = routes;