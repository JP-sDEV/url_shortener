const express = require("express")
const mongoose = require("mongoose")
const ShortUrl = require("./models/shortUrl")

const app = express()

mongoose.connect("mongodb://localhost/urlShortener", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.set("view engine", "ejs")
app.use(express.urlencoded({
    extended: true
}))

app.get("/home" , (req,res) => {
    res.send({express: "express connected"})
})

app.get("/", async(req, res) => {

    const shortUrls = await ShortUrl.find()

    res.render("index", {
        shortUrls: shortUrls
    })

})

app.post("/shortUrls",  async(req, res) => {

    await ShortUrl.create({
        full: req.body.fullUrl
    })

    res.redirect("/")
}) 

app.delete("/delUrl", async(req,res) => {
    const delUrl = await ShortUrl.findByIdAndDelete(req.body.id, (err, docs) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log("Deleted: ", docs)
        }
    })
})

app.get("/:shortUrl", async(req, res) => {
    const shortUrl = await ShortUrl.findOne({
        short: req.params.shortUrl
    })

    if (shortUrl == null) return res.sendStatus(404)

    shortUrl.clicks++
    shortUrl.save()
    res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 5000, () => console.log("Server is up"))