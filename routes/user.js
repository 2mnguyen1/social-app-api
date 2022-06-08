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
router.delete('/:id', async (req, res) => {
    if (req.body.userID === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id)
            res.status(200).json("Succesfully deleted")
        } catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    } else {
        return res.status(403).json("You can delete only your account")
    }
})
// get a user
router.get('/', async (req, res) => {
    const userID = req.query.userID;
    const username = req.query.username;
    try {
        const user = userID
            ? await User.findById(userID)
            : await User.findOne({username: username})
        const {password, isAdmin, ...others} = user._doc;
        res.status(200).json(others)
    } catch (e) {
        res.status(500).json(e)
    }
})

// follow a user

router.put('/:id/follow', async (req, res) => {
    if (req.body.userID !== req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userID)
            if (!user.followers.includes(currentUser._id)) {
                await user.updateOne({
                    $push: {
                        followers: currentUser._id
                    }
                })
                await currentUser.updateOne({
                    $push: {
                        followings: user._id
                    }
                })
                res.status(200).json('User has been followed successfully')
            } else {
                res.status(403).json('You already follow this user')
            }
        } catch (e) {

        }
    } else {
        res.status(403).json('You can\'t follow yourself')
    }
})

// unfollow a user

router.put('/:id/unfollow', async (req, res) => {
    if (req.body.userID !== req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userID)
            if (user.followers.includes(currentUser._id)) {
                await user.updateOne({
                    $pull: {
                        followers: currentUser._id
                    }
                })
                await currentUser.updateOne({
                    $pull: {
                        followings: user._id
                    }
                })
                res.status(200).json('User has been unfollowed successfully')
            } else {
                res.status(403).json('You not follow this user')
            }
        } catch (e) {

        }
    } else {
        res.status(403).json('You can\'t unfollow yourself')
    }
})


router.get('/', (req, res) => {
    res.send("Hey its user route")
})

module.exports = router
