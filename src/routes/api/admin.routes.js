const { Router } = require('express');

const adminController = require('../../controllers/admin.controller');
const { authUserAsAdmin } = require('../../middleware/userAuth');

const router = Router();

//auth
router.route('/signup').post(adminController.signup);
router.route('/login').post(adminController.login);
router.route('/auth').get(authUserAsAdmin, adminController.auth);
router.route('/logout').get(authUserAsAdmin, adminController.logout);

//stats 
router.route('/stats').get(authUserAsAdmin, adminController.getStats);
// maintenance
router.route('/users')
  .get(authUserAsAdmin, adminController.getAllUsers)
  .post(authUserAsAdmin, adminController.addUser);
router.route('/users/:id')
  .patch(authUserAsAdmin, adminController.updateUser)
  .delete(authUserAsAdmin, adminController.deleteUser);


module.exports = router;