if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    module.exports = require('./google');
    console.log('src/auth/index.js: using Google auth');
}
// Also allow for an .htpasswd file to be used, but not in production
else if (process.env.HTPASSWD_FILE && process.NODE_ENV !== 'production') {
    module.exports = require('./basic-auth');
    console.log('src/auth/index.js: using BASIC-AUTH');
}
// In all other cases, we need to stop now and fix our config
else {
    const message = 'missing env vars: no authorization configuration found';
    throw new Error(message);
}
