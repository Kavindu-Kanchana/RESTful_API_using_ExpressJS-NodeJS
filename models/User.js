const mongoose = require('mongoose');

//create a mongodb schema for users
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Admin', 'Faculty', 'Student'],
        default: 'Student'
    }
});

//export the schema
module.exports = mongoose.model('User', userSchema);