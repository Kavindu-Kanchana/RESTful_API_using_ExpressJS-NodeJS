const mongoose = require('mongoose');

//creates a new mongodb instance which defines the schema for notifications
const notificationSchema = new mongoose.Schema({
    sender: {
        //create a ObjectID type field that references the User model
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        //required means every notification must have a sender
        required: true
    },
    receiver: {
        //create a ObjectID type field that references the User model
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        //required means every notification must have a receiver
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        //enumerate that takes only these values
        //therefore the String should be one of these
        enum: ['timetableChange', 'roomChange', 'announcement'],
        required: true
    },
    timestamp: {
        type: Date,
        //if nothing given, use currrent date
        default: Date.now
    }
});

//export the schema
module.exports = mongoose.model('Notification', notificationSchema);
