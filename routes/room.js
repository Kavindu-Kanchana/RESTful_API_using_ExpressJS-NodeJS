const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Room = require('../models/Room');

//Create a new room
router.post('/', auth, async (req, res) => {
    try {
        //Check if user is admin
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ msg: 'You are not authorized to create a room' });
        }

        const { name, capacity, type } = req.body;

        //If admin, create a room
        const room = new Room({
            name,
            capacity,
            type
        });

        //Save the room
        await room.save();

        res.status(201).json(room);
    } catch (err) {
        //if we cannot create room returns server error msg
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

//Book a room
router.post('/book/:roomId', auth, async (req, res) => {
    try {
        //Check if user is admin or faculty
        if (req.user.role !== 'Admin' && req.user.role !== 'Faculty') {
            return res.status(403).json({ msg: 'You are not authorized to update a booking' });
        }

        const { startTime, endTime } = req.body;

        //Find the room by id
        const room = await Room.findById(req.params.roomId);

        if (!room) {
            return res.status(404).json({ msg: 'Room not found' });
        }

        //check if room is already booked during req time
        for (const booking of room.bookings) {
            if (
                //checking conditions
                (startTime >= booking.startTime && startTime < booking.endTime) ||
                (endTime > booking.startTime && endTime <= booking.endTime) ||
                (startTime <= booking.startTime && endTime >= booking.endTime)
            ) {
                //If room is already booked, return error msg
                return res.status(400).json({ msg: 'Room is already booked during this time' });
            }
        }
        
        //If room is not booked, add booking
        room.bookings.push({
            user: req.user.id,
            startTime,
            endTime
        });        
        //Save the room
        await room.save();

        res.status(201).json(room.bookings);
    } catch (err) {
        //if we cannot book room returns server error msg
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

//Update a room booking
router.put('/bookings/:roomId/:bookingId', auth, async (req, res) => {
    try {
        //Check if user is admin or faculty
        if (req.user.role !== 'Admin' && req.user.role !== 'Faculty') {
            return res.status(403).json({ msg: 'You are not authorized to update a booking' });
        }

        //get start and end time from req body
        const { startTime, endTime } = req.body;

        //Find the room by id
        const room = await Room.findById(req.params.roomId);

        //If room does not exist, return error msg
        if (!room) {
            return res.status(404).json({ msg: 'Room not found' });
        }

        //Find the booking by id
        const booking = room.bookings.find(booking => booking.id === req.params.bookingId);

        //check updated time overlaps
        for (const bk of room.bookings) {
            //If booking is not the same as the one being updated
            if (bk.id !== req.params.bookingId && (
                (startTime >= bk.startTime && startTime < bk.endTime) ||
                (endTime > bk.startTime && endTime <= bk.endTime) ||
                (startTime <= bk.startTime && endTime >= bk.endTime)
            )) {
                //If already booked return error msg
                return res.status(400).json({ msg: 'Room is already booked during this time' });
            }
        }

        //Update the booking
        booking.startTime = startTime;
        booking.endTime = endTime;
        await room.save();

        //Return the updated booking
        res.json(booking);
    } catch (err) {
        //if we cannot update booking returns server error msg
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }

});

//Delete a booking
router.delete('/bookings/:roomId/:bookingId', auth, async (req, res) => {
    try {
        //Check if user is admin or faculty
        if (req.user.role !== 'Admin' && req.user.role !== 'Faculty') {
            return res.status(403).json({ msg: 'You are not authorized to update a booking' });
        }

        //Find the room by id
        const room = await Room.findById(req.params.roomId);

        //If room does not exist, return error msg
        if (!room) {
            return res.status(404).json({ msg: 'Room not found' });
        }

        //remove the booking
        room.bookings = room.bookings.filter(booking => booking.id !== req.params.bookingId);
        await room.save();

        //Return the updated bookings
        res.json({ msg: 'Booking deleted' });
    } catch (err) {
        //if we cannot delete booking returns server error msg
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;