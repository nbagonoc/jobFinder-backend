const Education = require('../models/Education')
const User = require('../models/User')
const validator = require('validator')

const createEducation = async (req, res) => {
    const validation = validate(req.body)
    if (!validation.isValid) return res.status(400).json(validation.errors)

    try {
        const newEducation = new Education({
            user: req.user.id,
            school: req.body.school,
            degree: req.body.degree,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
        })

        const createdEducation = await Education.create(newEducation)

        // Update the corresponding User document to reference the new Education
        await User.findByIdAndUpdate(req.user.id, { $push: { education: createdEducation._id } })

        return res.status(201).json({ message: 'Education created.' })
    } catch (error) {
        return res.status(500).json({ message: `Something went wrong. ${error.message}` })
    }
}

const getEducation = async (req, res) => {
    try {
        const education = await Education.find({ user: req.user.id })

        return res.status(200).json(education)
    } catch (error) {
        return res.status(500).json({ message: `Something went wrong. ${error.message}` })
    }
}

const getEducationById = async (req, res) => {
    try {
        const education = await Education.findById(req.params.id)

        if (!education) {
            return res.status(404).json({ message: 'Education not found.' });
        }

        if (education.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized access to education record.' });
        }

        return res.status(200).json(education)
    } catch (error) {
        return res.status(500).json({ message: `Something went wrong. ${error.message}` })
    }
}

const updateEducation = async (req, res) => {
    const validation = validate(req.body)
    if (!validation.isValid) return res.status(400).json(validation.errors)

    try {
        const education = await Education.findById(req.params.id)

        if (!education) {
            return res.status(404).json({ message: 'Education not found.' })
        }

        if (education.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized access to education record.' });
        }

        education.school = req.body.school
        education.degree = req.body.degree
        education.from = req.body.from
        education.to = req.body.to
        education.current = req.body.current

        await education.save()

        return res.status(200).json({ message: 'Education updated.' })
    } catch (error) {
        return res.status(500).json({ message: `Something went wrong. ${error.message}` })
    }
}

const deleteEducation = async (req, res) => {
    try {
        const education = await Education.findById(req.params.id)

        if (!education) {
            return res.status(404).json({ message: 'Education not found.' })
        }

        if (education.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized access to education record.' });
        }

        await education.remove()

        return res.status(200).json({ message: 'Education deleted.' })
    } catch (error) {
        return res.status(500).json({ message: `Something went wrong. ${error.message}` })
    }
}

// VALIDATE
const validate = (data) => {
    let errors = {}

    if (validator.isEmpty(data.school)) {
        errors.school = 'School is required.'
    }
    if (validator.isEmpty(data.degree)) {
        errors.degree = 'Degree is required.'
    }
    if (validator.isEmpty(data.from)) {
        errors.from = 'From date is required.'
    }
    if (validator.toDate(data.from) === null) {
        errors.from = 'From date is invalid.'
    }
    if (!data.current && validator.isEmpty(data.to)) {
        errors.to = 'To date is required.'
    }
    if (data.current !== undefined && typeof data.current !== 'boolean') {
        errors.current = 'Current must be a boolean.'
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0,
    }
}

module.exports = {
    createEducation,
    getEducation,
    getEducationById,
    updateEducation,
    deleteEducation,
}