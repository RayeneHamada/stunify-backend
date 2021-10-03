const express = require('express');
const router = express.Router();
const jwtHelper = require('../config/jwtHelper');
const main_controller = require('../controllers/subscriptionController');

router.post('/new', main_controller.new);
router.get('/all', main_controller.fetchAll);
router.post('/buy', jwtHelper.verifyBusinessJwtToken,main_controller.buySubscription);
router.get('/my', jwtHelper.verifyBusinessJwtToken,main_controller.mySub);


module.exports = router;