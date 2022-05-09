const mongoose = require('mongoose')

const periodsSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },

    period: {
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
    starttime: {
        type: Number,
        required: true
    },
    endtime: {
        type: Number,
        required: true
    }
})


module.exports = mongoose.model('periods', periodsSchema)