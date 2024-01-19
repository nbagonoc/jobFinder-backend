const express = require('express')
const router = express.Router()
// const isAdmin = require('../../middlewares/isAdmin')
const isAuth = require('../../middlewares/isAuth')
const uploadPhoto = require('../../middlewares/upload')
const userController = require('../../controllers/user.controller')
const isRecruiterOrAdmin = require('../../middlewares/isRecruiterOrAdmin')

// GET
// api/users
// deprecate this
// recruiter can view users list
// router.get(
//     '/',
//     isRecruiterOrAdmin,
//     userController.getUsers
// )

// GET
// api/users/profile
// authenticated users can view their profile
router.get(
    '/profile',
    isAuth,
    userController.getProfile
)

// GET
// api/users/applications
// authenticated users can view their applications
router.get(
    '/applications',
    isAuth,
    userController.getUserApplications
)

// GET
// api/users/view/:id
// recruiter can view user details
router.get(
    '/view/:id',
    isRecruiterOrAdmin,
    userController.getUser
)

// PUT
// api/users/update
// authenticated users can edit user details
router.put(
    '/',
    isAuth,
    uploadPhoto,
    userController.updateProfile
)

// DELETE
// api/users/delete/:id
// recruiter can delete user
// router.delete(
//     '/delete/:id',
//     isRecruiterOrAdmin,
//     userController.deleteUser
// )

module.exports = router
