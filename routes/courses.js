const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Course = require('../models/Course');
const User = require('../models/User');

//Create a new course
router.post('/', auth, async (req, res) => {
    try {
        //Check if user is admin
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ msg: 'You are not authorized to create a course' });
        }

        const { name, code, description, credits, faculty } = req.body;

        //check if provided faultyID exists in User Collection
        const facultyExists = await User.findById(faculty);
        if (!facultyExists) {
            return res.status(400).json({ msg: 'Faculty does not exist' });
        }

        //If admin, create a course
        const course = new Course({
            name,
            code,
            description,
            credits,
            faculty //this should be an ID of existing faculty in DB
        });

        await course.save();

        res.status(201).json(course);
    } catch (err) {
        //if we cannot create course returns server error msg
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

//Get all courses
router.get('/', auth, async (req, res) => {
    try {
        let courses;
        //If user is admin, get all courses and populate faculty field with all fields except password
        if (req.user.role === 'Admin') {
            courses = await Course.find().populate('faculty', '-password');
        } else {
            //If user is not admin, get all courses and populate faculty field with only name
            courses = await Course.find().populate('faculty', 'username');
        }

        //return all courses
        res.json(courses);
    } catch (err) {
        //if we cannot get courses returns server error msg
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

//Update a course
router.put('/:id', auth, async (req, res) => {
    try {
        //Check if user is admin
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ msg: 'You are not authorized to update a course' });
        }

        const { name, code, description, credits, faculty } = req.body;

        const courseFields = {};
        if (name) courseFields.name = name;
        if (code) courseFields.code = code;
        if (description) courseFields.description = description;
        if (credits) courseFields.credits = credits;
        if (faculty) courseFields.faculty = faculty;

        //Find the course by id
        let course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        course = await Course.findByIdAndUpdate(req.params.id, { $set: courseFields }, { new: true });

        //return the Updated the course
        res.json(course);
    } catch (err) {
        //if we cannot update course returns server error msg
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

//Delete a course
router.delete('/:id', auth, async (req, res) => {
    try {
        //Check if user is admin
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ msg: 'You are not authorized to delete a course' });
        }

        //Find the course by id
        let course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        //Delete the course
        await Course.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Course deleted' });
    } catch (err) {
        //if we cannot delete course returns server error msg
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

//export the routes
module.exports = router;
