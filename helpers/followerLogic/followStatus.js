// Gets if a user is following in a connection
const getUserLetters = require('./getUserLetters');

const isFollower = (userId, connection) => {
    const letters =  getUserLetters(userId, connection);

    // Extract whether the user is already following the other user
    return connection[`${letters[0]}_following_${letters[1]}`];
};

const isFollowee = (userId, connection) => {
    const letters =  getUserLetters(userId, connection);

    // Extract whether the user is already following the other user
    return connection[`${letters[1]}_following_${letters[0]}`];
};

module.exports = {
    isFollower,
    isFollowee
};
