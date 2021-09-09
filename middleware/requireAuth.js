const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = (req, res, next) => {
    const { authorization } = req.headers;

    if(!authorization) return res.status(401).send("You're not logged in.");

    const token = authorization.replace('Bearer ', '');
    jwt.verify(token, process.env.TOKEN_KEY, async (err, payload) => {
        if(err) return res.status(401).send('Invalid token.');

        const { userId } = payload;

        const user = await User.findById(userId);
        console.log(user);
        if(user){
            req.user = user;
            next();
        }
        else{
            return res.status(401).send('Invalid token.');
        }
    });
};


