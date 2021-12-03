const express = require('express');
const router = express.Router();
const jwtHelper = require('../config/jwtHelper');
const main_controller = require('../controllers/appointmentController');

router.post('/book', jwtHelper.verifyJwtToken,main_controller.book);
router.post('/appointmentPerDate', jwtHelper.verifyBusinessJwtToken,main_controller.appointmentPerDay);
router.get('/dashboard', jwtHelper.verifyBusinessJwtToken,main_controller.dashboard);
router.get('/myAppointments', jwtHelper.verifyUserJwtToken,main_controller.myAppointments);
router.get('/availableSlots/:business/:duration/:year/:month/:day', main_controller.availableSlots);


module.exports = router;