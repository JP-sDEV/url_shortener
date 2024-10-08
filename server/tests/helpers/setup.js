const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongodb;

const connect = async () => {
    mongodb = await MongoMemoryServer.create({
        instance: { dbName: 'url_shortner' },
    });

    const uri = mongodb.getUri();
    await mongoose.connect(uri);
};

const disconnect = async () => {
    await mongoose.disconnect();
    if (mongodb) {
        await mongodb.stop();
    }
};

module.exports = {
    connect,
    disconnect,
};
