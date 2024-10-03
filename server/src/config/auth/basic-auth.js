// Configure HTTP Basic Auth strategy for Passport, see:
// https://github.com/http-auth/http-auth-passport

const auth = require('http-auth');
const authPassport = require('http-auth-passport');
const authorize = require('./auth-middleware');

// We expect HTPASSWD_FILE to be defined.
if (!process.env.HTPASSWD_FILE) {
    const message = 'missing expected env var: HTPASSWD_FILE';
    throw new Error(message);
}

module.exports.strategy = () =>
    // For our Passport authentication strategy, we'll look for a
    // username/password pair in the Authorization header.
    authPassport(
        auth.basic({
            file: process.env.HTPASSWD_FILE,
        })
    );

module.exports.authenticate = () => authorize('http');
