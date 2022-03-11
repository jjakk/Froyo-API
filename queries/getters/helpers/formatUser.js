// Filter certain information from the user object
const getConnections = require('../getConnections');

const formatUser = async (targetUser, user) => {
    // Remove unnecessary information
    delete targetUser.password;
    delete targetUser.timestamp;
    delete targetUser.reset_password_token;
    delete targetUser.reset_password_expiration;

    // Add follower & followee count
    const {
        followers,
        followees
    } = await getConnections(targetUser.id);

    targetUser = {
        ...targetUser,
        follower_count: followers.length,
        followee_count: followees.length
    };

    // Get whether the requesting user is following this user
    /*  [To Do]  */

    // Remove additional private information if user is not getting their own account
    if (targetUser.id !== user.id){
        delete targetUser.email_verified;
        delete targetUser.dob;
        delete targetUser.email;
    }

    return targetUser;
};

module.exports = formatUser;
