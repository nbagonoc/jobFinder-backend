const express = require('express')
const router = express.Router()

const aboutController = require('../../controllers/about.controller')
const isAuth = require('../../middlewares/isAuth')

router.get(
    '/',
    isAuth,
    aboutController.getAbout
)

router.get(
    '/:id',
    aboutController.getAboutByUserId
)

router.put(
    '/',
    isAuth,
    aboutController.updateAbout
)


module.exports = router