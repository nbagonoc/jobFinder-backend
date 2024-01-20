const About = require('../models/About')
const validator = require('validator')

// CREATE ABOUT
const createAbout = async (req, res) => {
    const validation = validate(req.body)
    if (!validation.isValid) return res.status(400).json(validation.errors)

    try {
        const newAbout = new About({
            user: req.user._id,
            about: req.body.about,
        })

        await About.create(newAbout)
        res.status(200).json({ message: 'About created' })
    } catch (error) {
        throw new Error(`Something went wrong. ${error}`)
    }
}

// GET USER'S ABOUT
const getAbout = async (req, res) => {
    try {
        const about = await About.findOne({ user: req.user._id })
        
        if (!about) {
            return res.status(404).json({ message: 'About not found.' })
        }

        const formattedResponse = {
            about: about.about,
        };

        return res.status(200).json(formattedResponse)
    } catch (error) {
        return res.status(500).json({ message: `Something went wrong. ${error.message}` })
    }
}


// UPDATE USER'S ABOUT
const updateAbout = async (req, res) => {
    const validation = validate(req.body)
    if (!validation.isValid) return res.status(400).json(validation.errors)

    try {

        const about = await About.findOne({ user: req.user._id })
        
        if (!about) {
            return res.status(404).json({ message: 'About not found.' })
        }

        about.about = req.body.about
        await about.save()

        return res.status(200).json({ message: 'About updated.' })
    } catch (error) {
        return res.status(500).json({ message: `Something went wrong. ${error.message}` })
    }
}


// VALIDATE
const validate = (data) => {
    let errors = {}

    if (!('about' in data) || validator.isEmpty(data.about, { ignore_whitespace: true })) {
        errors.about = 'About is required.'
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0,
    }
}

module.exports = {
    createAbout,
    getAbout,
    updateAbout,
}