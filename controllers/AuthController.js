const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const queryDB = require('../queries/queryDB');
const validateParameter = require('../queries/validators/validateParameter');

// Get a authentication token given email and password
// POST /login
const login = async (req, res) => {
    try {
        const { email, password: passwordAttempt } = req.body;

        // Confirm that email and password aren't empty
        switch (''){
            case email:
                return res.status(400).send('Must provide email');
            case passwordAttempt:
                return res.status(400).send('Must provide password');
        }

        // Check that email is valid
        if(!validateEmail(email)) return res.status(422).send('Not a valid email');
        
        // Query the database for the user
        const [ user ] = await queryDB('users', 'get', { where: ['email'] }, [email]);
        if(!user) return res.status(400).send('Email not found');

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

        return res.status(200).set('authorization', `Bearer ${token}`).send(rest);
    }
    catch (err){
        return res.status(err.status || 500).send(err.message);
    }
};

// Check if the email is already associated with an account
// GET /validEmail/:email
const validEmail = async (req, res) => {
    try {
        const { email } = req.params;
        await validateParameter('email', email);
        return res.status(200).send('Valid email');
    }
    catch (err) {
        res.status(err.status || 500).send(err.message);
    }
};

// Check if the username is already associated with an account
// GET /validUsername/:username
const validUsername = async (req, res) => {
    try {
        const { username } = req.params;
        await validateParameter('username', username);
        return res.status(200).send('Valid username');
    }
    catch (err) {
        res.status(err.status || 500).send(err.message);
    }
};

module.exports = {
    login,
    validEmail,
    validUsername
};
