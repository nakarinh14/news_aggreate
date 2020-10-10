const bcrypt = require('bcrypt')
const { Strategy } = require('passport-local');
const { findUser } = require('./db/db');

module.exports = passport => {
    passport.use('local', new Strategy((username, password, done) => {
            findUser([username], (err, user) => {
                if (err) { return done(err); }
                if (!user.rows.length) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                bcrypt.compare(password, user.rows[0].password, (err, result) => {
                    if (!result) done(null, false, { message: 'Incorrect password.' })
                    else done(null, user.rows[0]);
                })
            })
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.username);
    })

    passport.deserializeUser((username, done) => {
        findUser([username], (err, user) => {
            done(err, user.rows[0])
        })
    })
}