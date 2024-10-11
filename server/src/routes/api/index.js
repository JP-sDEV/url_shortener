const express = require('express');

const { getAllUrls, getShortUrlById, getUserUrls } = require('./get');
const { postUrl } = require('./post');
const { deleteUrl } = require('./delete');
const { authenticate } = require('../../config/auth');

const router = express.Router();

// GET Endpoints
/**
 * @route GET /v1/urls
 * @returns {object} 200 - Success, returns first 15 short urls sorted by most recent
 * @returns {Error}  500 - Internal server error
 */
router.get('/urls', getAllUrls);

/**
 * @route GET /v1/urls/:id
 * @param {string} req.params.id - Short URL "short" an id that maps to full URL
 * @param {string} req.clientIp - IP address of request
 * @returns {object} 200 - Success, returns short URL object
 * @returns {Error}  404 - Short URL "short" id is not found
 * @returns {Error}  422 - Short URL "short" id is not valid/cannot be processed
 * @returns {Error}  500 - Internal server error
 */
router.get('/urls/:id', getShortUrlById);

/**
 * @route GET /v1/userUrls
 * @param {string} req.headers.['user-id'] - Retrieve short URLs that belong to user
 * @returns {object} 200 - Success, returns all short URLs submitted by the user
 * @returns {Error}  422 - User id was not provided
 * @returns {Error}  500 - Internal server error
 */
router.get('/userUrls', authenticate(true), getUserUrls);

// POST
/**
 * @route POST /v1/urls
 * @param {string} req.body.full - Full URL to be shortened
 * @param {string} req.headers.['user-id'] - User id to assign to the short URL
 * @returns {object} 201 - Success, returns the submitted short URL object
 * @returns {Error}  422 - The provided URL cannot be pinged, or processed (i.e. is invalid)
 * @returns {Error}  500 - Internal server error
 */
router.post('/urls', authenticate(), postUrl);

// DELETE
/**
 * @route DELETE /v1/urls
 * @param {string} req.params.id - Short URL "short" id to be deleted
 * @returns {object} 201 - Success, returns the submitted short URL object
 * @returns {Error}  401 - Unauthorized deletion, can only be deleted by user that submitted it and is not anon
 * @returns {Error}  404 - Short URL "short" id is not found
 * @returns {Error}  422 - The provided "short" id cannot be processed/empty
 * @returns {Error}  500 - Internal server error
 */
router.delete('/urls/:id', authenticate(), deleteUrl);

module.exports = router;
