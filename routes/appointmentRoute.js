const express = require('express');
const router = express.Router();
const jwtHelper = require('../config/jwtHelper');
const main_controller = require('../controllers/appointmentController');

router.post('/book', jwtHelper.verifyJwtToken,main_controller.book);
router.get('/availableSlots/:business/:duration/:year/:month/:day', main_controller.availableSlots);


module.exports = router;