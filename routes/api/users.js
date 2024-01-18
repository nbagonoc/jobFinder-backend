const express = require('express')
const multer = require('multer')
const isAdmin = require('../../middlewares/isAdmin')
const isAuth = require('../../middlewares/isAuth')
const userController = require('../../controllers/user.controller')
const isRecruiterOrAdmin = require('../../middlewares/isRecruiterOrAdmin')

const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

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
    upload.single('photo'),
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
