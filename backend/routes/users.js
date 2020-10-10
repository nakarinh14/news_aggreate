const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../db/db')

router.post('/', (req, res) => {
    console.log(req.body)
    db.findUser([req.body.username], (err, user) => {
        if(!user.rows.length){
            bcrypt.hash(req.body.password, 5, (err, hash) => {
                if(err) console.log(err)
                else{
                    db.addUser([req.body.username, hash], (err) => {
                        if(err)  res.json({status: 'failed', message: 'Add failed'})
                        else res.json({status: 'success', message: 'User added successfully'})
                    })
                }
            })
        } else {
            res.json({status: 'failed', message: 'User already exist'});
        }
    })

})

// router.put('/setting', (req, res, next) => {
//     db.updateSetting()
// })

module.exports = router;
