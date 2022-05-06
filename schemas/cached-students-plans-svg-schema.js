const mongoose = require('mongoose')

const cachedStudentsPlansSvgSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },

    plan: {
        type: String,
        required: true
    }
})


module.exports = mongoose.model('svg-students-plans', cachedStudentsPlansSvgSchema)