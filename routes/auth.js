const express = require("express")
const passport = require("passport")
const router = express.Router()

// Google auth
router.get("/google", passport.authenticate("google", { scope: ["profile"] }))

// Google auth callback
router.get("/google/callback", passport.authenticate("google",
    {
        failureRedirect: "/login/fail",
        successRedirect: "http://localhost:3000/"
    }), (req, res) => {
        // console.log(req.user)
        // res.redirect('http://localhost:3000/')
    })

// Logout Google user
router.get("/logout", (req, res) => {
    req.logout()
    res.redirect("/")
})

// Sucessfull Google login
router.get("/login/success", (req, res) => {
    console.log("reaach login success")

    // try {
    //     if (req.user) {
    //         res.status(200).json({
    //             success: true,
    //             user: req.user
    //         })
    //     }
    // } catch (error) {
    //     cnosole.log("reached auth.js error")
    //     console.err(error)
    // }


})

// Failed Google login
router.get("/login/fail", (req, res) => {
    if (req.user) {
        res.status(401).json({
            success: true,
            message: "login failed"
        })
    }
})


// test route, to connect to client
router.get("/test", (req, res) => {
    console.log("reached test")
    res.send({ hello: "world" })
})

module.exports = router