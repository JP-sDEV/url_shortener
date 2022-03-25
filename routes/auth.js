const express = require("express")
const passport = require("passport")
const router = express.Router()

// Google auth
router.get("/google", passport.authenticate("google", {scope: ["profile"]}))

// Google auth callback
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/"}), (req, res) =>{
    console.log("reached google/callback")
    res.redirect('/')
})

router.get("/test", (req, res) => {
    console.log("reached test")
    res.send({hello: "world"})
})

module.exports = router