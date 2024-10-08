// const path = require('path');
// const dotenv = require('dotenv');
const express = require('express');
// const connectDB = require("./config/db")
// const mongoose = require('mongoose');
const ShortUrl = require('./models/ShortUrl');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');

// Init App + DB Connection
const app = express();

// MongoDB Atlas (cloud)
// connectDB()

// Middleware
// Request info
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

// CORS
app.use(cors());

app.set('trust proxy', 1);

// Cookies
app.use(
    session({
        secret: 'session_secret',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI,
        }),
    })
);

// HELPER
app.get('/testConnection', async (req, res) => {
    return res.status(200).json({
        title: 'Express Testing',
        message: 'The app is working properly!',
    });
});

// @desc Gets all URLs, and checks if user is logged in
// @route GET /allUrls
app.get('/allUrls', async (req, res) => {
    const out = {
        urls: null,
    };

    const shortUrls = await ShortUrl.find();
    out.urls = shortUrls;
    res.send(out);
});

// @desc Process user submitted link
// @route POST /shortUrls
app.post('/shortUrls', async (req, res) => {
    try {
        const shortUrl = {
            full: String(req.body.full),
        };

        await ShortUrl.create(shortUrl);

        const shortUrls = await ShortUrl.find();

        res.send({ urls: shortUrls });
    } catch (err) {
        console.error(err);
        res.send({ msg: 'error/500' });
    }
});

// @desc Delete user post
// @route DELETE /delUrl
app.delete('/delUrl', async (req, res) => {
    try {
        const deleteId = {
            _id: req.body.id,
        };

        await ShortUrl.findOneAndRemove(deleteId);

        const shortUrls = await ShortUrl.find();

        res.send({ urls: shortUrls });
    } catch (err) {
        console.error(err);
        res.send({ msg: 'error/500' });
    }
});

// @desc Open the shortened link (from client), counting the number of clicks
// @route GET /:shortUrl
app.get('/:shortUrl', async (req, res) => {
    try {
        const shortUrl = await ShortUrl.findOne({
            short: req.params.shortUrl,
        });

        if (shortUrl === null) return res.sendStatus(404);

        shortUrl.clicks++;
        shortUrl.save();
        res.send({ url: shortUrl.full });
    } catch (err) {
        console.error(err);
        res.send({ msg: 'error/500' });
    }
});

// @desc Open the shortened link (not from client), counting the number of clicks
// @route GET /:shortUrl
app.get('/get/:shortUrl', async (req, res) => {
    try {
        const shortUrl = await ShortUrl.findOne({
            short: req.params.shortUrl,
        });

        if (shortUrl === null) return res.sendStatus(404);

        shortUrl.clicks++;
        shortUrl.save();
        res.redirect(shortUrl.full);
    } catch (err) {
        console.error(err);
        res.send({ msg: 'error/500' });
    }
});

app.listen(process.env.PORT || 5000, () => console.log('Server is up'));
