const mongoose = require('mongoose')
const { Schema } = mongoose

const AboutSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    about: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('About', AboutSchema)
