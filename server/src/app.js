// const path = require('path');
const dotenv = require('dotenv');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
// const MongoStore = require('connect-mongo');
// const mongoose = require('mongoose');
const cors = require('cors');
const requestIp = require('request-ip');

const helmet = require('helmet');

const authenticate = require('./config/auth');

dotenv.config();

const app = express();

// Middleware
// Request info
app.use(helmet());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

// Cookies
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false,
            maxAge: 1000 * 60 * 60 * 24 * 7, // one week,
            httpOnly: true,
        },
    })
);

app.use(
    cors({
        origin:
            process.env.NODE_ENV === 'production'
                ? `${process.env.CLIENT_URL}`
                : 'http://localhost:3000', // Specify the client URL
        credentials: true, // Allow credentials (cookies) to be sent with requests
    })
);

// // IP
app.use(requestIp.mw());

// Passport
passport.use(authenticate.strategy());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    const allowedOrigin =
        process.env.NODE_ENV === 'production'
            ? `${process.env.CLIENT_URL}`
            : 'http://localhost:3000'; // Specify the client URL

    res.setHeader(
        'Content-Security-Policy',
        `default-src 'self'; script-src 'self' ${allowedOrigin} https://vercel.live;`
    );
    next();
});

// Routes
app.use('/', require('./routes'));

// Auth routes
app.use('/auth', require('./routes/auth/index'));

// Serve static assets if in production
// if (process.env.NODE_ENV === "production") {

//     // Use static folder
//     app.use(express.static('client/build'))

//     app.get("*", (req, res) => {
//         res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
//     })
// }

module.exports = app;
