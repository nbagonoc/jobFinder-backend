const mongoose = require('mongoose')
const { Schema } = mongoose

const SkillSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    skill: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('Skill', SkillSchema)
