const express = require('express');
const db = require("../db/db");
const authGuard = require("../middleware/nav-guard")
const validateQuery = require("../middleware/validate-get-news");
const router = express.Router();

router.get('/', validateQuery, (req, res) => {
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
    res.status(200).send()
    db.addBookedNews([req.user.id, req.body.news_id], (err) => {
        if (err) console.log(err);
    })
})

router.post('/bookmark/remove', authGuard, (req, res) => {
    res.status(200).send()
    db.removeBookedNews([req.user.id, req.body.news_id], (err) => {
        if (err) console.log(err);
    })
})

router.get('/history', authGuard, (req, res) => {
    db.findHistory([req.user.id], (err, result) => {
        if (err) console.log(err);
        else res.json(result.rows)
    })
})

router.post('/history', authGuard, (req, res) => {
    res.status(200).send()
    db.findUrlById([req.body.news_id], (err) => {
        if (err) console.log(err);
        else {
            db.addHistory([req.user.id, req.body.news_id, req.body.timestamp], (err) => {
                if (err) console.log(err);
            })
        }
    })
    }
)
module.exports = router;
