const { Router } = require('express');
const bcrypt = require('bcryptjs');
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
            firstName,
            lastName,
            password
        } = req.body;
    
        // Check that all required fields are present
        switch ('') {
            case email:
                return res.status(400).send('Must provide an email');
            case username:
                return res.status(400).send('Must provide a username');
            case dob:
                return res.status(400).send('Must provide a date of birth');
            case firstName:
                return res.status(400).send('Must provide a first name');
            case lastName:
                return res.status(400).send('Must provide a last name');
            case password:
                return res.status(400).send('Must provide a password');
        }

        // Check the database to make sure the email is not already in use
        pool.query(queries.users.getBy('email'), [email], async (err, result) => {
            if (err) return res.status(400).send(err);
            if (result.rows[0]) return res.status(400).send('Email already in use');

            // Hash the given password before inserting it into the database
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create the user
            pool.query(queries.users.post, [email, username, dob, firstName, lastName, hashedPassword], (err, result) => {
                if (err) return res.status(400).send(err);

                // Get the newly created user
                pool.query(queries.users.getBy('email'), [email], (err, result) => {
                    if (err) return res.status(400).send(err);

                    // Generate JWT token and attach to response header
                    const token = jwt.sign({ userId: result.rows[0] }, process.env.TOKEN_KEY);
                    res.set('authorization', `Bearer ${token}`);

                    res.status(201).send(result.rows[0]);
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
        pool.query(queries.users.getAll, (err, result) => {
            if (err) return res.status(500).send(err);
            return res.status(200).send(result.rows);
        });
    }
    catch (err) {
        res.status(500).send(err);
    }
});

// Get a user by id
router.get('/:id', (req, res) => {
    try{
        const id = req.params.id;

        pool.query(queries.users.getBy('id'), [id], (err, result) => {
            if (err) return res.status(500).send(err);
            return res.status(200).send(result.rows[0]);
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
            firstName,
            lastName,
            password
        } = req.body;
        
        pool.query(queries.users.put, [email, username, dob, firstName, lastName, password, id], (err, result) => {
            if (err) return res.status(500).send(err);
            return res.status(200).send(result.rows);
        });
    }
    catch (err) {
        res.status(500).send(err);
    }
});

// DELETE
// Delete a user by id
router.put('/:id', requireAuth, (req, res) => {
    try{

    }
    catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;