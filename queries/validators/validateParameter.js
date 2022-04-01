// Check that the given parameter is formatted correctly and/or not already in use
const queryDB = require('../queryDB');
const { capitalize } = require('../../helpers/helpers');
const checkEmailFormatting = require('./checkEmailFormatting');

const validateParameter = async (type, value) => {
    try {
        const [ parameterInUse ] = await queryDB('users', 'get', { where: [type] }, [value]);
        let err;
        // Check formatting if email is given
        if(type === 'email' && !checkEmailFormatting(value)) {
            err = new Error('Invalid email')
            err.status = 400;
            throw err;
        }
        // Throw error if user already exists with parameter
        if(parameterInUse){
            err = new Error(`${capitalize(type)} already in use`);
            err.status = 400;
            throw err;
        }
    }
    catch (err) {
        throw err;
    }
}

module.exports = validateParameter;
