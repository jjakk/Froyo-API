const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { email, username, password } = req.body;
    // Email check
    if(email.indexOf('@') === -1){
        return res.status(422).send('Not a valid email');
    }
    User.findOne({email}).then(
        (user) => {
            return res.status(422).send('Email already in use');
        }
    );
    // Username check
    User.findOne({username}).then(
        (user) => {
            return res.status(422).send('Username taken');
        }
    );

    try{
        const user = new User({ email, username, password });
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.TOKEN_KEY);
        res.send({ token });
    }
    catch(err){
        return res.status(422).send('An error occured setting up your account');
    }
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    if(!email && !password){
        return res.status(422).send('Must provide email and password');
    }
    else if(!email){
        return res.status(422).send('Must provide email');
    }
    else if(!password){
        return res.status(422).send('Must provide password');
    }

    const user = await User.findOne({ email });
    if(!user){
        return res.status(422).send('Invalid email');
    }

    try{
        await user.comparePassword(password);
        const token = jwt.sign({ userId: user._id }, process.env.TOKEN_KEY);
        res.send({ token });
    }
    catch(err){
        return res.status(422).send('Invalid password');
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

