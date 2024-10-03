const express = require('express');
const passport = require('passport');
const hash = require('../../helpers/hash');

// Create a router on which to mount our API endpoints
const router = express.Router();

// // @desc Auth with Google
// // @route /v1/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @desc Google auth callback
// @route /auth/google/callback
router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: 'http://localhost:3000', // Redirect if authentication fails
        session: true,
    }),
    (req, res) => {
        // Redirect the user after successful authentication
        res.redirect('http://localhost:3000');
    }
);

// @desc Google auth logout
// @route /auth/logout
router.post('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.status(200).send({ message: 'Logout successful' }); // Respond without redirecting
    });
});

router.get('/profile', async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            // You can customize the user profile response
            const userProfile = req.user.profile;
            const hashedEmail = hash(req.user.profile._json.email);
            const data = { name: userProfile.name.givenName, id: hashedEmail }; // id: hashed email

            res.status(200).json(data);
        } else {
            res.status(401).json({ msg: 'Unauthorized' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
});

module.exports = router;
