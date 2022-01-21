// Check that the given parameter is formatted correctly and/or not already in use
const queryDB = require('../queryDB');
const { capitalize } = require('../../helpers/helpers');

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

// Return true is email's format is valid
const checkEmailFormatting = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

module.exports = validateParameter;
