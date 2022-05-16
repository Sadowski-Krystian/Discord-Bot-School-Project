const mongoose = require('mongoose')

const cardsSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },

    lessonid: {
        type: String,
        required: true
    },
    period: {
        type: String,
        required: true
    },
    days:{
        type: String,
        required: true
    }
})


module.exports = mongoose.model('cards', cardsSchema)