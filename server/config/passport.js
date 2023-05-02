const GoogleStrategy = require("passport-google-oauth20").Strategy
const mongoose = require("mongoose")
const User = require("../models/User")

module.exports = function(passport) {
    passport.use(
        new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret:  process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback"
    },
    
    async (accessToken, refreshToken, profile, done) => {
        console.log("PROFILE: ", profile)
        const newUser = {
            googleId: profile.id,
            firstName: profile.name.givenName
        }

        try {
            let user = await User.findOne({
                googleId: profile.id
            })

            if (user) {
                done (null, user)
            } else {
                user = await User.create(newUser)
                done(null, user)
            }
        }
        catch(err) {
            console.error(err)
        }

    }))

    passport.serializeUser((user, done) => {
        console.log("serializeUser: 'OK'")
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        console.log("deserializeUser: 'OK'")
        User.findById(id, (err, user) => done(err, user))
    })
}