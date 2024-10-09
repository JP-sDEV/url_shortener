require('dotenv').config();
const stoppable = require('stoppable');
const { connectDB } = require('../src/config/db');

// Get express app instance
const app = require('./app');
connectDB();

// Get port from the process' environment. Default to `5001`
const port = parseInt(process.env.PORT || '5001', 10);

// Start a server listening on this port
const server = stoppable(
    app.listen(port, () => {
        // connectDB();
        // Log a message that the server has started, and which port it's using.
        console.log(`Server started on port ${port}`);
    })
);

// Export our server instance so other parts of our code can access it if necessary.
module.exports = server;
