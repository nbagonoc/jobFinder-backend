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
// api/jobs/view/:id
// everyone can view job details
router.get(
    '/view/:id',
    jobController.getJob
)

// PUT
// api/jobs/update
// recruiter can edit job details
router.put(
    '/update/:id',
    isModOrAdmin,
    jobController.updateJob
)

// DELETE
// api/jobs/delete/:id
// recruiter can delete job
router.delete(
    '/delete/:id',
    isModOrAdmin,
    jobController.deleteJob
)

module.exports = router
