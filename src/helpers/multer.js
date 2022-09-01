const path = require('path');
// import multer
const multer = require('multer');
// set fileFilter function 
const fileFilter = (req, file, cb) => {

    if(file.fieldname === 'image') {
        if (file.mimetype === 'image/jpeg' ||
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/svg+xml' ||
            file.mimetype === 'image/webp') {
            cb(null, true);
        } else {
            cb({
                message: "Unsupported Image Format",
            }, false);
        }

    } else if(file.fieldname === 'voice') {
        if (
            file.mimetype === 'audio/mp3' ||
            file.mimetype === 'audio/wav' ||
            file.mimetype === 'audio/opus' ||
            file.mimetype === 'audio/mp4' ||
            file.mimetype === 'audio/eac3' ||
            file.mimetype === 'audio/aac' ||
            file.mimetype === 'audio/ac3' ||
            file.mimetype === 'audio/AMR' ||
            file.mimetype === 'audio/mpeg') {
            cb(null, true);
        } else {
            cb({
                message: "Unsupported Voice File Format",
            }, false);
        }
    } else {
        cb({
            message: "Unsupported File Format",
        }, false);
    }
};

// set storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "image") {
            cb(null, './assets/uploads/report_images')
        }
        else if (file.fieldname === "voice") {
            cb(null, './assets/uploads/report_voices');
        }
    }
    ,
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().split(":").join("").split("-").join("") +
            "-" +
            req.body.firstName +
            Math.floor(1000 + Math.random() * 9000) + file.fieldname + path.extname(file.originalname));
    }
});

// set upload for multer
exports.upload = multer({
    storage: storage,
    limits: {
        fileSize: 10000000
    },
    fileFilter: fileFilter
});