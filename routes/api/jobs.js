const express = require('express')
const router = express.Router()

const jobController = require('../../controllers/job.controller')
const isAuth = require('../../middlewares/isAuth')
const isRecruiterOrAdmin = require('../../middlewares/isRecruiterOrAdmin')

// POST
// api/jobs
// recruiter can create job
router.post(
    '/',
    isRecruiterOrAdmin,
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
    isRecruiterOrAdmin,
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
    isRecruiterOrAdmin,
    jobController.getJobApplicants
)

// PUT
// api/jobs/:id
// recruiter can edit job details
router.put(
    '/:id',
    isRecruiterOrAdmin,
    jobController.updateJob
)

// DELETE
// api/jobs/:id
// recruiter can delete job
router.delete(
    '/:id',
    isRecruiterOrAdmin,
    jobController.deleteJob
)

module.exports = router
