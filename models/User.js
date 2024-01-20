const mongoose = require('mongoose')
const { Schema } = mongoose

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        default: 'https://placehold.co/150',
    },
    phone: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'applicant',
        required: true,
    },
    applications: [{
        type: Schema.Types.ObjectId,
        ref: 'Application',
    }],
    password: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('User', UserSchema)
