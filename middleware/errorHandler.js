//use winston logger to log errors

const logger = require('../utils/logger');

//error handler middleware
const errorHandler = (err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({error: 'Internal Server Error'});
};

module.exports = errorHandler;