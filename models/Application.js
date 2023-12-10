const mongoose = require('mongoose')
const { Schema } = mongoose

const ApplicationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    job: {
        type: Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Denied', 'Whitelisted', 'Approved'],
        default: 'Pending'
    },
    date: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('Application', ApplicationSchema)
