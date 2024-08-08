//use jwt as middleware to protect routes

const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    //Get token from header
    const token = req.header('x-auth-token');

    //Check if token exists
    if (!token) {
        return res.status(401).json({ msg: 'Authorization Failed, No token Found !' });
    }

    //Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded.user;
        next();
    } catch (err) {
        //if token is not valid
        res.status(401).json({ msg: 'Token is not valid' });
    }
};