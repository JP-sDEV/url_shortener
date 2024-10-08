const express = require('express');

// Create a router that we can use to mount our API
const router = express.Router();

/**
 * Expose all of our API routes on /v1/* to include an API version.
 */
router.use(`/v1`, require('./api'));
router.use('/auth', require('./auth'));

/**
 * @route GET /
 * @description Check if server is running without error(s)
 * @access Public
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
router.get('/', (req, res) => {
    // See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching#controlling_caching
    // Can store cache - has to be revalidated at each request
    const data = {
        title: 'Express Testing',
        message: 'The app is working properly!',
    };

    res.setHeader('Cache-Control', 'no-cache');
    res.status(200).json(data);
});

module.exports = router;
