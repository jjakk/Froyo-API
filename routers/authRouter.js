const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { email, username, password } = req.body;

    try{
        const user = new User({ email, username, password });
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.TOKEN_KEY);
        res.send({ token });
    }
    catch(err){
        return res.status(422).send(err.message);
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

module.exports = router;

