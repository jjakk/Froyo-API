const { Router } = require('express');
const queries = require('../../queries/queries');
const pool = require('../../db');

const router = Router();

// POST
// Create a new user
router.post('/', (req, res) => {
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
    {}
    // Create the user
    {}
});

// GET
// Get all users
router.get('/', (req, res) => {
    pool.query(queries.users.getAll, (err, result) => {
        if (err) return res.status(500).send(err);
        return res.status(200).send(result.rows);
    });
});

// Get a user by id
router.get('/:id', (req, res) => {
    
});

// PUT
// Update a user by id
router.put('/:id', (req, res) => {
    
});

// DELETE
// Delete a user by id
router.put('/:id', (req, res) => {
    
});

module.exports = router;