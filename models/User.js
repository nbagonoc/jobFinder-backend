const mongoose = require('mongoose')
const { Schema } = mongoose

const UserSchema = new Schema({
    firstName: {  //this should be moved to Profile
        type: String,
        required: true,
    },
    lastName: {  //this should be moved to Profile
        type: String,
        required: true,
    },
    company: {  //this should be moved to Profile
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    photo: { //this should be moved to Profile
        type: String,
        default: 'https://placehold.co/150',
    },
    phone: {  //this should be moved to Profile
        type: String,
        // required: true,
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
    about: {
        type: Schema.Types.ObjectId,
        ref: 'About',
    },
    education: [{
        type: Schema.Types.ObjectId,
        ref: 'Education',
    }],
    experience: [{
        type: Schema.Types.ObjectId,
        ref: 'Experience',
    }],
    skill: [{
        type: Schema.Types.ObjectId,
        ref: 'Skill',
    }],
    password: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('User', UserSchema)
