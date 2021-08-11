const express = require('express');
const mongoose = require('mongoose');
const Post = mongoose.model('Post');

const router = express.Router();

// Create new post
router.post('/', (req, res) => {
    const post = new Post(req.body);
    post.save((err, post) => {
        if (err) {
            return res.status(500).send(err);
        }
        return res.status(201).send(post);
    });
});

// Update a post
router.put('./:id', async (req, res) => {
    try{
        const id = req.params.id;
        const post = await Post.findById(id);
        if(post.author === req.body.userId){
            await post.update(req.body);
            return res.status(200).send(newPost);
        }
        else{
            return res.status(403).send('You cannot edit this post');
        }
    }
    catch(err){
        return res.status(500).send('An error occured editing your post');
    }
});

// Delete a post
router.delete('./:id', async (req, res) => {
    try{
        const id = req.params.id;
        const post = await Post.findById(id);
        if(post.author === req.body.userId){
            await Post.deleteOne({ _id: id });
            res.status(200).send('Post deleted');
        }
        else{
            return res.status(403).send('You cannot delete this post');
        }
    }
    catch(err){
        return res.status(500).send('An error occured deleting your post');
    }
});

// Get a post
router.get('/', async (req, res) => {
    try{
        const id = req.params.id;
        const post = await Post.findById(id);
        if(post){
            return res.status(200).send(post);
        }
        else{
            return res.status(404).send('Post not found');
        }
    }
    catch(err){
        return res.status(500).send('An error occured getting your post');
    }
});

// Like a post
router.put('/:id/like', async (req, res) => {
    try{
        const id = req.params.id;
        const post = await Post.findById(id);
        if(post){
            if(!post.likes.includes(req.body.userId)){
                post.likes.push(req.body.userId);
                await post.save();
                return res.status(200).send('Liked post');
            }
            else{
                post.likes.splice(post.likes.indexOf(req.body.userId), 1);
                await post.save();
                return res.status(200).send('Unliked post');
            }
        }
        else{
            res.status(404).send('Invalid post');
        }

    }
    catch(err){
        res.status(500).send('Unable to like post');
    }
});

// Dislike a post
router.put('/:id/dislike', async (req, res) => {
    try{
        const id = req.params.id;
        const post = await Post.findById(id);
        if(post){
            if(!post.dislikes.includes(req.body.userId)){
                post.dislikes.push(req.body.userId);
                await post.save();
                return res.status(200).send('Disliked post');
            }
            else{
                post.dislikes.splice(post.dislikes.indexOf(req.body.userId), 1);
                await post.save();
                return res.status(200).send('Undisliked post');
            }
        }
        else{
            res.status(404).send('Invalid post');
        }

    }
    catch(err){
        res.status(500).send('Unable to dislike post');
    }
});

module.exports = router;
