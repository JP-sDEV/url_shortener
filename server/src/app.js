const dotenv = require('dotenv');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const requestIp = require('request-ip');
const MongoStore = require('connect-mongo');

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

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI,
            ttl: 14 * 24 * 60 * 60, // = 14 days. Default session duration
        }),
        cookie: {
            secure: process.env.NODE_ENV === 'production', // true if using HTTPS
            maxAge: 1000 * 60 * 60 * 24 * 7, // one week
            httpOnly: process.env.NODE_ENV === 'production', // true if in production
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // None for cross-origin
            domain: 'url-shortener-api-mauve.vercel.app',
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

module.exports = app;
