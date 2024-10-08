const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');

// We expect GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to be defined.
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    const message =
        'Missing expected environment variables: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET';
    console.log(message);
    throw new Error(message);
}

module.exports.strategy = () =>
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `http://localhost:5001/auth/google/callback`,
            passReqToCallback: true,
        },
        async (req, accessToken, refreshToken, profile, done) => {
            return done(null, { profile, accessToken });
        }
    );

passport.serializeUser((profile, done) => {
    done(null, profile); // Serialize the entire user profile
});

passport.deserializeUser((profile, done) => {
    done(null, profile); // Deserialize the profile
});

module.exports.authenticate = (isAuthRequired = false) => {
    return (req, res, next) => {
        // If the user is authenticated and auth is required, attach user to the response
        if (req.isAuthenticated()) {
            if (isAuthRequired) {
                res.locals.user = req.user; // Attach the user object to response if auth is required
            }
            return next(); // Continue to the next middleware
        }

        if (isAuthRequired) {
            // Redirect to Google authentication if user is not authenticated and auth is required
            return passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
        }

        // If authentication is not required, continue without attaching user
        return next();
    };
};
