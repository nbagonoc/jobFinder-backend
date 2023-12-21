const Application = require('../models/Application')
const Job = require('../models/Job')

// APPLY JOB
const applyJob = async (req, res) => {
    try {
        const jobId = req.params.id
        const userId = req.user._id

        const job = await Job.findById(jobId)
        if (!job) {
            return res.status(404).json({ message: 'Job not found.' })
        }

        const existingApplication = await Application.findOne({ user: userId, job: jobId })
        if (existingApplication) {
            return res.status(400).json({ message: 'You already applied to this job.' })
        }

        const newApplication = new Application({
            user: userId,
            job: jobId,
            status: 'Pending',
        })

        await newApplication.save()

        job.applications.push(newApplication._id)
        await job.save()

        return res.status(200).json({ message: 'You have successfully applied to this job.' })
    } catch (error) {
        return res.status(500).json({ message: `Something went wrong. ${error.message}` })
    }
}

// GET USER APPLICATIONS
const getApplicationsFromUser = async (req, res) => {
    try {
        const userId = req.user.id
        
        const applications = await Application
                                    .find({ user: userId })
                                    .select('-user -__v')
                                    .populate('job', 'title position company')
                                    .select('-__v')

        if (!applications) {
            return res.status(404).json({ message: 'Applications not found.' })
        }

        return res.status(200).json(applications)
    } catch (error) {
        return res.status(500).json({ message: `Something went wrong. ${error.message}` })
    }
}

// GET APPLICATIONS FROM JOB
const getApplicationsFromJob = async (req, res) => {
    try {
        const job = await Job
                            .findById(req.params.id)
                            .populate({
                                path: 'applications',
                                populate: {
                                    path: 'user',
                                },
                            })

        if (!job) {
            return res.status(404).json({ message: 'Job not found.' })
        }
        const formattedApplicants = job.applications.map((application) => ({
            _id: application._id,
            user: {
                _id: application.user._id,
                firstName: application.user.firstName,
                lastName: application.user.lastName,
                email: application.user.email,
            },
            status: application.status,
        }))
        return res.status(200).json(formattedApplicants)
    } catch (error) {
        return res.status(500).json({ message: `Something went wrong. ${error.message}` })
    }
}

// UPDATE APPLICATION
const updateApplicationStatus = async (req, res) => {
    try {
        const applicationId = req.params.id
        const status = req.body.status

        const allowedStatus = ['Pending', 'Denied', 'Whitelisted', 'Approved', ]
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: 'Invalid status provided.' })
        }

        const application = await Application.findById(applicationId)
        if (!application) {
            return res.status(404).json({ message: 'Application not found.' })
        }

        application.status = status
        await application.save()

        return res.status(200).json({ message: 'Application updated successfully.' })
    } catch (error) {
        return res.status(500).json({ message: `Something went wrong. ${error.message}` })
    }
}

module.exports = {
    applyJob,
    getApplicationsFromUser,
    getApplicationsFromJob,
    updateApplicationStatus,
}