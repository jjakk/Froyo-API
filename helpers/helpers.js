// Capitalize first letter of a string
// hello world -> Hello world
const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Calculate a user's age in years
const calculateAge = (birthDate) => {
    var today = new Date();
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

module.exports = {
    capitalize,
    calculateAge
};

