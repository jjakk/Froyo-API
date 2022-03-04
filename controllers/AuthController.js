const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const queryDB = require('../queries/queryDB');
const validateParameter = require('../queries/validators/validateParameter');
const checkEmailFormatting = require('../queries/validators/checkEmailFormatting');
// Email templates
const resetPasswordTemplate = require('../emailTemplates/resetPassword');

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

        // Check that email is formatted properly
        if(!checkEmailFormatting(email)) return res.status(422).send('Not a valid email');
        
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

const resetPassword = async (req, res) => {
    try{
        const {
            email
        } = req.body;

        // Generate a random reset token
        const buf = crypto.randomBytes(20);
        const token = buf.toString('hex');

        // Find he user and set the info to the databse

        // Get user by email
        const user = await queryDB('users', 'get', { where: ['email'] }, [email]);
        if (!user) {
            return res.status(400).send('Email not found');
        }

        // Update the user's cell to include reset token & expiration date
        await queryDB('users', 'put', {
            params: [
                'reset_password_token',
                'reset_password_expiration'
            ],
            where: ['email']
        }, [
            token,
            new Date(Date.now() + 3600000),
            email
        ]);

        let smtpTransport = nodemailer.createTransport({
            host: process.env.NOREPLY_EMAIL_HOST,
            port: process.env.NOREPLY_EMAIL_PORT,
            auth: {
                user: 'noreply@protosapps.com',
                pass: process.env.NOREPLY_EMAIL_PASSWORD
            }
        });

        let mailOptions = {
            to: email,
            from: 'noreply@protosapps.com',
            subject: 'Password Reset',
            html: resetPasswordTemplate(req.headers.host, token)
        };

        // Send automated email to user with reset button
        await smtpTransport.sendMail(mailOptions);
        return res.status(200).send('Password reset, email sent');
    }
    catch (err) {
        res.status(err.status || 500).send(err.message);
    }
};

const getPasswordReset = async (req, res) => {
    try {
        const {
            token
        } = req.params;
        const user = await queryDB('users', 'get', { where: ['reset_password_token'] }, [token]);

        if (!user) {
            return res.send('Password reset token is invalid or has expired.');
        }
        return res.render('passwordReset');
    }
    catch (err) {
        res.status(err.status || 500).send(err.message);
    }
};

module.exports = {
    login,
    validEmail,
    validUsername,
    resetPassword,
    getPasswordReset
};
