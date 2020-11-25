const express = require('express');
const db = require("../db/db");
const authGuard = require("../middleware/nav-guard")
const router = express.Router();

router.get('/', (req, res) => {
    const limit = req.query.limit;
    const page = req.query.page;

    if (req.isAuthenticated()) {
        const publisher = req.query.publishers;
        db.findNewsOffsetLimitAuth([publisher, limit, (page - 1) * limit, req.user.id], (err, result) => {
            if (err) console.log(err)
            else res.json(result.rows)
        })
    } else {
        db.findNewsOffsetLimit([[], limit, (page - 1) * limit], (err, result) => {
            if (err) console.log(err)
            else res.json(result.rows)
        })
    }
});

router.get('/bookmark', authGuard, (req, res) => {
    db.findBookedNews([req.user.id], (err, result) => {
        if (err) console.log(err)
        else res.json(result.rows);
    })
})

router.post('/bookmark/add', authGuard, (req, res) => {
    db.addBookedNews([req.user.id, req.body.news_id], (err) => {
        if (err) console.log(err);
        else res.json({"status": "success"});
    })
})

router.post('/bookmark/remove', authGuard, (req, res) => {
    db.removeBookedNews([req.user.id, req.body.news_id], (err, result) => {
        if (err) console.log(err);
        else res.json(result.rows)
    })
})

router.get('/history', authGuard, (req, res) => {
    db.findHistory([req.user.id], (err, result) => {
        if (err) console.log(err);
        else res.json(result.rows)
    })
})

router.post('/history', authGuard, (req, res) => {
        db.findUrlById([req.body.news_id], (err, result) => {
            if (err) console.log(err);
            else if (req.isAuthenticated()) {
                console.log(req.user.id)
                db.addHistory([req.user.id, req.body.news_id, req.body.timestamp], (err) => {
                    if (err) console.log(err);
                    else res.json(result.rows[0])
                })
            } else {
                res.json(result.rows[0]);
            }
        })
    }
)
module.exports = router;
