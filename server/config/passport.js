const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../src/models/User');

module.exports = function (passport) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
                proxy: true,
            },

            async (accessToken, refreshToken, profile, done) => {
                const newUser = {
                    googleId: profile.id,
                    firstName: profile.name.givenName,
                };

                try {
                    let user = await User.findOne({
                        googleId: profile.id,
                    });

                    if (user) {
                        done(null, user);
                    } else {
                        user = await User.create(newUser);
                        done(null, user);
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
};
