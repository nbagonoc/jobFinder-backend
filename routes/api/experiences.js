const express = require('express')
const router = express.Router()

const experienceController = require('../../controllers/experience.controller')
const isAuth = require('../../middlewares/isAuth')

router.post(
    '/',
    isAuth,
    experienceController.createExperience
)

router.get(
    '/',
    isAuth,
    experienceController.getExperience
)

router.get(
    '/:id',
    isAuth,
    experienceController.getExperienceById
)

//might not be needing this anymore
router.get(
    '/:id/user',
    isAuth,
    experienceController.getExperienceByUserId
)

router.put(
    '/:id',
    isAuth,
    experienceController.updateExperience
)

router.delete(
    '/:id',
    isAuth,
    experienceController.deleteExperience
)




module.exports = router