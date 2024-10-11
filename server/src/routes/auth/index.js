const express = require('express');
const passport = require('passport');
const hash = require('../../helpers/hash');
const { createErrorResponse } = require('../../response');

const router = express.Router();

/**
 * @route GET /auth/google
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @route GET /auth/google/callback
 * @returns {object} 302 - Success, assigns session cookie to response, and redirects to client
 */
router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect:
            process.env.NODE_ENV === 'production'
                ? `${process.env.CLIENT_URL}`
                : 'http://localhost:3000',
        session: true,
    }),
    (req, res) => {
        res.redirect(
            process.env.NODE_ENV === 'production'
                ? `${process.env.CLIENT_URL}`
                : 'http://localhost:3000'
        );
    }
);

/**
 * @route GET /auth/logout
 * @returns {object} 200 - Success, removes session cookie client
 */
router.post('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.status(200).send({ message: 'Logout successful' }); // Respond without redirecting
    });
});

/**
 * @route GET /auth/profile
 * @param {boolean} req.authenticated - If user is authenticated
 * @param {string} req.user.profile._json.email - User's email
 * @returns {object} 200 - Success, returns user's profile
 * @returns {Error}  401 - Unauthrorized, user is not authenticated/does not have correct credentials
 * @returns {Error}  500 - Internal server error
 */
router.get('/profile', async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            const userProfile = req.user.profile;
            const hashedEmail = hash(req.user.profile._json.email);
            const data = { name: userProfile.name.givenName, id: hashedEmail }; // id: hashed email

            res.status(200).json(data);
        } else {
            res.status(401).json(createErrorResponse('Unauthorized'));
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
});

module.exports = router;
