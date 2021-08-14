const express = require('express');
const mongoose = require('mongoose');
const User = mongoose.model('User');

const router = express.Router();

// Get user info
router.get('/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const user = await User.findById(id);
        const { password, ...userInfo } = user._doc;
        return res.status(200).send(userInfo);
    }
    catch(err){
        return res.status(400).send('Cannot get user info');
    }
});

// Update user info
router.put('/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const user = await User.findByIdAndUpdate(id, req.body, { new: true });
        user.save();
        return res.status.send('User info updated');
    }
    catch(err){
        return res.status(400).send('Cannot update user info');
    }
});

// Delete user
router.delete('/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const user = await User.findByIdAndRemove(id);
        if(!user){
            return res.status(404).send('User not found');
        }
        return res.status(500).send('User deleted');
    }
    catch(err){
        return res.status(400).send('Cannot delete user');
    }
});

// Follow a user
router.put('/:id/follow', async (req, res) => {
    try{
        const id = req.params.id;
        if(req.body.userId === id){
            return res.status(400).send('Cannot follow yourself');
        }
        // user = The person getting the follower
        // follower = The person following someone
        const user = await User.findById(id);
        const follower = await User.findById(req.body.id);
        if(user.followers.includes(req.body.userId)){
            return res.status(403).send('Already following');
        }
        await user.followers.push(req.body.userId);
        await follower.following.push(id);
        return res.status(200).send('Followed');
    }
    catch(err){
        return res.status(400).send('Cannot follow user');
    }
});

// Unfollow a user
router.put('/:id/unfllow', async (req, res) => {
    try{
        const id = req.params.id;
        const user = await User.findById(id);
        const follower = await User.findById(req.body.id);
        if(!user.followers.includes(req.body.userId)){
            return res.status(403).send("You're not following this user");
        }
        await user.followers.pull(req.body.userId);
        await follower.following.pull(id);
        res.status(200).send('Unfollowed');
    }
    catch(err){
        res.status(400).send('Cannot unfollow user');
    }
});

// Check if info is valid for a new account
router.post('/verifyInfo', async (req, res) => {
    const { email, username } = req.body;
    const checkEmail = await User.find({ email });
    if(checkEmail){
        return res.status(400).send('Email already in use');
    }
    const checkUsername = await User.find({ username });
    if(checkUsername){
        return res.status(400).send('Username already taken');
    }
    return res.status(200).send('Account info valid');
});


module.exports = router;