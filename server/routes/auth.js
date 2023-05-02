const express = require("express")
const passport = require("passport")
const router = express.Router()

// @desc Auth with Google
// @route /auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }))

// @desc Google auth callback
// @route /auth/google/callback
router.get("/google/callback", passport.authenticate("google",
    {
        failureRedirect: "/login/fail",
        successRedirect: process.env.CLIENT_URL
    }),
    
    )

// router.get(
//     "/google/callback",
//     passport.authenticate("google", {
//       failureRedirect: "/login/fail",
//     }),
//     function (req, res) {
//       res.redirect(process.env.CLIENT_URL);
//     }
//   );
  


// @desc Google auth logout
// @route /auth/logout
router.get("/logout", (req, res) => {
    req.logout()
    res.redirect("/")
})

// @desc Failed Google login
// @route /auth/login/fail
router.get("/login/fail", (req, res) => {
    if (req.user) {
        res.status(401).json({
            success: true,
            message: "login failed"
        })
    }
})

module.exports = router