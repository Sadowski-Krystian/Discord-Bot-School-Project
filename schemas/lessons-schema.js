const mongoose = require('mongoose')

const lessonsSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },

    subjectid: {
        type: String,
        required: true
    },
    teacherids: {
        type: Array,
        required: true
    },
    groupids:{
        type: Array,
        required: true
    },
    classids:{
        type: Array,
        required: true
    },
    count:{
        type: Number,
        require: true
    },
    durationperiods:{
        type: Number,
        require: true
    },
    classroomidss:{
        type: Array,
        require: true
    },
    terms:{
        type: String,
        required: true
    }
})


module.exports = mongoose.model('lessons', lessonsSchema)