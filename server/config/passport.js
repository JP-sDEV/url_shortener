const GoogleStrategy = require("passport-google-oauth20").Strategy
const mongoose = require("mongoose")
const User = require("../models/User")

module.exports = function(passport) {
    passport.use(
        new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret:  process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.SERVER_URL}/auth/google/callback`
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

    passport.deserializeUser(async (id, done) => {

        try {
            const user = await User.findById(id);
            done(null, user)
        } catch (err) {
            done(err)
        }
        console.log("deserializeUser: 'OK'")
        // await User.findById(id, (err, user) => done(err, user))
    })
}