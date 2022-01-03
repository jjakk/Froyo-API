// Filter certain information from the user object
const getConnections = require('../followerLogic/getConnections');

const formatUser = async (req, res, user) => {
    // Remove unnecessary information
    delete user.password;
    delete user.timestamp;

    // Add follower & followee count
    const {
        followers,
        followees
    } = await getConnections(user.id);

    user = {
        ...user,
        follower_count: followers,//.length,
        followee_count: followees//.length
    };


    // Remove additional private information if user is not getting their own account
    if (user.id !== req.user.id){
        delete user.email_verified;
        delete user.dob;
        delete user.email;
    }

    return user;
};

module.exports = formatUser;
