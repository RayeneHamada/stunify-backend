const express = require('express');
const router = express.Router();
const jwtHelper = require('../config/jwtHelper');
const main_controller = require('../controllers/userController');

router.post('/signup', main_controller.signup);
router.post('/businessSignup', main_controller.businessSignup);
router.post('/sendSMS', main_controller.sendCode);
router.post('/verif', main_controller.verifCode);
router.post('/login', main_controller.authenticate);
router.post('/taxRegistrationNumber', main_controller.taxRegistration);

module.exports = router;