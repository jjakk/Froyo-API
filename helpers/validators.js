// The purpose of this file is to validate that certain fields are formatted correctly

// Check that email is formatted correctly
const validEmail = (email) => {
    // Check formatting using Regex magic
    const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(String(email).toLowerCase());
};

// Check that username is formatted correctly
const validUsername = (username) => {
    const reg = /^[a-zA-Z0-9_]{3,20}$/;
    return reg.test(String(username).toLowerCase());
};

module.exports = {
    validEmail,
    validUsername
};
