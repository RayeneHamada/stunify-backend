const express = require('express');
const router = express.Router();
const jwtHelper = require('../config/jwtHelper');
const main_controller = require('../controllers/userController');
const imageUpload = require('../config/multerConfig').imageUpload;

router.post('/sendSMS', main_controller.sendCode);
router.post('/verif', main_controller.verifCode);
router.post('/completeSub', jwtHelper.verifyJwtToken, main_controller.completeSubscription);
router.post('/completeBusinessSub', jwtHelper.verifyBusinessJwtToken, main_controller.completeBusinessSignup);

router.post('/updateProfileImage',[imageUpload.single('image'),jwtHelper.verifyJwtToken], main_controller.updateProfileImage);
router.post('/updateAddress',jwtHelper.verifyJwtToken, main_controller.updateAddress);
router.post('/addPrestation',jwtHelper.verifyBusinessJwtToken, main_controller.addPrestation);




router.post('/home',jwtHelper.verifyJwtToken, main_controller.home);




module.exports = router;