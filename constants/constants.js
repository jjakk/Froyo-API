const fs = require('fs');
const path = require('path');

const CONSTANTS = {
    getTakeoutDirectory: () => {
        const takeoutDirectory = path.resolve(path.join(__dirname, '../takeouts'));
        if (!fs.existsSync(takeoutDirectory)) fs.mkdirSync(takeoutDirectory);
        return takeoutDirectory;
    }
};

module.exports = CONSTANTS;