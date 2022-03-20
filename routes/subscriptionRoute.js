const express = require('express');
const router = express.Router();
const jwtHelper = require('../config/jwtHelper');
const main_controller = require('../controllers/subscriptionController');


//router.post('/buy', jwtHelper.verifyBusinessJwtToken,main_controller.buySubscription);
//router.get('/my', jwtHelper.verifyBusinessJwtToken,main_controller.mySub);
router.post('/new',jwtHelper.verifyBusinessJwtToken,main_controller.create);
router.post('/cancel',jwtHelper.verifyBusinessJwtToken,main_controller.cancel);
router.post('/confirm',jwtHelper.verifyBusinessJwtToken,main_controller.confirmSubscriptionPayment);


module.exports = router;