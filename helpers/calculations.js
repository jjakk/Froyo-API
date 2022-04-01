// The purpose of this script is for all miscellaneous calculations

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
    calculateAge
};

