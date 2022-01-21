// Function to make a user follow another
const pool = require('../db');
const queries = require('../queries');
const queryDB = require('../queryDB');
const { isFollower}  = require('../getters/helpers/followStatus');
const getUserLetters = require('../getters/helpers/getUserLetters');

const followUser = async (follower_id, followee_id) => {
    try {
        let err;
        // Check that the user isn't following themselves
        if (followee_id === follower_id) {
            err = new Error('You cannot follow yourself');
            err.status = 400;
            throw err;
        }

        // Check the database to see if a connection already exists
        const { rows: [ connection ] } = await pool.query(queries.connections.get, [follower_id, followee_id]);
        // If a connection doesn't already exist, create it
        if (!connection) {
            await queryDB('connections', 'post', {
                params: ['user_a_id', 'user_b_id', 'a_following_b']
            }, [follower_id, followee_id, true]);
            return {
                status: 200,
                message: 'Followed user'
            }
        }
        
        const alreadyFollowing = isFollower(follower_id, connection);
        const userLetters = getUserLetters(follower_id, connection);

        // Toggle the following status and return the outcome
        await queryDB('connections', 'put', {
            params: [`${userLetters[0]}_following_${userLetters[1]}`],
            where: ['id']
        }, [!alreadyFollowing, connection.id]);
        if (alreadyFollowing) {
            return {
                status: 200,
                message: 'Unfollowed user'
            }
        }

        return {
            status: 200,
            message: 'Followed user'
        };
    }
    catch (err) {
        throw err;
    }
};

module.exports = followUser;


