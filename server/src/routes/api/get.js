const ShortUrl = require('../../models/ShortUrl');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { validateID } = require('../../helpers/validation');
const { getLocation } = require('../../helpers/location');
const { connectDB } = require('../../config/db');

async function getAllUrls(req, res) {
    try {
        await connectDB();

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
        await connectDB();

        const id = req.params.id;
        let data = {};
        const ip = req.clientIp;
        let location;

        if (ip) {
            location = await getLocation(ip);
        }

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

        // Accessing and updating the map using Mongoose Map methods
        if (shortUrl.accessed.get(location)) {
            shortUrl.accessed.set(location, shortUrl.accessed.get(location) + 1);
        } else {
            shortUrl.accessed.set(location, 1);
        }
        await shortUrl.save();
        data.shortUrl = shortUrl;

        await ShortUrl.findOne({
            short: id,
        });

        return res.status(200).json(createSuccessResponse(data));
    } catch (err) {
        return res.status(500).json(createErrorResponse(err.message, err.stack));
    }
}

async function getUserUrls(req, res) {
    try {
        await connectDB();

        const userId = req.headers['user-id'];
        let data = {};
        if (!userId) {
            const message = 'User not given';
            return res.status(422).send(createErrorResponse(message));
        }

        const userUrls = await ShortUrl.find({ user: userId });
        data.userUrls = userUrls;

        res.status(200).json(createSuccessResponse(data));
    } catch (err) {
        res.status(500).json(createErrorResponse(err.message, err.stack));
        return err;
    }
}

module.exports.getAllUrls = getAllUrls;
module.exports.getShortUrlById = getShortUrlById;
module.exports.getUserUrls = getUserUrls;
