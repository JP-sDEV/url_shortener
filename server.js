const path = require('path')
const dotenv = require('dotenv')
const express = require("express")
const mongoose = require("mongoose")
const ShortUrl = require("./models/shortUrl")
const passport = require("passport")
const session = require("express-session")


dotenv.config({ path: './config/config.env' })

const app = express()

require("./config/passport")(passport)

mongoose.connect("mongodb://localhost/urlShortener", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.use(express.urlencoded({
    extended: true
}))
app.use(express.json());


// Auth routes
app.use('/auth', require("./routes/auth"))


// Sessions
app.use(session({
    secret: "session_sec",
    resave: false,
    saveUninitialized: false
}))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Url shortener endpoints
app.get("/home" , (req,res) => {
    res.send({express: "express connected"})
})

app.get("/allUrls", async(req, res) => {
    const shortUrls = await ShortUrl.find()
    res.send({
        urls: shortUrls
    })
})

app.post("/shortUrls",  async(req, res) => {
    await ShortUrl.create({
        full: String(req.body.full)
    })
}) 

app.delete("/delUrl", async(req,res) => {

    const deleteId = {
        _id: req.body.id
    }

    await ShortUrl.findOneAndRemove(deleteId)
}) 

app.get("/:shortUrl", async(req, res) => { 
    const shortUrl = await ShortUrl.findOne({ 
        short: req.params.shortUrl
    })

    if (shortUrl == null) return res.sendStatus(404)

    shortUrl.clicks++
    shortUrl.save()
    res.send({url: shortUrl.full})
})

app.listen(process.env.PORT || 5000, () => console.log("Server is up"))
