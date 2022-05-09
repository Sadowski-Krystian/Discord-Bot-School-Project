const mongoose = require('mongoose')

const clasroomsSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },
    short: {
        type: String,
        required: true
    },
    buildingid: {
        type: String,
        required: false
    },
    sharedroom: {
        type: Boolean,
        required: true
    },
    needssupervision: {
        type: Boolean,
        required: true
    },
    color: {
        type: String,
        required: true
    }
})


module.exports = mongoose.model('classrooms', clasroomsSchema)