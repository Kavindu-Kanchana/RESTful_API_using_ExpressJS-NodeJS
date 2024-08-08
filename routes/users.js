const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

//User Registration
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        //check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        //if not, create user
        user = new User({
            username,
            email,
            password,
            role
        });

        //encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        //returns user registered msg
        res.status(201).json({ msg: 'User registered' });
    } catch (err) {
        //if we cannot create user returns server error msg
        console.error(err.message);
        res.status(500).send('Server error' );
    }
});

//User Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        //check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials !' });
        }

        //Validate the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials !' });
        }

        //Creates a token and returns it
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
    });
    }catch (err) {
        //if we cannot login user returns server error msg
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

//Get Validated User
router.get('/user', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        //if we cannot get user returns server error msg
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

//export the routes
module.exports = router;