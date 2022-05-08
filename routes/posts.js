const router = require('express').Router()
const Post = require('../models/Post')
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


// like a post
// get a post
// get timeline posts




router.get('/', (req, res) => {
    res.send('This is posts')
})

module.exports = router
