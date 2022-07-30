// CRUD operations for users
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const queries = require('../queries/queries');
const pool = require('../queries/db');
const queryDB = require('../queries/queryDB');
// File functions
const { uploadFile, unlinkFile, deleteFile } = require('../aws/s3');
// Helpers
const getUsers = require('../queries/getters/getUsers');
const { invalidUser } = require('../helpers/validators');
const { isFollower, isFollowee } = require('../queries/getters/helpers/followStatus');
const followUser = require('../queries/putters/followUser');
const getUserConnections = require('../queries/getters/getConnections');
const postNotificationToken = require('../notifications/postNotificationToken');
const { deleteContent } = require('../controllers/ContentsController');

const queryUsers = async (req, res) => {
    const {
        query
    } = req;
    const users = await getUsers(query, req.user);
    return res.status(200).send(users);
};

const getUserById = async (req, res) => {
    try{
        const { id: userId } = req.params;
        const user = await getUsers({ userId }, req.user);
        return res.status(200).send(user);
    }
    catch(err) {
        return res.status(err.status || 400).send(err.message);
    }
}

const createUser = async (req, res) => {
    // Get user information
    const {
        email=null,
        username=null,
        dob=null,
        first_name=null,
        last_name=null,
        password=null,
        notificationToken=null
    } = req.body;

    // Check that all required fields are present
    switch (null) {
        case email:
            return res.status(422).send('Must provide an email');
        case username:
            return res.status(422).send('Must provide a username');
        case dob:
            return res.status(422).send('Must provide a date of birth');
        case first_name:
            return res.status(422).send('Must provide a first name');
        case last_name:
            return res.status(422).send('Must provide a last name');
        case password:
            return res.status(422).send('Must provide a password');
    }

    // Check that all the user's information is formatted correctly
    const invalidUserError = invalidUser(req.body);
    if(invalidUserError) return res.status(422).send(invalidUserError);

    // Check that email isn't already in use
    const [ emailTaken ] = await queryDB('users', 'get', { where: ['email'] }, [email]);
    if(emailTaken) return res.status(422).send('Email already in use');

    // Check that username isn't already in use
    const [ usernameTaken ] = await queryDB('users', 'get', { where: ['username'] }, [username]);
    if(usernameTaken) return res.status(422).send('Username already in use');

    // Hash the given password before inserting it into the database
    const hashedPassword = await argon2.hash(password);

    // Create the user
    await queryDB('users', 'post',
        { params: ['email', 'username', 'dob', 'first_name', 'last_name', 'password'] },
        [ email, username, dob, first_name, last_name, hashedPassword ]
    );

    // Get the newly created user
    const [ user ] = await queryDB('users', 'get', { where: ['email'] }, [email]);

    // Store the user's notification token in the database
    await postNotificationToken(user.id, notificationToken);

    // Generate JWT token and attach to response header
    const token = jwt.sign({ userId: user.id }, process.env.TOKEN_KEY);

    return res.status(201).set('authorization', `Bearer ${token}`).send(user);
}

