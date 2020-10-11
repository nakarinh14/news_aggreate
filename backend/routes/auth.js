const db = require('../db/db')
const express = require('express');
const passport = require("passport");
const router = express.Router();

router.post('/login', passport.authenticate('local'),
    (req, res) => {
        db.findUserSettings([req.body.username], (err, setting) => {
            if(err) {console.log(err)}
            else res.json({status: 'success', data: setting.rows[0]})
        })
    }
);

router.post('/logout', (req, res) => {
    if(req.isAuthenticated()){
        req.logout();
        return res.json({status: "success"})
    }
    return res.json({status: "failed"})
})

module.exports = router;
