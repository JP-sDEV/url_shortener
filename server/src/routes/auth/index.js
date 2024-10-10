const express = require('express');
const passport = require('passport');
const hash = require('../../helpers/hash');

// Create a router on which to mount our API endpoints
const router = express.Router();

// // @desc Auth with Google
// // @route /v1/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// // @desc Google auth callback
// // @route /auth/google/callback
// router.get(
//     '/google/callback',
//     passport.authenticate('google', {
//         failureRedirect:
//             process.env.NODE_ENV === 'production'
//                 ? `${process.env.CLIENT_URL}`
//                 : 'http://localhost:3000', // Redirect if authentication fails
//         session: true,
//     }),
//     (req, res) => {
//         // Redirect the user after successful authentication
//         res.redirect(
//             process.env.NODE_ENV === 'production'
//                 ? `${process.env.CLIENT_URL}`
//                 : 'http://localhost:3000'
//         );
//     }
// );

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
        console.log('Session after Google Auth:', req.session);
        console.log('Cookies after Google Auth:', req.cookies);
        
        // Check for the cookie here
        if (req.cookies && req.cookies['connect.sid']) {
            console.log('Cookie is set:', req.cookies['connect.sid']);
        } else {
            console.log('Cookie is NOT set');
        }

        res.redirect(
            process.env.NODE_ENV === 'production'
                ? `${process.env.CLIENT_URL}`
                : 'http://localhost:3000'
        );
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
    console.info('Is Authenticated:', req.isAuthenticated());
    console.info('/profile, headers:', req.headers.cookie);
    try {
        if (req.isAuthenticated()) {
            const userProfile = req.user.profile;
            const hashedEmail = hash(req.user.profile._json.email);
            const data = { name: userProfile.name.givenName, id: hashedEmail }; // id: hashed email

            res.status(200).json(data);
        } else {
            res.status(401);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
});

module.exports = router;
