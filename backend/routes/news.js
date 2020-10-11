const express = require('express');
const db = require("../db/db");
const router = express.Router();

router.get('/', (req, res) => {
    const offset = req.query.offset;
    const limit = req.query.limit;
    if(req.isAuthenticated()){
        db.findNewsOffsetLimit([req.body.news_blacklist, limit, offset], (err, result) => {
            if(err) console.log(err)
            else res.json(result.rows)
        })
    } else {
        db.findAllNews((err, result) => {
            if(err) console.log(err)
            else res.json(result.rows)
        })
    }
});

module.exports = router;
