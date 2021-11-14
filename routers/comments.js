const express = require('express');
const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');

const router = express.Router();

// Create new comment
router.post('/', async (req, res) => {
    try{
        const { body, parent } = req.body;

        // Create comment and add to database
        const comment = new Comment({ body, parent, author: req.user._id });
        comment.save((err, post) => {
            if (err){
                const cause = err.errors.body.path;
                if(cause === 'body') return res.status(400).send('Comment body is required');
                return res.status(500).send("Couln't create comment");
            }
            return res.status(201).send(comment);
        });

        // Add pointer to comments array in parent content
        const parentContent = await Post.findById(parent) || (await Comment.findById(parent) || null);
        if(!parentContent) res.status(500).send('Parent required');
        parentContent.comments.push(comment._id);
        parentContent.save();
    }
    catch(err){
        console.log(err);
        return res.status(500).send("Couln't create comment");
    }
});

// Update a comment
router.put('./:id', async (req, res) => {
    try{
        const id = req.params.id;
        const comment = await Comment.findById(id);

        if(!comment) return res.status(404).send('Comment not found');
        if(comment.author.toString() !== req.user.id) return res.status(403).send('You cannot edit this post');
        await comment.update(req.body);
        return res.status(200).send(comment); 
    }
    catch(err){
        return res.status(500).send('An error occured editing your comment');
    }
});

// Delete a comment
router.delete('/:id', async (req, res) => {
    try{
        // Check to see if comment exists and if user is authorized to delete
        const id = req.params.id;
        const comment = await Comment.findById(id);
        if(!comment) return res.status(404).send('Comment not found');
        if(comment.author.toString() !== req.user.id) return res.status(403).send('You cannot delete this post');

        // Remove pointer from comments array in parent content
        const parentId = comment.parent;
        const parentContent = await Post.findById(parentId) || (await Comment.findById(parentId) || null);
        if(!parentContent) res.status(500).send('Parent required');
        parentContent.comments.pull(comment._id);
        parentContent.save();

        // Remove comment from database
        await Comment.deleteOne({ _id: id });
        res.status(200).send('Comment deleted');
    }
    catch(err){
        console.log(err);
        return res.status(500).send('An error occured deleting your comment');
    }
});

// Get all of a user's comments
router.get('/', async (req, res) => {
    try{
        const id = req.user.id;
        const comments = await Comment.find({ author: id });
        return res.status(200).send(comments);
    }
    catch(err){
        return res.status(400).send("Cannot get comments");
    }
});

// Get a specific comment
router.get('/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const comment = await Comment.findById(id);

        if(!comment) return res.status(404).send('Comment not found');
        return res.status(200).send(comment);
    }
    catch(err){
        return res.status(500).send('An error occured getting your comment');
    }
});

// Like a comment
router.put('/:id/like', async (req, res) => {
    try{
        const commentId = req.params.id;
        const userId = req.user.id;
        const comment = await Comment.findById(commentId);

        if(!comment) return res.status(404).send('Comment not found');

        // Remove dislike first (if there is one)
        if(comment.dislikes.includes(userId)){
            comment.dislikes.splice(comment.likes.indexOf(userId), 1);
        }

        // Add or remove like
        if(!comment.likes.includes(userId)){
            comment.likes.push(userId);
            await comment.save();
        }
        else{
            comment.likes.splice(comment.likes.indexOf(userId), 1);
            await comment.save();
        }
        return res.status(200).send(comment);
    }
    catch(err){
        res.status(500).send('Unable to like comment');
    }
});

// Dislike a comment
router.put('/:id/dislike', async (req, res) => {
    try{
        const commentId = req.params.id;
        const userId = req.user.id;
        const comment = await Comment.findById(commentId);

        if(!comment) return res.status(404).send('Comment not found');

        // Remove like first (if there is one)
        if(comment.likes.includes(userId)){
            comment.likes.splice(comment.likes.indexOf(userId), 1);
        }

        // Add or remove dislike
        if(!comment.dislikes.includes(userId)){
            comment.dislikes.push(userId);
            await comment.save();
        }
        else{
            comment.dislikes.splice(comment.dislikes.indexOf(userId), 1);
            await comment.save();
        }
        return res.status(200).send(comment);
    }
    catch(err){
        res.status(500).send('Unable to dislike comment');
    }
});

module.exports = router;
