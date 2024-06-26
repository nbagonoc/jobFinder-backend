const express = require('express')
const router = express.Router()

const applicationController = require('../../controllers/application.controller')
const isAuth = require('../../middlewares/isAuth')
const isRecruiterOrAdmin = require('../../middlewares/isRecruiterOrAdmin')

// POST
// api/applications/:id/job
// applicant can apply job
router.post(
    '/:id/job',
    isAuth,
    applicationController.applyJob
)

// GET
// api/applications/:id/job
// get list of applicants associated with the job_id
router.get(
    '/:id/job',
    isRecruiterOrAdmin,
    applicationController.getApplicationsFromJob
)

// GET
// api/applications
// get list of applications associated with the user_id
router.get(
    '/',
    isAuth,
    applicationController.getApplicationsFromUser
)

// PUT
// api/applications/:id
// recruiter can update application status
router.put(
    '/:id',
    isRecruiterOrAdmin,
    applicationController.updateApplicationStatus
)

module.exports = router
