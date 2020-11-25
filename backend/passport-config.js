const bcrypt = require('bcrypt')
const { Strategy } = require('passport-local');
const db = require('./db/db');

module.exports = passport => {
    passport.use('local', new Strategy((username, password, done) => {
            db.findUser([username], (err, user) => {
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
        done(null, user.id);
    })

    passport.deserializeUser((user_id, done) => {
        db.findUserById([user_id], (err, user) => {
            done(err, user.rows[0])
        })
    })
}
