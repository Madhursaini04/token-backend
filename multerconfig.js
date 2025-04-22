const multer = require("multer");
const path = require("path");

// Allowed file types
const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg',];

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./upload");
    },
    filename: (req, file, callback) => {
        const filename = `image_${Date.now()}_${file.originalname}`;
        callback(null, filename);
    }
});

// File filter for MIME type
const fileFilter = (req, file, callback) => {
    if (allowedTypes.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(new Error('Only .jpeg, .jpg and .png files are allowed'), false);
    }
};

// File size limit: 2MB (in bytes)
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2 MB
    }
});




module.exports = upload;    
