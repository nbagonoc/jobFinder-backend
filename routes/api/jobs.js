const express = require('express')
const router = express.Router()
const passport = require('passport')
const jobController = require('../../controllers/job.controller')
const isModOrAdmin = require('../../guards/isModOrAdmin')

// POST
// api/jobs
// employeer can create job
router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    jobController.createJob
)

// GET
// api/jobs
// users can view users list
router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    jobController.getJobs
)

// GET
// api/jobs/view/:id
// users can view user details
router.get(
    '/view/:id',
    passport.authenticate('jwt', { session: false }),
    jobController.getJob
)

// PUT
// api/jobs/update
// employeers can edit user details
router.put(
    '/update/:id',
    passport.authenticate('jwt', { session: false }),
    [isModOrAdmin],
    jobController.updateJob
)

// DELETE
// api/jobs/delete/:id
// employers can delete user
router.delete(
    '/delete/:id',
    passport.authenticate('jwt', { session: false }),
    [isModOrAdmin],
    jobController.deleteJob
)

module.exports = router
