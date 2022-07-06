const fs = require('fs');
const path = require('path');

const CONSTANTS = {
    getTakeoutDirectory: () => path.resolve(path.join(__dirname, '../takeouts'))
};

module.exports = CONSTANTS;