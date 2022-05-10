const mongoose = require('mongoose')

const cachedTeachersPlansSvgSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },

    plan: {
        type: String,
        required: true
    }
})


module.exports = mongoose.model('svg-teaches-plans', cachedTeachersPlansSvgSchema)