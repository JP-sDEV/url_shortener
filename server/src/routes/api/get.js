const ShortUrl = require('../../models/ShortUrl');
const User = require('../../models/User');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { validateID } = require('../../helpers/validation');

async function getAllUrls(req, res) {
    try {
        const page = (req.query.page = parseInt(req.query.page) || 1);
        const limit = 15;

        // Calculate the number of documents to skip
        const skip = (page - 1) * limit;

        const totalDocuments = await ShortUrl.countDocuments();

        // .find return nulls if no entries
        const shortUrls = await ShortUrl.find().skip(skip).limit(limit);

        const totalPages = Math.ceil(totalDocuments / limit);

        const data = {
            urls: shortUrls ? shortUrls : [],
            page,
            limit,
            totalPages,
            totalDocuments,
        };

        return res.status(200).json(createSuccessResponse(data));
    } catch (err) {
        console.log('Error: ', err.message, err.stack);
        return res.status(500).json(createErrorResponse(err.message, err.stack));
    }
}

async function getShortUrlById(req, res) {
    try {
        const id = req.params.id;
        let data = {};

        // ID has to be String type, and non-empty
        if (!validateID(id)) {
            return res.status(422).json(createErrorResponse(`Cannot process id: ${id}`));
        }

        const shortUrl = await ShortUrl.findOne({
            short: id,
        });

        // findOne returns null if not found
        if (shortUrl === null) {
            return res.status(404).json(createErrorResponse(`Cannot find url with id: ${id}`));
        }

        shortUrl.clicks++;
        await shortUrl.save();
        data.shortUrl = shortUrl;

        return res.status(200).json(createSuccessResponse(data));
    } catch (err) {
        return res.status(500).json(createErrorResponse(err.message, err.stack));
    }
}

async function getUserUrls(req, res) {
    try {
        let data = {};
        const user = User.findOne({ googleId: req.user.id });
        if (!req.user || !user) {
            const message = !req.user ? 'User not given' : 'User not found';
            return res.status(422).send(createErrorResponse(message));
        }

        const userUrls = ShortUrl.find({ user: req.user.id });
        data.urls = userUrls;

        res.status(200).json(createSuccessResponse(data));
    } catch (err) {
        return err;
    }
}

async function protectedRoute(req, res) {
    try {
        return res.status(200).json(createSuccessResponse({ message: 'protected route reached!' }));
    } catch (err) {
        return err;
    }
}

module.exports.getAllUrls = getAllUrls;
module.exports.getShortUrlById = getShortUrlById;
module.exports.getUserUrls = getUserUrls;
module.exports.protectedRoute = protectedRoute;
