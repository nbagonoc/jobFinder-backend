const express = require('express')
const router = express.Router()

const educationController = require('../../controllers/education.controller')
const isAuth = require('../../middlewares/isAuth')

router.post(
    '/',
    isAuth,
    educationController.createEducation
)

router.get(
    '/',
    isAuth,
    educationController.getEducation
)

router.get(
    '/:id',
    isAuth,
    educationController.getEducationById
)

router.put(
    '/:id',
    isAuth,
    educationController.updateEducation
)

router.delete(
    '/:id',
    isAuth,
    educationController.deleteEducation
)




module.exports = router