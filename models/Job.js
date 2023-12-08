const mongoose = require('mongoose')
const { Schema } = mongoose

const JobSchema = new Schema({
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
    category: {
        type: String,
        enum: ['Information and Technology', 'Business and Management', 'Healthcare', 'Education', 'Engineering', 'Sales and Customer Service', 'Creative Arts and Design', 'Science and Research', 'Hospitality and Tourism'],
        required: true,
    },
    salary: {
        type: Number,
        required: true,
    },
    position: {
        type: String,
        required: true,
    },
    arrangement: {
        type: String,
        enum: ['On-site', 'Remote', 'Hybrid'],
        required: true,
    },
    type: {
        type: String,
        enum: ['Full-time', 'Part-time'],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    recruiter: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    applicants: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    date: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('Job', JobSchema)
