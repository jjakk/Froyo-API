// Filter certain information from the user object

const formatUser = (req, res, unformattedUser) => {
    // Remove unnecessary information
    const {
        password,
        timestamp,
        ...user
    } = unformattedUser;

    // Remove additional private information if user is not getting their own account
    if (user.id !== req.user.id){
        const {
            email_verified,
            dob,
            email,
            ...rest
        } = user;
        return rest;
    }
    return user;
};

module.exports = formatUser;
