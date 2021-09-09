const express = require('express');
const router = express.Router();
const jwtHelper = require('../config/jwtHelper');
const main_controller = require('../controllers/categoryController');

router.post('/newCategory', main_controller.newCategory);
router.post('/rename', main_controller.renameCategory);
router.get('/all', main_controller.fetchAllCategories);


module.exports = router;