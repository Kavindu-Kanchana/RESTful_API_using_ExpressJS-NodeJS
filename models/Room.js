const mongoose = require('mongoose');

//create a mongodb schema for room
const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    capacity: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['Classroom', 'Lecture Hall', 'Lab', 'Projector Room', 'Conference Room'],
        required: true
    },
    //bookings is an array of objects
    //each object has a user, startTime and endTime
    bookings: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        startTime: {
            type: Date,
            required: true
        },
        endTime: {
            type: Date,
            required: true
        }
    }]
});

//export the schema
module.exports = mongoose.model('Room', roomSchema);
    