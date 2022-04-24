const express = require('express');
const router = express.Router();
const jwtHelper = require('../config/jwtHelper');
const main_controller = require('../controllers/planController');

router.post('/new', main_controller.newPlan);
router.post('/archive', main_controller.archivePlan);
router.post('/unarchive', main_controller.unarchivePlan);
router.get('/all', main_controller.allPlans);



module.exports = router;