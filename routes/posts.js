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
// delete a post
// like a post
// get a post
// get timeline posts




router.get('/', (req, res) => {
    res.send('This is posts')
})

module.exports = router
