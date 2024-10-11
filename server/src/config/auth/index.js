if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    module.exports = require('./google');
    console.log('src/auth/index.js: using Google auth');
}
// .htpasswd to be used only in testing
else if (process.env.HTPASSWD_FILE && process.NODE_ENV !== 'production') {
    module.exports = require('./basic-auth');
    console.log('src/auth/index.js: using BASIC-AUTH');
} else {
    const message = 'missing env vars: no authorization configuration found';
    throw new Error(message);
}
