const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Enrollment = require('../models/Enrollment');

//import user model
const User = require('../models/User');

//Enroll a student in course
router.post('/', auth, async (req, res) => {
    try {
        //Check if user is Student
        if (req.user.role !== 'Student') {
            return res.status(403).json({ msg: 'Only Students can Enroll in a Course' });
        }

        //Get course from request body
        const { course } = req.body;

        //If student, enroll
        const enrollment = new Enrollment({
            student: req.user.id,
            course
        });

        //Save the enrollment
        await enrollment.save();

        //return enrollment
        res.status(201).json(enrollment);
    } catch (err) {
        //if cannot enroll in a course returns server error msg
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

//Get enrolled courses for the current student
router.get('/me', auth, async (req, res) => {
    try {
        //Check if user is Student
        if (req.user.role !== 'Student') {
            return res.status(403).json({ msg: 'You need to be a student to view enrollments' });
        }

        //Get all enrollments for the current student
        const enrollments = await Enrollment.find({ student: req.user.id }).populate('course', 'name');
        
        //return enrollments
        res.json(enrollments);
    } catch (err) {
        //if cannot view enrollments returns server error msg
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// View all student enrollments
// Only Faculty and Admin can view all student enrollments
router.get('/', auth, async (req, res) => {
    try {
        // Check if user is Faculty or Admin
        if (req.user.role !== 'Faculty' && req.user.role !== 'Admin') {
            return res.status(403).json({ msg: 'Only a Admin or Faculty can view all student enrollments' });
        }

        // Get all enrollments
        const enrollments = await Enrollment.find().populate('student', 'username').populate('course', 'name');
        
        //return enrollments
        res.json(enrollments);
    } catch (err) {
        //if cannot view enrollments returns server error msg
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Update student enrollment
// Only Faculty and Admin can update student enrollments
router.put('/:id', auth, async (req, res) => {
    try {
        // Check if user is Faculty or Admin
        if (req.user.role !== 'Faculty' && req.user.role !== 'Admin') {
            return res.status(403).json({ msg: 'Only a Admin or Faculty can update student enrollments' });
        }

        // Get student and course from request body
        const { student, course } = req.body;

        // Find enrollment by ID
        const enrollment = await Enrollment.findById(req.params.id);

        // Check for existing enrollment
        if (!enrollment) {
            return res.status(404).json({ msg: 'Enrollment not found' });
        }

        // Update enrollment if not a student
        enrollment.student = student;
        enrollment.course = course;

        // Save the updated enrollment
        await enrollment.save();

        //return enrollment
        res.json(enrollment);
    } catch (err) {
        //if cannot update enrollment returns server error msg
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Delete student enrollment
// Only Faculty and Admin can delete student enrollments
router.delete('/:id', auth, async (req, res) => {
    try {
        // Check if user is Faculty or Admin
        if (req.user.role !== 'Faculty' && req.user.role !== 'Admin') {
            return res.status(403).json({ msg: 'Only Admin and Faculty can delete student enrollments' });
        }

        // Find enrollment by ID
        const enrollment = await Enrollment.findById(req.params.id);

        // Check for existing enrollment
        if (!enrollment) {
            return res.status(404).json({ msg: 'Enrollment not found' });
        }

        // Delete enrollment
        await Enrollment.deleteOne({ _id: req.params.id });

        //return success message
        res.json({ msg: 'Enrollment deleted' });
    } catch (err) {
        //if cannot delete enrollment returns server error msg
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;