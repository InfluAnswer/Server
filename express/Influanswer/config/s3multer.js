const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
aws.config.loadFromPath('./config/s3config.json');
const s3 = new aws.S3();

//버킷 하나 만들기
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'influanswer',
        acl: 'public-read-write',
        key: function(req, file, cb) {
            cb(null, Date.now() + '.' + file.originalname);
        }
    })
});

module.exports = upload
