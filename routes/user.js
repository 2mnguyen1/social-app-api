const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const User = require('../models/User')
// update user
router.put('/:id', async (req, res) => {
    if (req.body.userID === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt)
            } catch (e) {
                res.status(500).json(e)
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {  // auto update user
                $set: req.body
            })
            res.status(200).json("Succesfully updated")
        } catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    } else {
        return res.status(403).json("You can update only your account")
    }
})
// delete user
// get a user
// follow a user
// unfollow a user

router.get('/', (req, res) => {
    res.send("Hey its user route")
})

module.exports = router
