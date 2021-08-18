const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { email, username, dob, firstName, lastName, password } = req.body;
    // Email check
    if(!email){
        return res.status(400).send('Must enter an email');
    }
    if(email.indexOf('@') === -1){
        return res.status(422).send('Not a valid email');
    }
    const emailTaken = await User.findOne({email});
    if(emailTaken){
        return res.status(422).send('Email already in use');
    }
    // Username check
    if(!username){
        return res.status(400).send('Must enter a username');
    }
    const usernameTaken = await User.findOne({username});
    if(usernameTaken){
        return res.status(422).send('Username taken');
    }

    try{
        const user = new User({ email, username, dateOfBirth: dob, firstName, lastName, password });
        await user.save();
        const token = jwt.sign({ userId: user._id }, process.env.TOKEN_KEY);
        res.status(200).send({ token });
    }
    catch(err){
        return res.status(422).send(err._message);
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
        res.status(200).send({ token });
    }
    catch(err){
        return res.status(422).send('Invalid password');
    }
});

// Check if username is valid
router.post('/checkUsername', async (req, res) => {
    try{
        const username = req.body.username;
        const user = await User.findOne({ username });
        if(user){
            return res.status(422).send('Username taken');
        }
        else{
            return res.status(200).send('Username available');
        }
    }
    catch(err){
        return res.status(422).send(err._message);
    }
});

// Check if info is valid for a new account
router.post('/checkEmail', async (req, res) => {
    try{
        const email = req.body.email;
        const user = await User.findOne({ email });
        if(user){
            return res.status(422).send('Email already in use');
        }
        else{
            return res.status(200).send('Email available');
        }
    }
    catch(err){
        return res.status(422).send(err._message);
    }
});

module.exports = router;

