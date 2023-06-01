const { Router } = require('express');
const userController = require('../../controllers/user.controller');
const { authUser } = require('../../middleware/userAuth');

const routes = Router();

routes.route('/signup').post(userController.signup)
routes.route('/login').post(userController.login)
routes.route('/logout').get(authUser, userController.logout)
routes.route('/me').get(authUser, userController.getUserInfo)
routes.route('/auth').get(authUser, userController.auth)
routes.route('/stats').get(authUser, userController.getStats) 
routes.route('/').post(userController.addUser).patch(authUser, userController.updateUser);


module.exports = routes;