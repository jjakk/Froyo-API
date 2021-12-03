// Capitalize first letter of a string
// hello world -> Hello world
const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Return true is email is valid
const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

module.exports = {
    capitalize,
    validateEmail
};

