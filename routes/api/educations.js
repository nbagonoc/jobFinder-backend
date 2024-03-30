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
    educationController.getEducations
)

router.get(
    '/:id',
    isAuth,
    educationController.getEducationById
)

//might not be needing this anymore
router.get(
    '/:id/user',
    isAuth,
    educationController.getEducationsByUserId //might not be needing this anymore
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