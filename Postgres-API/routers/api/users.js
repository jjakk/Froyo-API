const { Router } = require('express');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const queries = require('../../queries/queries');
const pool = require('../../db');
// Require Auth
const requireAuth = require('../../middleware/requireAuth');

const router = Router();

// Create (POST) a new user
router.post('/', (req, res) => {
    try{
        // Get user information
        const {
            email,
            username,
            dob,
            first_name,
            last_name,
            password
        } = req.body;
    
        // Check that all required fields are present
        switch (undefined) {
            case email:
                return res.status(400).send('Must provide an email');
            case username:
                return res.status(400).send('Must provide a username');
            case dob:
                return res.status(400).send('Must provide a date of birth');
            case first_name:
                return res.status(400).send('Must provide a first name');
            case last_name:
                return res.status(400).send('Must provide a last name');
            case password:
                return res.status(400).send('Must provide a password');
        }

        // Check that email is valid
        if(email.indexOf('@') === -1) return res.status(422).send('Not a valid email');

        // Check the database to make sure the email is not already in use
        pool.query(queries.users.get('email'), [email], async (err, result) => {
            if (err) return res.status(400).send(err);
            if (result.rows[0]) return res.status(400).send('Email already in use');
            
            // Check the database to make sure the username is not already taken
            pool.query(queries.users.get('username'), [username], async (err, result) => {
                if (err) return res.status(400).send(err);
                if (result.rows[0]) return res.status(400).send('Username already taken');

                // Hash the given password before inserting it into the database
                const hashedPassword = await argon2.hash(password);

                // Create the user
                pool.query(queries.users.post, [email, username, dob, first_name, last_name, hashedPassword], (err, result) => {
                    if (err) return res.status(400).send(err);

                    // Get the newly created user
                    pool.query(queries.users.get('email'), [email], (err, result) => {
                        if (err) return res.status(400).send(err);

                        // Generate JWT token and attach to response header
                        const token = jwt.sign({ userId: result.rows[0] }, process.env.TOKEN_KEY);
                        res.set('authorization', `Bearer ${token}`);

                        res.status(201).send(result.rows[0]);
                    });
                });
            });
        });
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

// GET all users
router.get('/', (req, res) => {
    try{
        pool.query(queries.users.get(), (err, result) => {
            if (err) return res.status(500).send(err);
            const ids = result.rows.map(user => user.id);
            return res.status(200).send(ids);
        });
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

// GET a user by id
router.get('/:id', requireAuth, (req, res) => {
    try{
        const id = req.params.id;

        pool.query(queries.users.get('id'), [id], (err, result) => {
            if (err) return res.status(500).send(err);
            if (!result.rows[0]) return res.status(404).send('User not found');

            // Remove password and other irrelevant information
            const {
                password,
                email_verified,
                timestamp,
                ...user
            } = result.rows[0];

            // Remove private information if user is not getting their own account
            if (result.rows[0].id !== req.user.id){
                const {
                    dob,
                    email,
                    ...result
                } = user;
                return res.status(200).send(result);
            }
            return res.status(200).send(user);
        });
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

// Update (PUT) a user by id
router.put('/', requireAuth, (req, res) => {
    try{
        // Check that the user exists in the database
        pool.query(queries.users.get('id'), [req.user.id], (err, result) => {
            if(err) return res.status(500).send(err);
            if(!result.rows[0]) return res.status(404).send('User not found');

            // Get the new user data
            const {
                email,
                username,
                dob,
                first_name,
                last_name,
                password
            } = req.body;

            // Set email_verified to false if email is changed
            const changedEmail = email === req.user.email;

            // Update the user with the new information
            pool.query(queries.users.put([
                'email',
                'username',
                'dob',
                'first_name',
                'last_name',
                'password',
                'email_verified'
            ], req.user.id), [
                email || req.user.email,
                username || req.user.username,
                dob || req.user.dob,
                first_name || req.user.first_name,
                last_name || req.user.last_name,
                password || req.user.password,
                changedEmail ? false : req.user.email_verified,
                req.user.id
            ], (err, result) => {
                if (err) return res.status(500).send(err);

                // Return the newly updated user
                pool.query(queries.users.get('id'), [req.user.id], (err, result) => {
                    if (err) return res.status(500).send(err);
                    return res.status(200).send(result.rows[0]);
                });
                
            });
        });
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

// DELETE a user by id
router.delete('/', requireAuth, (req, res) => {
    try{
        // Delete their account
        pool.query(queries.users.delete, [req.user.id], (err, result) => {
            if (err) return res.status(500).send(err);
            return res.status(200).send('User deleted');
        });
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

// Follow (PUT) a user
router.put('/:id/follow', requireAuth, async (req, res) => {
    try {
        const id = req.params.id;

        // Check that the user isn't following themselves
        if (id === req.user.id) return res.status(400).send('You cannot follow yourself');

        // Check the database to see if a connection already exists
        const { rows: [ userExists ] } = await pool.query(queries.connections.get, [req.user.id, id]);

        console.log(userExists);
        // Create a connection if one doesn't exist
        if (!userExists) {
            await pool.query(queries.connections.post, [req.user.id, id]);
        }

        // Checks the database to see if current user is user A or user B in the connection
        const { rows: [ isUserA ] } = await pool.query(queries.connections.getAB, [req.user.id, id]);
        const { rows: [ isUserB ] } = await pool.query(queries.connections.getBA, [req.user.id, id]);

        // Change the following status accordingly
        switch (true) {
            case !!isUserA:
                await pool.query(queries.connections.followB, [true, req.user.id]);
            case !!isUserB:
                await pool.query(queries.connections.followA, [true, req.user.id]);
        }

        return res.status(200).send('Followed user');

    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

// Unfollow (PUT) a user
router.put('/:id/unfollow', requireAuth, (req, res) => {
    try {
        const id = req.params.id;
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;