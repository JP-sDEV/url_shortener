// May need to delete

module.exports =
    process.env.SERVER_URL === 'http://localhost:5000' ? require('./memory') : require('./mongo');
