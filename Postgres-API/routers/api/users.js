const { Router } = require('express');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const queries = require('../../queries/queries');
const pool = require('../../db');
// Require Auth
const requireAuth = require('../../middleware/requireAuth');

const router = Router();

// GET all users
router.get('/', async (req, res) => {
    try{
        // Get all users from the database and send back their IDs
        const { rows: users } = await pool.query(queries.users.get());
        const ids = users.map(user => user.id);
        return res.status(200).send(ids);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

// GET a user by id
router.get('/:id', requireAuth, async (req, res) => {
    try{
        const { id } = req.params;
        // Retrieve user then remove password and other irrelevant information
        const {rows:[{
            password,
            email_verified,
            timestamp,
            ...user
        }]} = await pool.query(queries.users.get('id'), [id]);

        if (!user) return res.status(404).send('User not found');

        // Remove additional private information if user is not getting their own account
        if (user.id !== req.user.id){
            const {
                dob,
                email,
                ...rest
            } = user;
            return res.status(200).send(rest);
        }

        return res.status(200).send(user);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

// GET all of a user's posts
router.get('/:id/posts', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { rows: posts } = await pool.query(queries.posts.getByAuthor, [id]);
        if (posts.length === 0) return res.status(404).send('No posts found');
        return res.status(200).send(posts);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

// Create (POST) a new user
router.post('/', async (req, res) => {
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
        const { rows: [ emailTaken ] } = await pool.query(queries.users.get('email'), [email]);
        if (emailTaken) return res.status(400).send('Email already in use');
        
        // Check the database to make sure the username is not already taken
        const { rows: [ usernameTaken ] } = await pool.query(queries.users.get('username'), [username]);
        if (usernameTaken) return res.status(400).send('Username already taken');

        // Hash the given password before inserting it into the database
        const hashedPassword = await argon2.hash(password);

        // Create the user
        const {
            rows: [ maybeUser ]
        } = await pool.query(queries.users.post, [email, username, dob, first_name, last_name, hashedPassword]);

        // Get the newly created user
        const { rows: [ user ] } = await pool.query(queries.users.get('email'), [email]);

        // Generate JWT token and attach to response header
        const token = jwt.sign({ userId: user.id }, process.env.TOKEN_KEY);
        res.set('authorization', `Bearer ${token}`);

        res.status(201).send(user);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

// Update (PUT) a user by id
router.put('/', requireAuth, async (req, res) => {
    try{
        // Check that the user exists in the database
        const { rows: [ userExists ] } = await pool.query(queries.users.get('id'), [req.user.id])
        if(!userExists) return res.status(404).send('User not found');

        // Get the new user data
        const {
            email,
            username,
            dob,
            first_name,
            last_name,
            password
        } = req.body;

        const newPassword = password ? await argon2.hash(password) : null;

        // Set email_verified to false if email is changed
        const changedEmail = email === req.user.email;

        // Update the user with the new information
        await pool.query(queries.users.put([
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
            newPassword || req.user.password,
            changedEmail ? false : req.user.email_verified,
            req.user.id
        ]);

        // Return the newly updated user
        const { rows: [ user ] } = await pool.query(queries.users.get('id'), [req.user.id]);
        return res.status(200).send(user);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

// DELETE a user by id
router.delete('/', requireAuth, async (req, res) => {
    try{
        // Delete their account from the database
        await pool.query(queries.users.delete, [req.user.id]);
        return res.status(200).send('User deleted');
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

// Follow (PUT) a user. Works as a toggle, so if the user is already following the other user, they will unfollow them
router.put('/:id/follow', requireAuth, async (req, res) => {
    try {
        const { id: follower_id } = req.user;
        const { id: followee_id } = req.params;

        // Check that the user isn't following themselves
        if (followee_id === follower_id) return res.status(400).send('You cannot follow yourself');

        // Check the database to see if a connection already exists
        const { rows: [ connectionExists ] } = await pool.query(queries.connections.get, [follower_id, followee_id]);

        // Create a connection if one doesn't already exist
        if (!connectionExists) {
            await pool.query(queries.connections.post, [follower_id, followee_id]);
        }

        // Checks the database to see if current user is user A or user B in the connection
        const userLetter = (await pool.query(queries.connections.getAB, [follower_id, followee_id])).rows[0]
            ? 'A'
            : (await pool.query(queries.connections.getAB, [followee_id, follower_id])).rows[0]
                ? 'B'
                : null;
        
        if(userLetter === 'A'){
            // Extract whether the user is already following the other user
            const {
                rows: [
                    {
                        id: connection_id,
                        a_following_b,
                    }
                ]
            } = await pool.query(queries.connections.getAB, [follower_id, followee_id]);

            // Toggle the following status and return the outcome
            await pool.query(queries.connections.followB, [!a_following_b, connection_id]);
            if (a_following_b) return res.status(200).send('Unfollowed user');
            return res.status(200).send('Followed user');
        }
        else if (userLetter === 'B') {
            // Extract whether the user is already following the other user
            const {
                rows: [
                    {
                        id: connection_id,
                        b_following_a
                    }
                ]
            } = await pool.query(queries.connections.getAB, [followee_id, follower_id]);

            // Toggle the following status and return the outcome
            await pool.query(queries.connections.followA, [!b_following_a, connection_id]);
            if (b_following_a) return res.status(200).send('Unfollowed user');
            return res.status(200).send('Followed user');
        }

    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

// GET if a user is following another user
router.get('/:user_a_id/following/:user_b_id', requireAuth, async (req, res) => {
    try {
        const { user_a_id, user_b_id } = req.params;

        // Check that the user is following the other user
        const {
            rows: [
                {
                    a_following_b
                }
            ]
        } = await pool.query(queries.connections.getAB, [user_a_id, user_b_id]);

        // Return the following status
        return res.status(200).send(a_following_b);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;