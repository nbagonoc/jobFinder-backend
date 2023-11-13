const express = require('express')
const router = express.Router()

const jobController = require('../../controllers/job.controller')
const isAuth = require('../../middlewares/isAuth')
const isModOrAdmin = require('../../middlewares/isModOrAdmin')

// POST
// api/jobs
// recruiter can create job
router.post(
    '/',
    isModOrAdmin,
    jobController.createJob
)

// GET
// api/jobs
// everyone can view users list
router.get(
    '/',
    jobController.getJobs
)

// GET
// api/jobs/:id
// everyone can view job details
router.get(
    '/:id',
    jobController.getJob
)

// PUT
// api/jobs/:id
// recruiter can edit job details
router.put(
    '/:id',
    isModOrAdmin,
    jobController.updateJob
)

// DELETE
// api/jobs/:id
// recruiter can delete job
router.delete(
    '/:id',
    isModOrAdmin,
    jobController.deleteJob
)

module.exports = router
