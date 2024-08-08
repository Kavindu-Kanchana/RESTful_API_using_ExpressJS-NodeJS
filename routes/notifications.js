const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');

//import the User model to get relevant user
const User = require('../models/User');

//Send notifications based on the user's role
router.post('/', auth, async (req, res) => {
    try {
        //Check if user is admin or faculty
        if (req.user.role !== 'Admin' && req.user.role !== 'Faculty') {
            return res.status(403).json({ msg: 'You are not authorized to send notifications' });
        }

        //get receiver, message and type from the request body
        const { receiver, message, type, timestamp } = req.body;

        //create a new notification object
        const notification = new Notification({
            sender: req.user.id, //sender is the logged in user's id
            receiver,
            message,
            type,
            timestamp
        });

        //save the notification to the DB
        await notification.save();

        //return the notification
        res.status(201).json(notification);
    } catch (err) {
        //if we cannot create notification returns server error msg
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

//Get logged in user's notifications
router.get('/me', auth, async (req, res) => {
    try {
        //find/fetch all notifications from DB that have the receiver field as the logged in user
        const notifications = await Notification.find({ receiver: req.user.id });

        //if no notifications found return a message
        if (notifications.length === 0) {
            return res.status(404).json({ msg: 'You have No notifications' });
        }

        //return all notifications
        res.json(notifications);
    } catch (err) {
        //if we cannot get notifications returns server error msg
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

//Get all notifications
//Only Admin can access this route
router.get('/', auth, async (req, res) => {
    try {
        //Check if user is admin
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ msg: 'You are not authorized to access this route' });
        }

        //find/fetch all notifications from DB
        const notifications = await Notification.find();

        //return all notifications
        res.json(notifications);
    } catch (err) {
        //if we cannot get notifications returns server error msg
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});


//Update notification
//Only Admin or the sender(except student) can access this route
router.put('/:id', auth, async (req, res) => {
    try {
        //get message from the request body
        const { message } = req.body;

        //find the notification by id
        const notification = await Notification.findById(req.params.id);

        //Check if notification exists
        if (!notification) {
            return res.status(404).json({ msg: 'Notification not found' });
        }

        //Check if user is admin or Faculty who sent the notification
        if (req.user.role === 'Admin' || (req.user.role === 'Faculty' && notification.sender.toString() === req.user.id)) {
            //update the notification
            notification.message = message;
            await notification.save();

            //return the updated notification
            res.json(notification);
        } else {
            //if user is not authorized to update the notification
            return res.status(403).json({ msg: 'You are not authorized to update this notification' });
        }
    } catch (err) {
        //if we cannot update notification returns server error msg
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

//Delete notification
//Any role can delete their own notification
//Faculty can delete Student's notification
//Only Admin can delete any notification
router.delete('/:id', auth, async (req, res) => {
    try {
        //find the notification by id
        const notification = await Notification.findById(req.params.id);

        //Check if notification exists
        if (!notification) {
            return res.status(404).json({ msg: 'Notification not found' });
        }

        //Check if user is admin or Faculty who sent the notification
        if (req.user.role === 'Admin' || notification.receiver.toString() === req.user.id || (req.user.role === 'Faculty' && notification.sender.toString() === req.user.id)) {
            //delete the notification
            await notification.deleteOne();
            //return success message
            res.json({ msg: 'Notification removed' });
        } else {
            //if user is not authorized to delete the notification
            return res.status(403).json({ msg: 'You are not authorized to delete this notification' });
        }
    } catch (err) {
        //if we cannot delete notification returns server error msg
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;

