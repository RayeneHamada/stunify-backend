const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

var User = mongoose.model('Users');
passport.use(
    new localStrategy({ usernameField: 'email' },
    (login, password, done) => {
        User.findOne({ 'email': login },
            (err, user) => {
                if(err)
                    return done(err);
                else if(!user)
                    return done(null, false, {message: 'Email is not registred'});
                else if(!user.verifyPassword(password))
                    return done(null, false, {message: 'Wrong password.'});
                else
                    return done(null, user);
            });
    })
);