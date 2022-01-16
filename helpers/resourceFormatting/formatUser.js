// Filter certain information from the user object
const getConnections = require('../followerLogic/getConnections');

const formatUser = async (targetUser, user) => {
    // Remove unnecessary information
    delete targetUser.password;
    delete targetUser.timestamp;

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


    // Remove additional private information if user is not getting their own account
    if (targetUser.id !== user.id){
        delete targetUser.email_verified;
        delete targetUser.dob;
        delete targetUser.email;
    }

    return targetUser;
};

module.exports = formatUser;
