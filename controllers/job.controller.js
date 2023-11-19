const Job = require('../models/Job')
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
            position: req.body.position,
            description: req.body.description,
            employer: req.user._id,
        })

        await Job.create(newJob)
        res.status(200).json({ message: 'Job created' })
    } catch (error) {
        throw new Error(`Something went wrong. ${error}`)
    }
}

// GET JOB
const getJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)

        if (!job) {
            return res.status(404).json({ message: 'job not found.' })
        }
        return res.status(200).json(job)
    } catch (error) {
        throw new Error(`Something went wrong. ${error}`)
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

// GET OWNED JOB LIST (Employer owned)
const getOwnedJobs = async (req, res) => {
    try {
        const userId = req.user._id;
        const jobs = await Job.find({ employer: userId }).sort({ _id: -1 }).select('-description')
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
        await Job.remove()
        return res.status(200).json({ message: 'job has been removed.' })
    } catch (error) {
        throw new Error(`Something went wrong. ${error}`)
    }
}

// VALIDATE UPDATE
const validate = (data) => {
    let errors = {}

    if (validator.isEmpty(data.title, { ignore_whitespace: true }))
        errors.title = 'Title is required'
    if (validator.isEmpty(data.company, { ignore_whitespace: true }))
        errors.company = 'Company is required'
    if (validator.isEmpty(data.location, { ignore_whitespace: true }))
        errors.location = 'Location is required'
    if (validator.isEmpty(data.position, { ignore_whitespace: true }))
        errors.position = 'Position is required'
    if (validator.isEmpty(data.description, { ignore_whitespace: true }))
        errors.description = 'Description is required'
    return {
        errors,
        isValid: Object.keys(errors).length === 0,
    }
}

module.exports = {
    createJob,
    getJob,
    getJobs,
    getOwnedJobs,
    updateJob,
    deleteJob,
    validate,
}
