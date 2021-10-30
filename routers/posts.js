const express = require('express');
const mongoose = require('mongoose');
const Post = mongoose.model('Post');

const router = express.Router();

// Create new post
router.post('/', (req, res) => {
    try{
        const { body } = req.body;
        const post = new Post({ body, author: req.user._id });
        
        post.save((err, post) => {
            if (err){
                const cause = err.errors.body.path;
                if(cause === 'body') return res.status(400).send('Post body is required');
                return res.status(500).send("Couln't create post");
            }
            return res.status(201).send(post);
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).send("Couln't create post");
    }
});

// Update a post
router.put('./:id', async (req, res) => {
    try{
        const id = req.params.id;
        const post = await Post.findById(id);

        if(!post) return res.status(404).send('Post not found');
        if(post.author.toString() !== req.user.id) return res.status(403).send('You cannot edit this post');
        await post.update(req.body);
        return res.status(200).send(post); 
    }
    catch(err){
        return res.status(500).send('An error occured editing your post');
    }
});

// Delete a post
router.delete('/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const post = await Post.findById(id);

        if(!post) return res.status(404).send('Post not found');
        if(post.author.toString() !== req.user.id) return res.status(403).send('You cannot delete this post');
        await Post.deleteOne({ _id: id });
        res.status(200).send('Post deleted');
    }
    catch(err){
        return res.status(500).send('An error occured deleting your post');
    }
});

// Get all of a user's posts
router.get('/', async (req, res) => {
    try{
        const id = req.user.id;
        const posts = await Post.find({ author: id });
        return res.status(200).send(posts);
    }
    catch(err){
        return res.status(400).send("Cannot get posts");
    }
});

// Get a specific post
router.get('/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const post = await Post.findById(id);

        if(!post) return res.status(404).send('Post not found');
        return res.status(200).send(post);
    }
    catch(err){
        return res.status(500).send('An error occured getting your post');
    }
});

// Like a post
router.put('/:id/like', async (req, res) => {
    try{
        const postId = req.params.id;
        const userId = req.user.id;
        const post = await Post.findById(postId);

        if(!post) return res.status(404).send('Post not found');

        // Remove dislike first (if there is one)
        if(post.dislikes.includes(userId)){
            post.dislikes.splice(post.likes.indexOf(userId), 1);
        }

        // Add or remove like
        if(!post.likes.includes(userId)){
            post.likes.push(userId);
            await post.save();
        }
        else{
            post.likes.splice(post.likes.indexOf(userId), 1);
            await post.save();
        }
        return res.status(200).send(post);
    }
    catch(err){
        res.status(500).send('Unable to like post');
    }
});

// Dislike a post
router.put('/:id/dislike', async (req, res) => {
    try{
        const postId = req.params.id;
        const userId = req.user.id;
        const post = await Post.findById(postId);

        if(!post) return res.status(404).send('Post not found');

        // Remove like first (if there is one)
        if(post.likes.includes(userId)){
            post.likes.splice(post.likes.indexOf(userId), 1);
        }

        // Add or remove dislike
        if(!post.dislikes.includes(userId)){
            post.dislikes.push(userId);
            await post.save();
        }
        else{
            post.dislikes.splice(post.dislikes.indexOf(userId), 1);
            await post.save();
        }
        return res.status(200).send(post);
    }
    catch(err){
        res.status(500).send('Unable to dislike post');
    }
});

module.exports = router;
