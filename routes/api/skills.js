const express = require('express')
const router = express.Router()

const skillController = require('../../controllers/skill.controller')
const isAuth = require('../../middlewares/isAuth')

router.post(
    '/',
    isAuth,
    skillController.createSkill
)

router.get(
    '/',
    isAuth,
    skillController.getSkill
)

router.get(
    '/:id/user',
    isAuth,
    skillController.getSkillByUserId
)

router.get(
    '/:id',
    isAuth,
    skillController.getSkillById
)

router.put(
    '/:id',
    isAuth,
    skillController.updateSkill
)

router.delete(
    '/:id',
    isAuth,
    skillController.deleteSkill
)




module.exports = router