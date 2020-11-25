

// const db = require('../db/db')
const express = require('express');
const passport = require("passport");
const router = express.Router();
const authGuard = require("../middleware/nav-guard")

router.post('/login', passport.authenticate('local'),
    (req, res) => {
        // db.findUserSettings([req.body.username], (err, setting) => {
        //     if(err) {console.log(err)}
        //     else res.json({status: 'success', data: setting.rows[0]})
        // })
        res.json({status: 'success', data: [1,0,1] })
    }
);

router.post('/logout', authGuard, (req, res) => {
    req.logout();
    return res.json({status: "success"})
})

module.exports = router;
