const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const { Router } = require('express');
const pool = require('../../db');
const queries = require('../../queries/queries');

const router = Router();

router.post('/login', async (req, res) => {
    try {
        const { email, passwordAttempt } = req.body;

        // Confirm that email and password aren't empty
        switch (''){
            case email:
                return res.status(400).send('Must provide email');
            case passwordAttempt:
                return res.status(400).send('Must provide password');
        }

        // Query the database for the user
        const { rows: [ user ] } = await pool.query(queries.users.get('email'), [email]);
        if(!user) return res.status(400).send('Email not found');

        console.log(user.password);
        // Verify the attempted password
        const validPassword = await argon2.verify(user.password, passwordAttempt);
        if(!validPassword) return res.status(400).send('Invalid password');

        // Generate JWT token and attach to response header
        const token = jwt.sign({ userId: user.id }, process.env.TOKEN_KEY);

        // Remove password and other irrelevant information before sending back to client
        const {
            password,
            email_verified,
            timestamp,
            ...rest
        } = user;

        return res.status(201).set('authorization', `Bearer ${token}`).send(rest);
    }
    catch (err){
        return res.status(400).send(err.message);
    }
});

module.exports = router;