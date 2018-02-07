const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');

// Load User Moder
const User = mongoose.model('users');

module.exports = (passport) => {
    passport.use(
        new GoogleStrategy({
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback',
            proxy: true
        },
        (accessToken, refreshToken, profile, done) => {
            // Get url without get params (a.k.a everything to right of question mark);
            const image = RegExp(/(.*)(?:\?.*)/g).exec(profile.photos[0].value)[1];

            const newUser = {
                googleID: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                image: image
            }
            
            // Check for existing user
            User.findOne({
                googleID: profile.id
            }).then(user => {
                if (user) {
                    // Return user
                    done(null, user);
                } else {
                    // Create user
                    new User(newUser)
                        .save()
                        .then(user => done(null, user));
                }
            });
        }
    ));
    
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
};