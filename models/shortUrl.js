const mongoose = require("mongoose")
const shortId = require("shortid")

const ShortUrlSchema = new mongoose.Schema({
    full: {
        type: String,
        required: true
    },
    short: {
        type:String,
        required: true,
        default: shortId.generate
    },
    clicks: {
        type: Number,
        required: true,
        default: 0
    },
    created: {
        type: Date,
        default: Date.now,
        updatedAt: false
    }
})

module.exports = mongoose.model("ShortUrl", ShortUrlSchema)