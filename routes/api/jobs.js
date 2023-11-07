const express = require('express')
const router = express.Router()

const jobController = require('../../controllers/job.controller')
const isAuth = require('../../middlewares/isAuth')
const isModOrAdmin = require('../../middlewares/isModOrAdmin')

// POST
// api/jobs
// employeer can create job
router.post(
    '/',
    isAuth,
    jobController.createJob
)

// GET
// api/jobs
// users can view users list
router.get(
    '/',
    isAuth,
    jobController.getJobs
)

// GET
// api/jobs/view/:id
// users can view user details
router.get(
    '/view/:id',
    isAuth,
    jobController.getJob
)

// PUT
// api/jobs/update
// employeers can edit user details
router.put(
    '/update/:id',
    isModOrAdmin,
    jobController.updateJob
)

// DELETE
// api/jobs/delete/:id
// employers can delete user
router.delete(
    '/delete/:id',
    isModOrAdmin,
    jobController.deleteJob
)

module.exports = router
