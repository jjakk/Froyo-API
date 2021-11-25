const { Router } = require('express');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const queries = require('../../queries/queries');
const pool = require('../../db');
// Require Auth
const requireAuth = require('../../middleware/requireAuth');

const router = Router();

// POST
// Create a new user
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
        res.status(500).send(err);
    }
});

// GET
// Get all users
router.get('/', (req, res) => {
    try{
        pool.query(queries.users.get(), (err, result) => {
            if (err) return res.status(500).send(err);
            const ids = result.rows.map(user => user.id);
            return res.status(200).send(ids);
        });
    }
    catch (err) {
        res.status(500).send(err);
    }
});

// Get a user by id
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
        res.status(500).send(err);
    }
});

// PUT
// Update a user by id
router.put('/:id', requireAuth, (req, res) => {
    try{
        const id = req.params.id;

        // Makes sure that the given user is deleting their own account
        if (id !== req.user.id) return res.status(403).send('You are not authorized to delete this user');

        // Get the new user data
        const {
            email,
            username,
            dob,
            first_name,
            last_name,
            password
        } = req.body;

        pool.query(queries.users.put, [email, username, dob, first_name, last_name, password, id], (err, result) => {
            if (err) return res.status(500).send(err);

            // Return the newly updated user
            pool.query(queries.users.get('id'), [id], (err, result) => {
                if (err) return res.status(500).send(err);
                return res.status(200).send(result.rows[0]);
            });
            
        });
    }
    catch (err) {
        res.status(500).send(err);
    }
});

// DELETE
// Delete a user by id
router.delete('/:id', requireAuth, (req, res) => {
    try{
        const id = req.params.id;
        // Check that the given user is deleting their own account
        if(id !== req.user.id) return res.status(403).send('You are not authorized to delete this user');

        // Delete their account
        poo.query(queries.users('id'), [id], (err, result) => {
            if (err) return res.status(500).send(err);
            return res.status(200).send('User deleted');
        });
    }
    catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;