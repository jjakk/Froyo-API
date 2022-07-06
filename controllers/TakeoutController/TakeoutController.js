const Takeout = require('./Takeout');

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
    await takeout.createZip();*/

    // Download profile picture
    // Download all of the user's other uploaded image files

    res.send('In development');
};

module.exports = {
    getTakeout
};