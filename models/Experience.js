const mongoose = require('mongoose')
const { Schema } = mongoose

const ExperienceSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    from: {
        type: Date,
        required: true,
    },
    to: {
        type: Date,
    },
    current: {
        type: Boolean,
        default: false,
    },
    description: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('Experience', ExperienceSchema)
