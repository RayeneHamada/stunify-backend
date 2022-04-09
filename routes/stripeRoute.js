const express = require('express');
const router = express.Router();
const jwtHelper = require('../config/jwtHelper');
const main_controller = require('../controllers/stripeController');
const bodyParser = require("body-parser");

router.post('/webhook', main_controller.webhook);



module.exports = router;