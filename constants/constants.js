const path = require('path');

const CONSTANTS = {
    API_ENDPOINT: 'https://api.froyo.social',
    getRootDirectory: () => path.resolve(path.join(__dirname, '../'))
};

module.exports = CONSTANTS;