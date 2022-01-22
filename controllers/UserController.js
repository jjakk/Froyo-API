// CRUD operations for users
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const queries = require('../queries/queries');
const pool = require('../queries/db');
const queryDB = require('../queries/queryDB');
// Helpers
const getUsers = require('../queries/getters/getUsers');
const { calculateAge } = require('../helpers/helpers');
const { isFollower } = require('../queries/getters/helpers/followStatus');
const followUser = require('../queries/putters/followUser');
const validateParameter = require('../queries/validators/validateParameter');

// Get all users' IDs
// GET /
const get = async (req, res) => {
    try{
        const users = await getUsers();
        return res.status(200).send(users);
    }
    catch (err) {
        res.status(err.status || 500).send(err.message);
    }
};

// Get a user by id
// GET /:id
const getById = async (req, res) => {
    try{
        const { id: userId } = req.params;
        const user = await getUsers(userId);

        return res.status(200).send(user);
    }
    catch (err) {
        res.status(err.status || 500).send(err.message);
    }
}

// Create a new user
// POST /
const post = async (req, res) => {
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

        // Make sure the email & username aren't taken and are formatted correctly
        await validateParameter('email', email);
        await validateParameter('username', username);

        // Confirm that the user is at least 13 years old
        if (calculateAge(new Date(dob)) < 13) return res.status(400).send('Must be at least 13 years old to create an account');

        // Hash the given password before inserting it into the database
        const hashedPassword = await argon2.hash(password);

        // Create the user
        await queryDB('users', 'post',
            { params: ['email', 'username', 'dob', 'first_name', 'last_name', 'password'] },
            [ email, username, dob, first_name, last_name, hashedPassword ]
        );

        // Get the newly created user
        const [ user ] = await queryDB('users', 'get', { where: ['email'] }, [email]);

        // Generate JWT token and attach to response header
        const token = jwt.sign({ userId: user.id }, process.env.TOKEN_KEY);
        res.set('authorization', `Bearer ${token}`);

        res.status(201).send(user);
    }
    catch (err) {
        res.status(err.status || 500).send(err.message);
    }
}

// Update a user by id
// PUT /:id
const put = async (req, res) => {
    try{
        // Check that the user exists in the database
        const [ userExists ] = await queryDB('users', 'get', { where: ['id'] }, [req.user.id]);
        if(!userExists) return res.status(404).send('User not found');

        // Get the new user data
        const {
            email,
            username,
            dob,
            first_name,
            last_name,
            description,
            password
        } = req.body;

        const newPassword = password ? await argon2.hash(password) : null;

        // Set email_verified to false if email is changed
        const changedEmail = email === req.user.email;

        // Update the user with the new information
        await queryDB('users', 'put', {
                params: [
                    'email',
                    'username',
                    'dob',
                    'first_name',
                    'last_name',
                    'description',
                    'password',
                    'email_verified'
                ],
                where: ['id'],
        },[
            email || req.user.email,
            username || req.user.username,
            dob || req.user.dob,
            first_name || req.user.first_name,
            last_name || req.user.last_name,
            description || req.user.description,
            newPassword || req.user.password,
            changedEmail ? false : req.user.email_verified,
            req.user.id
        ]);

        // Return the newly updated user
        const [ user ] = await queryDB('users', 'get', { where: ['id'] }, [req.user.id]);

        // Generate JWT token and attach to response header
        const token = jwt.sign({ userId: user.id }, process.env.TOKEN_KEY);

        return res.status(201).set('authorization', `Bearer ${token}`).send(user);
    }
    catch (err) {
        res.status(err.status || 500).send(err.message);
    }
}

// Delete the current user
// DELETE /
const deleteUser = async (req, res) => {
    try{
        // Check that user exists in the database
        const [ user ] = await queryDB('users', 'get', { where: ['id'] }, [req.user.id]);
        if(!user) return res.status(404).send('User not found');

        // Delete all of the user's posts
        await queryDB('posts', 'delete', { where: ['author_id'] }, [req.user.id]);

        // Delete all of the user's comments
        await queryDB('comments', 'delete', { where: ['author_id'] }, [req.user.id]);

        // Delete all of a user's connections
        await pool.query(queries.connections.deleteWithOne, [req.user.id]);

        // Delete all of the user's likeness
        await queryDB('likeness', 'delete', { where: ['user_id'] }, [req.user.id]);

        // Delete their account from the database
        await queryDB('users', 'delete', { where: ['id'] }, [req.user.id]);
        return res.status(200).send('User deleted');
    }
    catch (err) {
    res.status(err.status || 500).send(err.message);
    }
}

// Follow a user. Works as a toggle, so if the user is already following the other user, they will unfollow them
// PUT /:id/follow
const follow = async (req, res) => {
    try {
        const { id: follower_id } = req.user;
        const { id: followee_id } = req.params;
        const {
            status,
            message
        } = await followUser(follower_id, followee_id);
        
        return res.status(status).send(message);

    }
    catch (err) {
        res.status(err.status || 500).send(err.message);
    }
}

// Get if a user is following another user
// GET /:follower_id/following/:followee_id
const getFollowing = async (req, res) => {
    try {
        const { follower_id, followee_id } = req.params;

        const { rows: [ connection ] } = await pool.query(queries.connections.get, [follower_id, followee_id]);
        if (!connection) return res.status(200).send(false);

       const following = isFollower(follower_id, connection);

        // Return the following status
        return res.status(200).send(following);
    }
    catch (err) {
        res.status(err.status || 500).send(err.message);
    }
}

module.exports = {
    get,
    getById,
    post,
    put,
    deleteUser,
    follow,
    getFollowing
};