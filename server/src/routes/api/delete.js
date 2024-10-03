const { validateID } = require('../../helpers/validation');
const ShortUrl = require('../../models/ShortUrl');
const { createSuccessResponse, createErrorResponse } = require('../../response');

async function deleteUrl(req, res) {
    try {
        const id = req.params.id ? String(req.params.id) : String('');
        const user = req.body.userId ? req.body.userId : null;

        // Validate ID
        if (!validateID(id)) {
            const errorMessage =
                id.length === 0 ? 'Cannot process empty id' : `Cannot process id: ${id}`;
            return res.status(422).json(createErrorResponse(errorMessage));
        }

        const url = await ShortUrl.findOne({ short: id });

        if (!url) {
            // URL does not exist
            return res.status(404).json(createErrorResponse(`Cannot find url with id: ${id}`));
        }

        // If the URL does not belong to anyone, allow deletion by anyone
        if (!url.user) {
            await url.deleteOne();
            return res.status(200).json(createSuccessResponse('delete complete'));
        }

        // If the URL belongs to the current user, allow deletion
        if (user && user == url.user) {
            await url.deleteOne();
            return res.status(200).json(createSuccessResponse('delete complete'));
        }

        // If the URL belongs to someone else, deny deletion
        return res.status(401).json(createErrorResponse('Unauthorized'));
    } catch (err) {
        return res.status(500).json(createErrorResponse(err.message, err.stack));
    }
}

module.exports = { deleteUrl };
