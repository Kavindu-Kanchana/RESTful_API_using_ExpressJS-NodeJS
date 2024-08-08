const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

//import errorHandler/logger middleware
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

//import routes
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');
const timetableRoutes = require('./routes/timetable');
const roomRoutes = require('./routes/room');
const enrollmentRoutes = require('./routes/enrollment');
const notificationRoutes = require('./routes/notifications');

const app = express();

// Middleware
app.use(express.json({ extended: false }));    //body parser

//MongoDB connection - gets URI from .env
//if successful displays a message
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Successfully Connected to MongoDB'))
.catch(err => console.log(err));

// Routes Define
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/room', roomRoutes);
app.use('/api/enrollment', enrollmentRoutes);
app.use('/api/notifications', notificationRoutes);

//error handler middleware
app.use(errorHandler);

//gets port from .env or defaults to 3000
const PORT = process.env.PORT || 3000;

//display server running message
app.listen(PORT, () => {
    logger.info(`Server is running on PORT ${PORT}`);
    console.log(`Server is running on PORT ${PORT}`);
});
