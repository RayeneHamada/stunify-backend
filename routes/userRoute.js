const express = require('express');
const router = express.Router();
const jwtHelper = require('../config/jwtHelper');
const main_controller = require('../controllers/userController');
router.post('/sendSMS', main_controller.sendCode);
router.post('/verif', main_controller.verifCode);
router.post('/completeSub',jwtHelper.verifyJwtToken, main_controller.completeSubscription);








module.exports = router;