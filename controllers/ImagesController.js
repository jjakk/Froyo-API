const { getFileStream } = require('../aws/s3');

const getImage = (req, res) => {
    const { key } = req.params;
    const readStream = getFileStream(key);

    readStream.on('error', (err) => {
        return res.status(500).send(err.message);
    });
    readStream.pipe(res);
};

module.exports = {
    getImage
};
