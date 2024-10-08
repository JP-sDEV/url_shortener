const ShortUrl = require('../../models/ShortUrl');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { validateURL } = require('../../helpers/validation');

async function postUrl(req, res) {
    try {
        const url = req.body.full ? String(req.body.full) : String('');
        const user = req.body.user ? String(req.body.user) : null;

        if (url.length === 0) {
            return res.status(422).json(createErrorResponse(`Cannot process url: ${url}`));
        }

        const isValidURL = await validateURL(url);

        if (!isValidURL) {
            return res
                .status(422)
                .json(createErrorResponse(`Invalid URL, cannot reach host: ${url}`));
        }

        const short = { full: url };
        if (user) {
            short.user = user;
        }

        const shorty = await ShortUrl.create(short);

        // Create a copy of the shorty._doc object
        const responseBody = { ...shorty._doc };

        // Delete the _id property
        delete responseBody._id;

        return res.status(201).json(createSuccessResponse(responseBody));
    } catch (err) {
        console.error('ApplicationError: ', err);
        return res.status(500).json(createErrorResponse(err.message || 'Internal Server Error'));
    }
}

module.exports.postUrl = postUrl;
