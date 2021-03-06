const express = require('express');
const router = express.Router();
const jwtHelper = require('../config/jwtHelper');
const main_controller = require('../controllers/notificationController');

router.get('/all', jwtHelper.verifyJwtToken,main_controller.fetchAll);


module.exports = router;