const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy;
const db = require('./db/db');

module.exports = passport => {
    passport.use('local', new LocalStrategy((username, password, done) => {
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
        console.log("serializing")
        console.log(user)
        done(null, user.id);
    })

    passport.deserializeUser((user_id, done) => {
        console.log("desrialize")
        console.log(user_id)
        db.findUserById([user_id], (err, user) => {
            console.log(err)
            done(err, user.rows[0])
        })
    })
}
