// src/index.js

// Read environment variables from an .env file (if present)
// NOTE: we only need to do this once, here in our app's main entry point.
require('dotenv').config();

// If we're going to crash because of an uncaught exception, log it first.
// https://nodejs.org/api/process.html#event-uncaughtexception
process.on('uncaughtException', (err, origin) => {
    console.log({ err, origin }, 'uncaughtException');
    throw err;
});

// If we're going to crash because of an unhandled promise rejection, log it first.
// https://nodejs.org/api/process.html#event-unhandledrejection
process.on('unhandledRejection', (reason, promise) => {
    console.log({ reason, promise }, 'unhandledRejection');
    throw reason;
});

// Start our server
require('./server');
