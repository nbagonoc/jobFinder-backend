const express = require('express')
const router = express.Router()

const authController = require('../../controllers/auth.controller')
const isAuth = require('../../middlewares/isAuth')

// POST
//  api/auth/register
//  register process
router.post(
    '/register',
    authController.register
)

// POST
//  api/auth/login
//  Login process
router.post(
    '/login',
    authController.login
)

// GET
// api/auth/test
// test if the backend is secured
router.get(
    '/test',
    isAuth,
    authController.authTest
)

module.exports = router
