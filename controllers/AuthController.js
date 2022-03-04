const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const queryDB = require('../queries/queryDB');
const pool = require('../queries/db');
const validateParameter = require('../queries/validators/validateParameter');
const checkEmailFormatting = require('../queries/validators/checkEmailFormatting');
// Email Automation
const { sendAutomatedEmail } = require('../helpers/helpers');
// Email Templates
const resetPasswordTemplate = require('../emailTemplates/resetPassword');
const resetPasswordConfirmationTemplate = require('../emailTemplates/resetPasswordConfirmation');

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

// Send an email with a password reset link
// POST /resetPassword
const sendResetPasswordEmail = async (req, res) => {
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

        // Send automated email to user with reset button
        let mailOptions = {
            to: email,
            from: 'noreply@protosapps.com',
            subject: 'Password Reset',
            html: resetPasswordTemplate(req.headers.host, token)
        };
        await sendAutomatedEmail(mailOptions);

        return res.status(200).send('Password reset, email sent');
    }
    catch (err) {
        res.status(err.status || 500).send(err.message);
    }
};

// Reset a user's password given a reset token
// POST /reset/:id
const resetPassword = async (req, res) => {
    try {
        const {
            token
        } = req.params;

        const {
            password,
            confirmPassword
        } = req.body;
    
        // Get the user associated with the token
        const [ user ] = await queryDB('users', 'get', { where: ['reset_password_token'] }, [token]);
        if (!user) {
            return res.status(400).send('Email not found');
        }
    
        // Check that the token is valid & hasn't expired
        const expirationDate = user.reset_password_expiration;
        var now = new Date(Date.now());
        if (expirationDate > now) {
            return res.status(400).send('Token expired');
        }
    
        // Confirm that passwords were given & match
        if(!password || !confirmPassword) {
            return res.status(400).send('Must provide password & confirm password');
        }
        else if(password !== confirmPassword) {
            return res.send('Passwords do not match.');
        }
    
        // Update the user's password & remove the reset token & expiriation date
        const hashedPassword = await argon2.hash(password);
        await queryDB('users', 'put', {
            params: [
                'password',
                'reset_password_token',
                'reset_password_expiration'
            ],
            where: [
                'reset_password_token'
            ]
        }, [
            hashedPassword,
            null,
            null,
            token
        ]);
    
        // Send confirmation email
        let mailOptions = {
            to: user.email,
            from: process.env.NOREPLY_EMAIL_ADDRESS,
            subject: 'Password Reset Confirmation',
            html: resetPasswordConfirmationTemplate()
        };
        await sendAutomatedEmail(mailOptions);
    
        // Return success message
        return res.status(200).send('Password reset');
    }
    catch (err) {
        res.status(err.status || 500).send(err.message);
    }
};
/*
async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, async function(err, user) {
        if (!user) {
          console.log('Password reset token is invalid or has expired.');
          return res.redirect('/');
        }
        if(req.body.password === req.body.confirm) {
          // Hash the new password
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(req.body.password, salt);

          user.password = hashedPassword;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

          user.save(function(err) {
            done(err, user);
          });
        }
        else {
            console.log("Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'noreply.protosapps@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'noreply.protosapps@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/');
  });

*/

// GET /reset/:token
const renderResetPassword = async (req, res) => {
    try {
        const {
            token
        } = req.params;
        const user = await queryDB('users', 'get', { where: ['reset_password_token'] }, [token]);

        if (!user) {
            return res.send('Password reset token is invalid or has expired.');
        }
        return res.render('passwordReset', { token });
    }
    catch (err) {
        res.status(err.status || 500).send(err.message);
    }
};

module.exports = {
    login,
    validEmail,
    validUsername,
    sendResetPasswordEmail,
    resetPassword,
    renderResetPassword
};
