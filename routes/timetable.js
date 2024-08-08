const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Timetable = require('../models/Timetable');

//Import the Course and User models
const Course = require('../models/Course');
const User = require('../models/User');

//Create a new Timetable
router.post('/', auth, async (req, res) => {
    try {
        //get details from the request body
        const { course, date, time, location } = req.body;

        //Check if user is admin or faculty
        if (req.user.role !== 'Admin' && req.user.role !== 'Faculty') {
            return res.status(403).json({ msg: 'You are not authorized to create a Timetable' });
        }

        //check if course exists
        const courseExists = await Course.findById(course);
        if (!courseExists) {
            return res.status(400).json({ msg: 'Course not found' });
        }

        //check if faculty exists
        const facultyExists = await User.findById(req.user.id);
        if (!facultyExists || (facultyExists.role !== 'Admin' && facultyExists.role !== 'Faculty')) {
            return res.status(400).json({ msg: 'Faculty not found' });
        }

        //If admin or faculty, create a Timetable
        const timetable = new Timetable({
            course,
            date,
            time,
            faculty: req.user.id, //faculty is the current logged user
            location
        });

        await timetable.save();

        res.status(201).json(timetable);
    } catch (err) {
        //if we cannot create timetable returns server error msg
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

//Update a Timetable
router.put('/:id', auth, async (req, res) => {
    try {
        //get details from the request body
        const { date, time, location } = req.body;

        //Check if user is admin or faculty
        if (req.user.role !== 'Admin' && req.user.role !== 'Faculty') {
            return res.status(403).json({ msg: 'You are not authorized to update a Timetable' });
        }

        //Find the Timetable by id
        let timetable = await Timetable.findById(req.params.id);

        //Check if timetable exists
        if (!timetable) {
            return res.status(404).json({ msg: 'Timetable not found' });
        }

        //check the user for faculty assigned to timetable entry or admin
        if (timetable.faculty.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({ msg: 'You are not authorized to update this Timetable' });
        }

        //update the Timetable
        timetable = await Timetable.findByIdAndUpdate(
            req.params.id, 
            { $set: { date, time, location } },
            { new: true }
        );
        
        //return the updated Timetable
        res.json(timetable);
    } catch (err) {
        //if we cannot update timetable returns server error msg
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

//Delete a Timetable
router.delete('/:id', auth, async (req, res) => {
    try {
        //Check if user is admin or faculty
        if (req.user.role !== 'Admin' && req.user.role !== 'Faculty') {
            return res.status(403).json({ msg: 'You are not authorized to delete a Timetable' });
        }

        //Find the Timetable by id
        let timetable = await Timetable.findById(req.params.id);

        //Check if timetable exists
        if (!timetable) {
            return res.status(404).json({ msg: 'Timetable not found' });
        }

        //check the user for faculty assigned to timetable entry or admin
        if (timetable.faculty.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({ msg: 'You are not authorized to delete this Timetable' });
        }

        //delete the Timetable
        await Timetable.findByIdAndDelete(req.params.id);

        //return the msg
        res.json({ msg: 'Timetable removed' });
    } catch (err) {
        //if we cannot delete timetable returns server error msg
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;