// Filter certain information from the user object

const formatUser = (req, res, unformattedUser) => {
    // Remove unnecessary information
    const {
        password,
        email_verified,
        timestamp,
        ...user
    } = unformattedUser;

    // Remove additional private information if user is not getting their own account
    if (user.id !== req.user.id){
        const {
            dob,
            email,
            ...rest
        } = user;
        return rest;
    }
    return user;
};

module.exports = formatUser;
