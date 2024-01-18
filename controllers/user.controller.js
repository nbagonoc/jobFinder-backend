const User = require('../models/User')
const Application = require('../models/Application')
const validator = require("validator")

// VIEW PROFILE
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password -__v -applications')
        if (!user) {
            return res.status(404).json({ message: 'User not found.' })
        }
        return res.status(200).json(user)
    } catch (error) {
        throw new Error(`Something went wrong. ${error}`)
    }
}

// GET USER APPLICATIONS (deprecate this soon, once frontend is uses new endpoint /api/applications)
const getUserApplications = async (req, res) => {
    try {
        const userId = req.user.id
        
        const applications = await Application.find({ user: userId })
        .populate('job', 'title position')
        .select('-__v')

        if (!applications) {
            return res.status(404).json({ message: 'Applications not found.' })
        }

        return res.status(200).json(applications)
    } catch (error) {
        return res.status(500).json({ message: `Something went wrong. ${error.message}` })
    }
}


// GET USER
const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password -__v')

        if (!user) {
            return res.status(404).json({ message: 'User not found.' })
        }
        return res.status(200).json(user)
    } catch (error) {
        throw new Error(`Something went wrong. ${error}`)
    }
}

// GET USERS
// disable this til we need
// const getUsers = async (req, res) => {
//     try {
//         const users = await User.find({ role: 'user' }).select('-password -__v')
//         if (!users) {
//             return res.status(404).json({ message: 'Users not found.' })
//         }
//         return res.status(200).json(users)
//     } catch (error) {
//         throw new Error(`Something went wrong. ${error}`)
//     }
// }

// UPDATE USER
const updateProfile = async (req, res) => {
    const validation = validateUpdate(req.body)
    const user = await User.findById(req.user.id).select('-password -__v -applications')
    if (!validation.isValid) {
        return res.status(400).json(validation.errors)
    }
    try {
        if (!user) {
            return res.status(404).json({ message: 'User not found.' })
        }

        const { firstName, lastName } = req.body
        user.set({ firstName, lastName })
        await user.save()
        return res.status(200).json({ message: 'User updated!' })
    } catch (error) {
        throw new Error(`Something went wrong. ${error}`)
    }
}

// DELETE USER
// disable this til we need
// const deleteUser = async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id)
//         if (!user) {
//             return res.status(404).json({ message: 'User not found.' })
//         }
//         await user.remove()
//         return res.status(200).json({ message: 'User has been removed.' })
//     } catch (error) {
//         throw new Error(`Something went wrong. ${error}`)
//     }
// }


// VALIDATE UPDATE
const validateUpdate = (data) => {
    let errors = {}
    if (data.firstName === undefined || validator.isEmpty(data.firstName, { ignore_whitespace: true })) {
        errors.firstName = 'First name is required';
    }
    if (data.lastName === undefined || validator.isEmpty(data.lastName, { ignore_whitespace: true })) {
        errors.lastName = 'Last name is required';
    }
    return {
        errors,
        isValid: Object.keys(errors).length === 0,
    }
}

module.exports = {
    getProfile,
    getUser,
    // getUsers,
    updateProfile,
    // deleteUser,
    getUserApplications,
    validateUpdate
}
