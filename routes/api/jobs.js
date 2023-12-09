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

// POST
// api/job/:id/apply
// applicant can apply job
router.post(
    '/:id/apply',
    isAuth,
    jobController.applyJob
)

// GET
// api/jobs
// everyone can view users list
router.get(
    '/',
    jobController.getJobs
)

// GET
// api/jobs
// everyone can view users list
router.get(
    '/owned',
    isModOrAdmin,
    jobController.getOwnedJobs
)

// GET
// api/jobs/:id
// everyone can view job details
router.get(
    '/:id',
    jobController.getJob
)

// GET
// api/jobs/:id/applicants
// get list of applicants associated with the jobID
router.get(
    '/:id/applicants',
    isModOrAdmin,
    jobController.getJobApplicants
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