const updateUser = async (req, res) => {
    const { file } = req;

    // Check that the user exists in the database
    const [ nonUpdatedUser ] = await queryDB('users', 'get', { where: ['id'] }, [req.user.id]);
    if(!nonUpdatedUser) return res.status(404).send('User not found');

    // Get the new user data
    const {
        email=req.user.email,
        username=req.user.username,
        dob=req.user.dob,
        first_name=req.user.first_name,
        last_name=req.user.last_name,
        description=req.user.description
    } = req.body;

    // Set email_verified to false if the user changed their email
    const changedEmail = email !== req.user.email;
    const changedUsername = username !== req.user.username;

    // Checks that the user's information is valid
    const invalidUserError = invalidUser(req.body);
    if(invalidUserError) return res.status(400).send(invalidUserError);

    // If the user changed their email or username, check that the new one's not already in use
    switch(true) {
        case changedEmail:
            // Check that the new email isn't already in use
            const [ emailTaken ] = await queryDB('users', 'get', { where: ['email'] }, [email]);
            if(emailTaken) return res.status(400).send('Email already in use');
        case changedUsername:
            // Check that the new username isn't already in use
            const [ usernameTaken ] = await queryDB('users', 'get', { where: ['username'] }, [username]);
            if(usernameTaken) return res.status(400).send('Username already in use');
    }

    let newProfilePictureKey = null;
    if(file) {
        const { Key } = await uploadFile(file);
        // Remove temporary file from uploads directory
        await unlinkFile(file.path);
        newProfilePictureKey = Key;
        if(nonUpdatedUser.profile_picture_bucket_key) {
            // Delete the old profile picture from S3
            await deleteFile(nonUpdatedUser.profile_picture_bucket_key);
        }
    }

    // Update the user with the new information
    const [ user ] = await queryDB('users', 'put', {
            params: [
                'email',
                'username',
                'dob',
                'first_name',
                'last_name',
                'description',
                'email_verified',
                'profile_picture_bucket_key'
            ],
            where: ['id'],
    },[
        email || req.user.email,
        username || req.user.username,
        dob || req.user.dob,
        first_name || req.user.first_name,
        last_name || req.user.last_name,
        description !== null ? description : req.user.description,
        changedEmail ? false : req.user.email_verified,
        newProfilePictureKey || req.user.profile_picture_bucket_key,
        req.user.id
    ]);

    // Generate JWT token and attach to response header
    const token = jwt.sign({ userId: user.id }, process.env.TOKEN_KEY);

    return res.status(201).set('authorization', `Bearer ${token}`).send(user);
}

const deleteUser = async (req, res) => {
    // Check that user exists in the database
    const [ user ] = await queryDB('users', 'get', { where: ['id'] }, [req.user.id]);
    if(!user) return res.status(404).send('User not found');

    // Delete all of the user's content
    let contents = await queryDB('posts', 'get', { where: ['author_id'] }, [req.user.id]);
    contents.concat(
        await queryDB('comments', 'get', { where: ['author_id'] }, [req.user.id]),
    );
    for(const content of contents) {
        await deleteContent({
            ...req,
            params: {
                id: content.id
            },
            resource: {
                type: content.parent_id ? 'comments' : 'posts',
                typeName: content.parent_id ? 'comment' : 'post'
            }
        }, res);
    }

    // Delete all of a user's connections
    await pool.query(queries.connections.deleteWithOne, [req.user.id]);

    // Delete all of the user's likeness
    await queryDB('likeness', 'delete', { where: ['user_id'] }, [req.user.id]);

    // Delete all of the user's notification tokens
    await queryDB('notification_tokens', 'delete', { where: ['user_id'] }, [req.user.id]);

    // Delete the user's profile picture from S3 if they have one
    if(req.user.profile_picture_bucket_key) {
        await deleteFile(req.user.profile_picture_bucket_key);
    }

    // Delete their account from the database
    await queryDB('users', 'delete', { where: ['id'] }, [req.user.id]);
    return res.status(200).send('User deleted');
}

const getConnections = async (req, res) => {
    const { id: userId } = req.params;
    let {
        followers,
        followees: following
    } = await getUserConnections(userId);

    // Convert user IDs to user objects
    for(let i = 0; i < followers.length; i++){
        followers[i] = await getUsers({ userId: followers[i] }, req.user);
    }
    
    for(let i = 0; i < following.length; i++){
        following[i] = await getUsers({ userId: following[i] }, req.user);
    }

    return res.status(200).send({
        followers,
        following
    });
};

const getFollowing = async (req, res) => {
    const { follower_id, followee_id } = req.params;

    const { rows: [ connection ] } = await pool.query(queries.connections.get, [follower_id, followee_id]);
    if (!connection) return res.status(200).send(false);

    const following = isFollower(follower_id, connection);

    // Return the following status
    return res.status(200).send(following);
}

const followUserById = async (req, res) => {
    const { id: follower_id } = req.user;
    const { id: followee_id } = req.params;
    const {
        status,
        message
    } = await followUser(follower_id, followee_id);
    
    return res.status(status).send(message);
}

module.exports = {
    queryUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getConnections,
    getFollowing,
    followUserById
};