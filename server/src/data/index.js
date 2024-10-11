module.exports =
    process.env.REACT_APP_SERVER_URL === 'http://localhost:5001'
        ? require('./memory')
        : require('./mongo');
