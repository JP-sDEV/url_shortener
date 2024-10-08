const https = require('https');
const { createErrorResponse } = require('../response');

module.exports.validateID = function (id) {
    // must be of type string and non-empty
    return typeof id == 'string' && id.trim().length > 0;
};

module.exports.validateURL = async function validateURL(url) {
    return new Promise((resolve) => {
        const req = https.get(url, (res) => {
            resolve(res.statusCode === 200);
        });

        req.on('error', (e) => {
            console.log(createErrorResponse(e.message));
            return resolve(false);
        });

        req.setTimeout(5000, () => {
            // Set timeout to 5 seconds
            return resolve(false); // Resolve as false if timeout occurs
        });
    });
};
