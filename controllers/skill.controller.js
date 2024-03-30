const Skill = require('../models/Skill')
const User = require('../models/User')
const validator = require('validator')

const createSkill = async (req, res) => {
    const validation = validate(req.body)
    if (!validation.isValid) return res.status(400).json(validation.errors)

    try {
        const newSkill = new Skill({
            user: req.user.id,
            skill: req.body.skill,
        })

        const createdSkill = await Skill.create(newSkill)

        // Update the corresponding User to reference the new Skill
        await User.findByIdAndUpdate(req.user.id, { $push: { skill: createdSkill._id } })

        return res.status(201).json({ message: 'Skill created.' })
    } catch (error) {
        return res.status(500).json({ message: `Something went wrong. ${error.message}` })
    }
}

const getSkill = async (req, res) => {
    try {
        const skill = await Skill.find({ user: req.user.id }).select('-user')

        return res.status(200).json(skill)
    } catch (error) {
        return res.status(500).json({ message: `Something went wrong. ${error.message}` })
    }
}

const getSkillByUserId = async (req, res) => { //might not be needing this anymore
    try {
        const user = await User.findById(req.params.id).populate('skill', '-user')

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).json(user.skill)
    } catch (error) {
        return res.status(500).json({ message: `Something went wrong. ${error.message}` })
    }
}

const getSkillById = async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id)

        if (!skill) {
            return res.status(404).json({ message: 'Skill not found.' });
        }

        if (skill.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized access to skill record.' });
        }

        return res.status(200).json(skill)
    } catch (error) {
        return res.status(500).json({ message: `Something went wrong. ${error.message}` })
    }
}

const updateSkill = async (req, res) => {
    const validation = validate(req.body)
    if (!validation.isValid) return res.status(400).json(validation.errors)

    try {
        const skill = await Skill.findById(req.params.id)

        if (!skill) {
            return res.status(404).json({ message: 'Skill not found.' })
        }

        if (skill.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized access to skill record.' });
        }

        skill.skill = req.body.skill

        await skill.save()

        return res.status(200).json({ message: 'Skill updated.' })
    } catch (error) {
        return res.status(500).json({ message: `Something went wrong. ${error.message}` })
    }
}

const deleteSkill = async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id)

        if (!skill) {
            return res.status(404).json({ message: 'Skill not found.' })
        }

        if (skill.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized access to skill record.' });
        }

        await skill.remove()

        return res.status(200).json({ message: 'Skill deleted.' })
    } catch (error) {
        return res.status(500).json({ message: `Something went wrong. ${error.message}` })
    }
}

// VALIDATE
const validate = (data) => {
    let errors = {}

    if (validator.isEmpty(data.skill)) {
        errors.skill = 'Skill is required.'
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0,
    }
}

module.exports = {
    createSkill,
    getSkill,
    getSkillByUserId, //might not be needing this anymore
    getSkillById,
    updateSkill,
    deleteSkill,
}