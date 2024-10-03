module.exports.createSuccessResponse = function (data) {
    return {
        ...data,
    };
};

module.exports.createErrorResponse = function (message, stackTrace) {
    return {
        error: {
            message: message,
            stackTrace: stackTrace,
        },
    };
};
