const express = require('express');
const db = require("../db/db");
const router = express.Router();

router.get('/', (req, res) => {
    const limit = req.query.limit;
    const page = req.query.page;
    if(req.isAuthenticated()){
        db.findNewsOffsetLimit([[], limit, offset], (err, result) => {
            if(err) console.log(err)
            else res.json(result.rows)
        })
    } else {
        db.findNewsOffsetLimit([[], limit, (page-1)*limit], (err, result) => {
            if(err) console.log(err)
            else res.json(result.rows)
        })
    }
});

module.exports = router;
