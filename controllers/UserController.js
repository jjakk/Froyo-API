// CRUD operations for users
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const queries = require('../queries/queries');
const pool = require('../db');
const queryDB = require('../queries/queryDB');
// Helpers
const { validateEmail, calculateAge } = require('../helpers/helpers');
const formatUser = require('../helpers/resourceFormatting/formatUser');

// GET a user by id
const getById = async (req, res) => {
    try{
        const { id: userId } = req.params;
        let [ user ] = await queryDB('users', 'get', { where: ['id'] }, [userId]);

        if (!user) return res.status(404).send('User not found');
        
        user = formatUser(req, res, user);
        return res.status(200).send(user);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

// GET all users' IDs
const getAllUsers = async (req, res) => {
    try{
        // Get all users from the database and send back their IDs
        const users = await queryDB('users', 'get', {}, []);
        const ids = users.map(user => user.id);
        return res.status(200).send(ids);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
};

// GET all of a user's posts
const getPosts = async (req, res) => {
    try {
        const { id: userId } = req.params;
        const posts = await queryDB('posts', 'get', { where: ['author_id'] }, [userId]);
        if (posts.length === 0) return res.status(404).send('No posts found');
        return res.status(200).send(posts);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
};

// Create (POST) a new user
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

        // Check that email is valid
        if(!validateEmail(email)) return res.status(422).send('Not a valid email');

        // Check the database to make sure the email is not already in use
        const [ emailTaken ] = await queryDB('users', 'get', { where: ['email'] }, [email]);
        if (emailTaken) return res.status(400).send('Email already in use');
        
        // Check the database to make sure the username is not already taken
        const [ usernameTaken ] = await queryDB('users', 'get', { where: ['username'] }, [username]);
        if (usernameTaken) return res.status(400).send('Username already taken');

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
        res.status(500).send(err.message);
    }
}

// Update (PUT) a user by id
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
        res.status(500).send(err.message);
    }
}

// DELETE a user by id
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
        await queryDB('likeness', 'delete', { where: 'user_id' }, [req.user.id]);

        // Delete their account from the database
        await queryDB('users', 'delete', { where: ['id'] }, [req.user.id]);
        return res.status(200).send('User deleted');
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

// Follow (PUT) a user. Works as a toggle, so if the user is already following the other user, they will unfollow them
const follow = async (req, res) => {
    try {
        const { id: follower_id } = req.user;
        const { id: followee_id } = req.params;

        // Check that the user isn't following themselves
        if (followee_id === follower_id) return res.status(400).send('You cannot follow yourself');

        // Check the database to see if a connection already exists
        const { rows: [ connectionExists ] } = await pool.query(queries.connections.get, [follower_id, followee_id]);

        // If a connection doesn't already exist, create it
        if (!connectionExists) {
            await queryDB('connections', 'post', {
                params: ['user_a_id', 'user_b_id', 'a_following_b']
            }, [follower_id, followee_id, true]);
            return res.status(200).send('Followed user');
        }

        // Checks the database for the user's letter in the connection
        const userLetter = (
            await queryDB('connections', 'get', {
                where: ['user_a_id', 'user_b_id'] 
            }, [follower_id, followee_id])
        ) ? 'a'
            : (
                await queryDB('connections', 'get', {
                    where: ['user_b_id', 'user_a_id'] 
                }, [follower_id, followee_id])
            )
                ? 'b'
                : null;
        // Letter of the other user in the connection
        const otherLetter = userLetter === 'a' ? 'b' : 'a';

        // Extract whether the user is already following the other user
        const [
            {
                id: connection_id,
                [`${userLetter}_following_${otherLetter}`]: alreadyFollowing,
            }
        ] = await queryDB('connections', 'get', {
            where: [`user_${userLetter}_id`, `user_${otherLetter}_id`]
        }, [follower_id, followee_id]);

        // Toggle the following status and return the outcome
        await queryDB('connections', 'put', {
            params: [`${userLetter}_following_${otherLetter}`],
            where: ['id']
        }, [!alreadyFollowing, connection_id]);
        if (alreadyFollowing) return res.status(200).send('Unfollowed user');
        return res.status(200).send('Followed user');

    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

// GET if a user is following another user
const getFollowing = async (req, res) => {
    try {
        const { follower_id, followee_id } = req.params;

        const { rows: [ connection ] } = await pool.query(queries.connections.get, [follower_id, followee_id]);
        if (!connection) return res.status(200).send(false);

       // Checks the database for the user's letter in the connection
       const followerLetter = (
            connection.user_a_id === follower_id
        ) ? 'a'
            : (
                connection.user_b_id === follower_id
            )
                ? 'b'
                : null;
        // Letter of the other user in the connection
        const followeeLetter = followerLetter === 'a' ? 'b' : 'a';

        // Extract whether the user is already following the other user
        const [
            {
                [`${followerLetter}_following_${followeeLetter}`]: following,
            }
        ] = await queryDB('connections', 'get', {
            where: [`user_${followerLetter}_id`, `user_${followeeLetter}_id`]
        }, [follower_id, followee_id]);

        // Return the following status
        return res.status(200).send(following);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

module.exports = {
    getById,
    getAllUsers,
    getPosts,
    post,
    put,
    deleteUser,
    follow,
    getFollowing
};