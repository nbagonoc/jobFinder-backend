const Job = require('../models/Job')
const Application = require('../models/Application')
const validator = require('validator')

// CREATE JOB
const createJob = async (req, res) => {
    const validation = validate(req.body)
    if (!validation.isValid) return res.status(400).json(validation.errors)

    try {
        const newJob = new Job({
            title: req.body.title,
            company: req.body.company,
            location: req.body.location,
            category: req.body.category,
            salary: req.body.salary,
            position: req.body.position,
            arrangement: req.body.arrangement,
            type: req.body.type,
            description: req.body.description,
            recruiter: req.user._id,
        })

        await Job.create(newJob)
        res.status(200).json({ message: 'Job created' })
    } catch (error) {
        throw new Error(`Something went wrong. ${error}`)
    }
}

// APPLY JOB (deprecate this soon, once frontend is uses new endpoint)
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


// GET JOB
const getJob = async (req, res) => {
    try {
        const job = await Job
                            .findById(req.params.id)
                            .populate({
                                path: 'applications',
                                select: '_id user',
                                populate: {
                                    path: 'user',
                                    select: '_id'
                                }
                            })
                            .exec()

        if (!job) {
            return res.status(404).json({ message: 'job not found.' })
        }
        return res.status(200).json(job)
    } catch (error) {
        throw new Error(`Something went wrong. ${error}`)
    }
}

// GET JOB APPLICANTS (deprecate this soon, once frontend is uses new endpoint)
const getJobApplicants = async (req, res) => {
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

// GET JOB LIST
const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find().sort({ _id: -1 }).select('-description')
        if (!jobs || jobs.length === 0) {
            return res.status(404).json({ message: 'Jobs not found.' })
        }
        return res.status(200).json(jobs)
    } catch (error) {
        throw new Error(`Something went wrong. ${error}`)
    }
}

// GET OWNED JOB LIST (Recruiter owned)
const getOwnedJobs = async (req, res) => {
    try {
        const userId = req.user._id
        const jobs = await Job.find({ recruiter: userId }).sort({ _id: -1 }).select('-description')
        if (!jobs || jobs.length === 0) {
            return res.status(404).json({ message: 'Jobs not found.' })
        }
        return res.status(200).json(jobs)
    } catch (error) {
        throw new Error(`Something went wrong. ${error}`)
    }
}

// UPDATE JOB
const updateJob = async (req, res) => {
    const validation = validate(req.body)
    if (!validation.isValid) {
        return res.status(400).json(validation.errors)
    }
    try {
        const job = await Job.findById(req.params.id)
        if (!job) {
            return res.status(404).json({ message: 'job not found.' })
        }

        job.set({ ...req.body })
        await job.save()

        return res.status(200).json({ message: 'job updated!' })
    } catch (error) {
        throw new Error(`Something went wrong. ${error}`)
    }
}

// DELETE JOB
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
        if (!job) {
            return res.status(404).json({ message: 'job not found.' })
        }
        await Job.deleteOne()
        return res.status(200).json({ message: 'job has been removed.' })
    } catch (error) {
        throw new Error(`Something went wrong. ${error}`)
    }
}

// VALIDATE
const validate = (data) => {
    let errors = {}
    let validCategories = ['Information and Technology', 'Business and Management', 'Healthcare', 'Education', 'Engineering', 'Sales and Customer Service', 'Creative Arts and Design', 'Science and Research', 'Hospitality and Tourism']
    let validArrangements = ['On-site', 'Remote', 'Hybrid']
    let validtypes = ['Full-time', 'Part-time']

    if (!('title' in data) || validator.isEmpty(data.title, { ignore_whitespace: true }))
        errors.title = 'Title is required'
    if (!('company' in data) || validator.isEmpty(data.company, { ignore_whitespace: true }))
        errors.company = 'Company is required'
    if (!('location' in data) || validator.isEmpty(data.location, { ignore_whitespace: true }))
        errors.location = 'Location is required'
    // category
    if (!('category' in data) || validator.isEmpty(data.category, { ignore_whitespace: true })) {
        errors.category = 'Category is required'
    } else if (!validCategories.includes(data.category)) {
        errors.category = 'Category is invalid'
    }
    // arrangement
    if (!('arrangement' in data) || validator.isEmpty(data.arrangement, { ignore_whitespace: true })) {
        errors.arrangement = 'Arrangements is required'
    } else if (!validArrangements.includes(data.arrangement)) {
        errors.arrangement = 'Arrangement is invalid'
    }
    // type
    if (!('type' in data) || validator.isEmpty(data.type, { ignore_whitespace: true })) {
        errors.type = 'Type is required'
    } else if (!validtypes.includes(data.type)) {
        errors.type = 'Type is invalid'
    }
    if (!('salary' in data) || (typeof data.salary !== 'number' && !isNaN(data.salary)))
        errors.salary = 'Salary is required / should be a number'
    if (!('position' in data) || validator.isEmpty(data.position, { ignore_whitespace: true }))
        errors.position = 'Position is required'
    if (!('description' in data) || validator.isEmpty(data.description, { ignore_whitespace: true }))
        errors.description = 'Description is required'
    // status
    if ('status' in data && !validator.isEmpty(data.status, { ignore_whitespace: true }) && data.status !== 'Active' && data.status !== 'Closed')
        errors.status = 'Status is invalid'
    return {
        errors,
        isValid: Object.keys(errors).length === 0,
    }
}

module.exports = {
    createJob,
    applyJob,
    getJob,
    getJobApplicants,
    getJobs,
    getOwnedJobs,
    updateJob,
    deleteJob,
    validate,
}
