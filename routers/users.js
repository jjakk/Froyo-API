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
router.put('/:id/follow', (req, res) => {
    try{
        const id = req.params.id;
    }
    catch(err){
        return res.status(400).send('Cannot follow user');
    }
});

// Unfollow a user
router.put('/:id/unfllow', (req, res) => {

});


module.exports = router;
