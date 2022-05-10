const mongoose = require('mongoose')

const teachersSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },

    short: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    bell: {
        type: String,
        required: false
    },
    color: {
        type: String,
        required: true
    }
})


module.exports = mongoose.model('teachers', teachersSchema)