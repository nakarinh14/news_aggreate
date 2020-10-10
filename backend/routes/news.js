const express = require('express');
const db = require("../db/db");
const router = express.Router();

router.get('/', (req, res) => {
    if(req.isAuthenticated()){
        db.findNews(req.username, (result, err) => {
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
