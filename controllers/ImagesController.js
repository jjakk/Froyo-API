const { getFileStream } = require('../aws/s3');

const getImage = (req, res) => {
    const { key } = req.params;
    // To Do
    const readStream = getFileStream(key);

    readStream.pipe(res);
};

module.exports = {
    getImage
};
