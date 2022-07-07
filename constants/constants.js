const path = require('path');

const CONSTANTS = {
    PORT: process.env.PORT || 8000,
    API_ENDPOINT: 'https://api.froyo.social',
    getRootDirectory: () => path.resolve(path.join(__dirname, '../'))
};

module.exports = CONSTANTS;