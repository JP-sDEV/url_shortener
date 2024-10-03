const sinon = require('sinon');
const passport = require('passport');

module.exports.mockOAuth = function mockOAuth() {
    // Stub passport.authenticate
    return (req, res, next) => {
        sinon.stub(passport, 'authenticate').callsFake((strategy, options, callback) => {
            return (req, res, next) => {
                if (strategy === 'google') {
                    // Simulate a successful Google OAuth2 login with a fake user
                    const user = { id: '1234' }; // Simulated user
                    req.user = user; // Set the user on the request
                    callback(null, user); // Call the callback to mimic Passport behavior
                    return next(); // Continue to the next middleware
                } else {
                    callback(null, false); // No user found for other strategies
                }
            };
        });

        return next(); // Continue to the next middleware
    };
};

module.exports.restoreOAuth = function restoreOAuth() {
    passport.authenticate();
    // passport.serializeUser();
    // passport.deserializeUser();
};
