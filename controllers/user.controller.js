const User = require('../models/User')
const Education = require('../models/Education')
const Experience = require('../models/Experience')
const Application = require('../models/Application')
const validator = require('validator')
const sharp = require('sharp')
const S3 = require('aws-sdk/clients/s3')
require('aws-sdk/lib/maintenance_mode_message').suppress = true

const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION,
    bucket: process.env.AWS_BUCKET
})

// VIEW PROFILE
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password -__v')//i think we should hide applications
            .populate('about', 'about')
            .populate('education', 'school degree fieldofstudy from to current description')
            .populate('experience', 'title company location from to current description')

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
        const user = await User.findById(req.params.id)
        .select('-password -__v')
        .populate('about', 'about')
        .populate('education', 'school degree fieldofstudy from to current description')
        .populate('experience', 'title company location from to current description')
        .populate('skill', 'skill')

        if (!user) {
            return res.status(404).json({ message: 'User not found.' })
        }
        return res.status(200).json(user)
    } catch (error) {
        throw new Error(`Something went wrong. ${error}`)
    }
}

// UPDATE USER
const updateProfile = async (req, res) => {
    const validation = validateUpdate(req.body)
    const user = await User.findById(req.user.id).select('-password -__v -applications')

    if (!validation.isValid) {
        return res.status(400).json(validation.errors)
    }
    await handleFileUpload(req.file, user)

    try {
        if (!user) {
            return res.status(404).json({ message: 'User not found.' })
        }
        const { firstName, lastName, phone } = req.body
        user.set({ firstName, lastName, phone })
        
        await user.save()
        
        return res.status(200).json({ message: 'User updated!' })
    } catch (error) {
        // throw new Error(`Something went wrong. ${error}`)
        return res.status(500).json({ error: 'Failed to update profile. Please try again later.' });
    }
}

// VALIDATE UPDATE
const validateUpdate = (data) => {
    let errors = {}
    if (data.firstName === undefined || validator.isEmpty(data.firstName, { ignore_whitespace: true })) {
        errors.firstName = 'First name is required';
    }
    if (data.lastName === undefined || validator.isEmpty(data.lastName, { ignore_whitespace: true })) {
        errors.lastName = 'Last name is required';
    }
    if (data.phone === undefined || validator.isEmpty(data.phone, { ignore_whitespace: true })) {
        errors.phone = 'Phone is required';
    }
    //check mimetype of uploaded file
    if (data.photo !== undefined && !data.photo.match(/(jpg|jpeg|png)$/)) {
        errors.photo = 'Invalid file type. Only jpg, jpeg, and png files are allowed.'
    }
    return {
        errors,
        isValid: Object.keys(errors).length === 0,
    }
}

//CROP PHOTO
const cropPhoto = async (file) => {
    const image = await sharp(file.buffer)
        .resize(150, 150)
        .toBuffer()

    return image
}

// HANDLE FILE UPLOAD
const handleFileUpload = async (file, user) => {
    if (file) {
        file.buffer = await cropPhoto(file)
        const params = {
            Bucket: process.env.AWS_BUCKET,
            Key: `profiles/${user.id}_${file.originalname}`,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read'
        };
        const data = await s3.upload(params).promise() // upload to s3
        user.set({ photo: data.Location }) // set user photo to s3 url
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

module.exports = {
    getProfile,
    getUser,
    // getUsers,
    updateProfile,
    // deleteUser,
    getUserApplications,
    validateUpdate
}
