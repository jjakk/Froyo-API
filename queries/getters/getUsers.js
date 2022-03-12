// Get a particular user's profile
const queryDB = require('../queryDB');
const formatUser = require('./helpers/formatUser');

const getUsers = async (query, reqUser) => {
    try {
        let userResult;
        let err;
        const {
            userId,
            text
        } = query;

        // Get a specific user if an ID is provided
        if (userId){
            [ userResult ] = await queryDB('users', 'get', { where: ['id'] }, [userId]);
            if (!userResult){
                err = new Error('User not found');
                err.status = 404;
                throw err;
            }
            userResult = await formatUser(userResult, reqUser);
        }
        else if (text) {
            userResult = await queryDB('users', 'search', { where: ['first_name', 'last_name', 'username'], whereCondition: 'OR' }, [text, text, text]);
            for(let i = 0; i < userResult.length; i++){
                userResult[i] = await formatUser(userResult[i], reqUser)
            }
        }
        // Get all the users in the database otherwise
        else{
            userResult = await queryDB('users', 'get', {}, []);
            userResult = userResult.map(user => user.id);
        }
        return userResult;
    }
    catch (err) {
        throw err;
    }
}

module.exports = getUsers;