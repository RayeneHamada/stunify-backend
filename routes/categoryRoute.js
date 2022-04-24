const express = require('express');
const router = express.Router();
const jwtHelper = require('../config/jwtHelper');
const main_controller = require('../controllers/categoryController');
const imageUpload = require('../config/multerConfig').imageUpload;

router.post('/newCategory',imageUpload.array('images',2), main_controller.newCategory);
router.post('/rename', main_controller.renameCategory);
router.post('/changeIcon', main_controller.changeIcon);
router.post('/update', main_controller.updateCategory);
router.post('/changeBlackPicture',imageUpload.single('image') ,main_controller.changeBlackPicture);
router.post('/changeWhitePicture',imageUpload.single('image'), main_controller.changeWhitePicture);
router.get('/all', main_controller.fetchAllCategories);


module.exports = router;