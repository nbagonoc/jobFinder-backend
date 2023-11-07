const express = require('express')
const router = express.Router()
const isAdmin = require('../../middlewares/isAdmin')
const userController = require('../../controllers/user.controller')
const isModOrAdmin = require('../../middlewares/isModOrAdmin')

// GET
// api/users
// administrator/moderator can view users list
router.get(
    '/',
    isModOrAdmin,
    userController.getUsers
)

// GET
// api/users/profile
// user view view their profile
router.get(
    '/profile',
    userController.getProfile
)

// GET
// api/users/view/:id
// administrator/moderator can view user details
router.get(
    '/view/:id',
    isModOrAdmin,
    userController.getUser
)

// PUT
// api/users/update
// administrator/moderator can edit user details
router.put(
    '/update/:id',
    isModOrAdmin,
    userController.updateUser
)

// DELETE
// api/users/delete/:id
// administrator/moderator can delete user
router.delete(
    '/delete/:id',
    isModOrAdmin,
    userController.deleteUser
)

module.exports = router
