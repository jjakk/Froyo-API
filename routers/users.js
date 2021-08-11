const express = require('express');
const mongoose = require('mongoose');
const User = mongoose.model('User');

const router = express.Router();

// Get user info
router.get('/:id', (req, res) => {

});

// Update user info
router.put('/:id', (req, res) => {

});

// Delete user
router.delete('/:id', (req, res) => {

});

// Follow a user
router.put('/:id/follow', (req, res) => {
    
});

// Unfollow a user
router.put('/:id/unfllow', (req, res) => {

});


module.exports = router;
