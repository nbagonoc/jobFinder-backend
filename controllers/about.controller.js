const About = require('../models/About')
const User = require('../models/User')
const validator = require('validator')

// CREATE ABOUT IF USER DOESN'T HAVE ONE
const createAbout = async (userId, aboutText) => {
    const newAbout = new About({
        user: userId,
        about: aboutText,
    })
    const createdAbout = await About.create(newAbout)
    // Update the corresponding User document to reference the new About
    await User.findByIdAndUpdate(userId, { $set: { about: createdAbout._id } })

    return createdAbout
}

// UPDATE USER'S ABOUT
const updateAbout = async (req, res) => {
    const validation = validate(req.body)
    if (!validation.isValid) return res.status(400).json(validation.errors)

    try {
        let about = await About.findOne({ user: req.user._id })

        if (!about) {
            // If the user doesn't have an About document, create one
            about = await createAbout(req.user._id, req.body.about)
            return res.status(200).json({ message: 'About created' })
        }

        about.about = req.body.about
        await about.save()

        return res.status(200).json({ message: 'About updated.' })
    } catch (error) {
        return res.status(500).json({ message: `Something went wrong. ${error.message}` })
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
        }

        return res.status(200).json(formattedResponse)
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
    // createAbout,
    getAbout,
    updateAbout,
}