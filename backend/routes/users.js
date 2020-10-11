const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../db/db')

addNewUser = async (username, password) => {
    try{
        const hash = await bcrypt.hash(password, 5)
        await db.addUser([username, hash]);
        await db.addUserSettings([username]);
    }
    catch(err){
        console.log(err)
    }
}

router.post('/register', (req, res) => {
    console.log(req.body)
    db.findUser([req.body.username], (err, user) => {
        if(!user.rows.length){
            addNewUser(req.body.username, req.body.password)
                .then(() => res.json({status: 'success', message: 'User added successfully'}))
                .catch(() => res.json({status: 'failed', message: 'Error adding user'}))
        } else {
            res.json({status: 'failed', message: 'User already exist'});
        }
    })

})

router.post('/setting', (req, res) => {
    db.updateSetting([req.body.news_setting, req.body.username], (err) => {
        if(err) console.log(err)
        else res.json(req.body.news_setting)
    })
})

module.exports = router;
