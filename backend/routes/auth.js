const express = require('express');
const passport = require("passport");
const router = express.Router();

router.post('/login', passport.authenticate('local'),
    (req, res) => {
        res.json({status: 'success'})
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
