const express = require('express');

const { getAllUrls, getShortUrlById, getUserUrls, protectedRoute } = require('./get');
const { postUrl } = require('./post');
const { deleteUrl } = require('./delete');
const { authenticate } = require('../../config/auth');

const router = express.Router();

// GET
router.get('/urls', getAllUrls);
router.get('/urls/:id', getShortUrlById);

router.get('/userUrls', authenticate(true), getUserUrls);
router.get('/protectedRoute', authenticate(true), protectedRoute);

// POST
router.post('/urls', authenticate(), postUrl);

// DELETE
router.delete('/urls/:id', authenticate(), deleteUrl);

module.exports = router;
