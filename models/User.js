const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})