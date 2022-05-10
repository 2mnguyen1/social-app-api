const router = require('express').Router()
const Post = require('../models/Post')
const User = require('../models/User')
// create a post

router.post('/posting', async (req, res, next) => {
    try {
        const newPost = await new Post(req.body)
        const saved = await newPost.save()
        res.status(200).json(saved)
    } catch (e) {
        res.status(500).json(e)
    }
})
// update a post
router.put('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (post.userID === req.body.userID) {
            await post.updateOne({
                $set: req.body
            })
            res.status(200).json('Your post has been updated')
        } else {
            res.status(403).json('You are not the owner of this post')
        }
    } catch (e) {
        console.log(e)
        res.status(500).json(e)
    }
})

// delete a post
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (post.userID === req.body.userID) {
            await Post.findByIdAndDelete(req.params.id)
            res.status(200).json('Your post has been deleted')
        } else {
            res.status(403).json('You are not the owner of this post')
        }
    } catch (e) {
        console.log(e)
        res.status(500).json(e)
    }
})


// like and unlike a post
router.put('/:id/like', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post.likes.includes(req.body.userID)) {
            await post.updateOne({
                $push: {
                    likes :req.body.userID
                }
            })
            res.status(200).json('Liked a post!')
        } else {
            await post.updateOne({
                $pull: {
                    likes :req.body.userID
                }
            })
            res.status(200).json('Unliked a post!')
        }
    } catch (e){
        res.status(500).json(e)
    }
})
// get a post
router.get('/:id', async(req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    } catch (e) {
        res.status(500).json(e)
    }
})

// get timeline posts

router.get('/timeline/all', async (req, res) => {
    try {
        const currentUser = await User.findById(req.body.userID)
        const userPosts = await Post.find({userID: currentUser._id})
        const friendsPosts = await Promise.all(
            currentUser.followings.map(friendID => {
                return Post.find({userID: friendID})
            })
        )
        res.json(userPosts.concat(...friendsPosts))
    } catch (e) {
        console.log(e)
        res.status(500).json(e)
    }
})


router.get('/', (req, res) => {
    res.send('This is posts')
})

module.exports = router
