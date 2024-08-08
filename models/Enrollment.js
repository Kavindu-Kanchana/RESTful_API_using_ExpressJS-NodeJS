const mongoose = require('mongoose');

//create a mongodb schema for student enrollment in courses
const enrollmentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    }
});

//export the schema
module.exports = mongoose.model('Enrollment', enrollmentSchema);
    