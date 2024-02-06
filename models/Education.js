const mongoose = require('mongoose')
const { Schema } = mongoose

const EducationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    school: {
        type: String,
        required: true,
    },
    degree: {
        type: String,
        required: true,
    },
    fieldofstudy: {
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
})

module.exports = mongoose.model('Education', EducationSchema)
