const mongoose = require('mongoose');

let isConnected = false; // Track the connection state

const connectDB = async () => {
    if (isConnected) {
        console.log('Using existing MongoDB connection');
        return;
    }

    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI);

        isConnected = connection.connections[0].readyState;
        console.log(`MongoDB connected: ${connection.connection.host}`);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit process with failure
    }
};

module.exports = { connectDB };
