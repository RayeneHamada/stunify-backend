const multer = require('multer');
const path = require('path');

 const imageStorage = multer.diskStorage({
    // Destination to store image     
    destination: 'public/img', 
   filename: (req, file, cb) => {
     console.log(req.body);
          cb(null, file.fieldname + '_' + Date.now() 
             + path.extname(file.originalname))
            // file.fieldname is name of the field (image)
            // path.extname get the uploaded file extension
    }
});

exports.imageUpload = multer({
    storage: imageStorage,
    limits: {
      fileSize: 1000000 // 1000000 Bytes = 1 MB
    }
})