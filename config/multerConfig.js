const multer = require('multer');
const path = require('path');

 const imageStorage = multer.diskStorage({
    // Destination to store image     
    destination: 'public/img', 
   filename: (req, file, cb) => {
     cb(null, file.fieldname + '_' + Date.now() 
     + '.jpg')
            // file.fieldname is name of the field (image)
            // path.extname get the uploaded file extension
    }
});

exports.imageUpload = multer({
    storage: imageStorage
})