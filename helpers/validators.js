// The purpose of this file is to validate that certain fields are formatted correctly
const { calculateAge } = require('./calculations');

// Check that email is formatted correctly
const validEmail = (email) => {
    // Check formatting using Regex magic
    const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(String(email).toLowerCase());
};

// Check that username is formatted correctly
const validUsername = (username) => {
    const reg = /^(?=[a-zA-Z0-9._]{2,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
    return reg.test(String(username).toLowerCase());
};

// Takes in a user object and checks that all fields are valid
const invalidUser = (user) => {
    const {
        email,
        username,
        dob
    } = user;

    // EMAIL
    // Check that email is formatted properly if an email is given
    if(email && !validEmail(email)) return 'Not a valid email';

    // USERNAME
    // Check that username is formatted properly if a username is given
    if(username && !validUsername(username)) return 'Not a valid username';

    // DATE OF BIRTH
    // Confirm that the user is at least 13 years old if a date of birth is given
    if (dob && calculateAge(new Date(dob)) < 13) return 'Must be at least 13 years old to create an account';

    return null;
};

module.exports = {
    validEmail,
    validUsername,
    invalidUser
};
