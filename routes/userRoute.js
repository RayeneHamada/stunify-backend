const express = require('express');
const router = express.Router();
const jwtHelper = require('../config/jwtHelper');
const main_controller = require('../controllers/userController');
const imageUpload = require('../config/multerConfig').imageUpload;

router.post('/sendSMS', main_controller.sendCodeTest);
router.post('/sendBusinessSMS', main_controller.sendBusinessCodeTest);

router.post('/verif', main_controller.verifCode);
router.post('/completeSub', jwtHelper.verifyJwtToken, main_controller.completeSubscription);
router.post('/completeBusinessSub', jwtHelper.verifyBusinessJwtToken, main_controller.completeBusinessSignup);


router.post('/updateProfileImage',[imageUpload.single('image'),jwtHelper.verifyJwtToken], main_controller.updateProfileImage);
router.post('/updateLogo',[imageUpload.single('image'),jwtHelper.verifyJwtToken], main_controller.updateLogo);
router.post('/updateOwnerPicture',[imageUpload.single('image'),jwtHelper.verifyJwtToken], main_controller.updateOwnerPicture);
router.post('/updateAddress',jwtHelper.verifyJwtToken, main_controller.updateAddress);
router.post('/updateAddressReverse', main_controller.updateAddressReverse);
router.post('/addPrestation', jwtHelper.verifyBusinessJwtToken, main_controller.addPrestation);
router.post('/updateDescription', jwtHelper.verifyBusinessJwtToken, main_controller.updateDescription);
router.post('/updateSchedule', jwtHelper.verifyBusinessJwtToken, main_controller.updateSchedule);

router.get('/search/:search', main_controller.search);
router.get('/salloon/:id', main_controller.getSalloon);
router.get('/getProfileForUpdate',jwtHelper.verifyJwtToken, main_controller.getProfileForUpdate);
router.get('/freelance/:id', main_controller.getFreelance);
router.get('/prestations/:id', main_controller.getPrestations);
router.get('/test', main_controller.testNotif);
router.get('/myBusinessProfile',jwtHelper.verifyBusinessJwtToken, main_controller.myBusinessProfile);
router.get('/checkAvailability/:id', main_controller.checkAvailability);
router.get('/availableSlots/:business/:duration/:year/:month/:day', main_controller.availableSlots);

router.post('/addFeedBack', main_controller.addFeedBack);




router.post('/home', main_controller.home);




module.exports = router;