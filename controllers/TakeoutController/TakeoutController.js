const Takeout = require('./Takeout');
const fs = require('fs');
const { getRootDirectory } = require('@froyo-api/constants');

const getTakeout = async (req, res) => {
    /*const takeout = new Takeout(req);

    await takeout.downloadCells([
        'users',
        'posts',
        'comments',
        'connections',
        'images',
        'chat_membership',
        'chats',
        'messages',
        'likeness'
    ]);
    await takeout.downloadProfilePicture();
    await takeout.downloadPostImages();
    await takeout.createZip();

    const takeoutPath = `${getRootDirectory()}/takeouts/${req.user.id}.zip`;
    res.download(
        takeoutPath,
        'data-download.zip',
        (err) => {
            if(err) return res.status(500).send(err.message);
            //fs.unlinkSync(takeoutPath);
        }
    );*/
    res.send('In development');
};

module.exports = {
    getTakeout
};