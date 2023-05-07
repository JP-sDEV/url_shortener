const path = require('path') 
const dotenv = require('dotenv')
const express = require("express")
const connectDB = require("./config/db")
const mongoose = require("mongoose")
const ShortUrl = require("./models/ShortUrl")
const passport = require("passport")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const cors = require("cors")
// dotenv.config({ path: '.env' }) 

// Init App + DB Connection
const app = express()
require("./config/passport")(passport) 


// MongoDB Atlas (cloud)
connectDB() 

// MongoDB Local
// mongoose.connect(process.env.LOCALHOST, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })

// Middleware
// Request info
app.use(express.urlencoded({
    extended: true
}))

// Cookies
app.use(session({
    secret: "session_sec",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI 
    })
}))

// CORS
app.use(cors())

// Passport
app.use(passport.initialize())
app.use(passport.session())

// HELPER

app.get("/testConnection", async (req, res) => {
    return res.status(200).json({
      title: "Express Testing",
      message: "The app is working properly!",
    });
  });

// Auth routes
app.use('/auth', require("./routes/auth"))

// @desc Gets all URLs, and checks if user is logged in
// @route GET /allUrls
app.get("/allUrls", async(req, res) => {

    const out = {
        urls: null,
        userId: null,
        name: null
    }

    if (req.user) { 
        out.userId = req.user._id,
        out.name = req.user.firstName 
    }

    const shortUrls = await ShortUrl.find()
    out.urls = shortUrls
    console.log(out)
    res.send(out)
})

// @desc Process user submitted link
// @route POST /shortUrls 
app.post("/shortUrls",  async(req, res) => { 

    try {
        const shortUrl = {
            full: String(req.body.full)
        }
        
        if (req.user) {
            shortUrl.user = req.user
        }
    
        await ShortUrl.create(shortUrl)
    
    } catch(err) {
        console.error(err)
        res.send({"msg":'error/500'})
    }
    
}) 

// @desc Delete user post
// @route DELETE /delUrl
app.delete("/delUrl", async(req,res) => {

    try {
        const deleteId = {
            _id: req.body.id
        }
    
        await ShortUrl.findOneAndRemove(deleteId)
    
        const shortUrls = await ShortUrl.find()
    
        res.send({urls: shortUrls})
    
    } catch(err) {
        console.error(err)
        res.send({"msg":'error/500'})
    }

}) 

// @desc Open the shortened link (from client), counting the number of clicks
// @route GET /:shortUrl
app.get("/:shortUrl", async(req, res) => { 
    try {
        const shortUrl = await ShortUrl.findOne({ 
            short: req.params.shortUrl
        })
    
        if (shortUrl === null) return res.sendStatus(404)

        shortUrl.clicks++
        shortUrl.save()
        res.send({url: shortUrl.full})
    
    } catch(err) {
        console.error(err)
        res.send({"msg":'error/500'})
    } 

})

// @desc Open the shortened link (not from client), counting the number of clicks
// @route GET /:shortUrl
app.get("/get/:shortUrl", async(req, res) => { 
    try {
        const shortUrl = await ShortUrl.findOne({ 
            short: req.params.shortUrl
        })
    
        if (shortUrl === null) return res.sendStatus(404)
        
        shortUrl.clicks++
        shortUrl.save()
        res.redirect(shortUrl.full)
    
    } catch(err) {
        console.error(err)
        res.send({"msg":'error/500'})
    } 

})

// Serve static assets if in production
// if (process.env.NODE_ENV === "production") {
    
//     // Use static folder
//     app.use(express.static('client/build'))

//     app.get("*", (req, res) => {
//         res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
//     })
// }

app.listen(process.env.PORT || 5000, () => console.log("Server is up")) 
