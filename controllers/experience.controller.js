const Experience = require('../models/Experience')
const User = require('../models/User')
const validator = require('validator')

const createExperience = async (req, res) => {
    const validation = validate(req.body)
    if (!validation.isValid) return res.status(400).json(validation.errors)

    try {
        const newExperience = new Experience({
            user: req.user.id,
            title: req.body.title,
            company: req.body.company,
            location: req.body.location,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            description: req.body.description,
        })

        const createdExperience = await Experience.create(newExperience)

        // Update the corresponding User document to reference the new Experience
        await User.findByIdAndUpdate(req.user.id, { $push: { experience: createdExperience._id } })

        return res.status(201).json(createdExperience)
    } catch (error) {
        return res.status(500).json({ message: `Something went wrong. ${error.message}` })
    }
}

const getExperience = async (req, res) => {
    try {
        const experience = await Experience.find({ user: req.user.id })

        return res.status(200).json(experience)
    } catch (error) {
        return res.status(500).json({ message: `Something went wrong. ${error.message}` })
    }
}

const getExperienceById = async (req, res) => {
    try {
        const experience = await Experience.findById(req.params.id)

        if (!experience) {
            return res.status(404).json({ message: 'Experience not found.' });
        }

        if (experience.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized access to experience record.' });
        }

        return res.status(200).json(experience)
    } catch (error) {
        return res.status(500).json({ message: `Something went wrong. ${error.message}` })
    }
}

const updateExperience = async (req, res) => {
    const validation = validate(req.body)
    if (!validation.isValid) return res.status(400).json(validation.errors)

    try {
        const experience = await Experience.findById(req.params.id)

        if (!experience) {
            return res.status(404).json({ message: 'Experience not found.' })
        }

        if (experience.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized access to experience record.' });
        }

        const updatedExperience = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true })

        return res.status(200).json(updatedExperience)
    } catch (error) {
        return res.status(500).json({ message: `Something went wrong. ${error.message}` })
    }
}

const deleteExperience = async (req, res) => {
    try {
        const experience = await Experience.findById(req.params.id)

        if (!experience) {
            return res.status(404).json({ message: 'Experience not found.' })
        }

        if (experience.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized access to experience record.' });
        }

        await Experience.findByIdAndDelete(req.params.id)

        return res.status(200).json({ message: 'Experience deleted.' })
    } catch (error) {
        return res.status(500).json({ message: `Something went wrong. ${error.message}` })
    }
}

// VALIDATE
const validate = (data) => {
    let errors = {}

    if (validator.isEmpty(data.title)) {
        errors.title = 'Title is required.'
    }
    if (validator.isEmpty(data.company)) {
        errors.company = 'Company is required.'
    }
    if (validator.isEmpty(data.location)) {
        errors.location = 'Location is required.'
    }
    if (validator.isEmpty(data.from)) {
        errors.from = 'From date is required.'
    }
    if (validator.isEmpty(data.to) && !data.current) {
        errors.to = 'To date is required.'
    }
    if (data.current !== undefined && typeof data.current !== 'boolean') {
        errors.current = 'Current must be a boolean.'
    }
    if (validator.isEmpty(data.description)) {
        errors.description = 'Description is required.'
    }
}

module.exports = {
    createExperience,
    getExperience,
    getExperienceById,
    updateExperience,
    deleteExperience,
}

