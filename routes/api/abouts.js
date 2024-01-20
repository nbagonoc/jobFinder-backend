const express = require('express')
const router = express.Router()

const aboutController = require('../../controllers/about.controller')
const isAuth = require('../../middlewares/isAuth')

// authenticated users should be able to read their about
router.get(
    '/',
    isAuth,
    aboutController.getAbout
)

// authenticated users should be able to update
router.put(
    '/',
    isAuth,
    aboutController.updateAbout
)


module.exports = router