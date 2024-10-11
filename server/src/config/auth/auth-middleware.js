const passport = require('passport');

const { createErrorResponse } = require('../../response');
// const hash = require('../../helpers/hash');

/**
 * @param {'bearer' | 'http'} strategyName - the passport strategy to use
 * @returns {Function} - the middleware function to use for authentication
 */
module.exports = (strategyName) => {
    return function (req, res, next) {
        /**
         * Define a custom callback to run after the user has been authenticated
         * where we can modify the way that errors are handled, and hash emails.
         * @param {Error} err - an error object
         * @param {string} user - an authenticated user's info with email address
         */
        function callback(err, user) {
            // Something failed, let the the error handling middleware deal with it
            if (err) {
                console.log({ err }, 'error authenticating user');
                return next(createErrorResponse('Unable to authenticate user', err));
            }

            if (user) {
                req.user = user;
            }

            // Call the next function in the middleware chain (e.g. your route handler)
            next();
        }

        // Call the given passport strategy's authenticate() method, passing the
        // req, res, next objects.  Invoke our custom callback when done.
        passport.authenticate(strategyName, { session: true }, callback)(req, res, next);
    };
};
