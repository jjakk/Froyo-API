// Get an object with arrays of followers and followees
const queryDB = require('../queryDB');
const {
    isFollower,
    isFollowee
} = require('./helpers/followStatus');
const getUserLetters = require('./helpers/getUserLetters');

const getConnections = async (userId) => {
    const connections = await queryDB('connections', 'get', { where: ['user_a_id', 'user_b_id'], whereCondition: 'OR' }, [userId, userId]);
    let followers = [];
    let followees = [];
    for (let i = 0; i < connections.length; i++) {
        const userLetters = getUserLetters(userId, connections[i]);
        // Check if they're following the other
        if (isFollower(userId, connections[i])) {
            followees.push(
                connections[i][`user_${userLetters[1]}_id`]
            );
        }
        // Check if they're followed by the other
        if (isFollowee(userId, connections[i])){
            followers.push(
                connections[i][`user_${userLetters[1]}_id`]
            );
        }
    }
    return {
        followers,
        followees
    };
};

module.exports = getConnections;
