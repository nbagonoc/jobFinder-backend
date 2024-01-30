const multer = require('multer')
const storage = multer.memoryStorage() // refactor this to use multer-s3
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 1 // 1MB
    }
})

const uploadPhoto = async (req, res, next) => {
    upload.single('photo')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: 'File size limit is only 1MB' })
        } else if (err) {
            return res.status(500).json({ message: 'Something went wrong' })
        }
        next();
    });
}

module.exports = uploadPhoto