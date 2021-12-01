// Capitalize first letter of a string
// hello world -> Hello world
const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = {
    capitalize
};

