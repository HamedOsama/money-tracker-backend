const { Router } = require('express');

const maintenanceController = require('../../controllers/maintenance.controller');
const { authUser } = require('../../middleware/userAuth');

const routes = Router();

routes.route('/').get(authUser, maintenanceController.getAllMaintenances);
routes.route('/:id').get(authUser, maintenanceController.getMaintenance);

module.exports = routes;