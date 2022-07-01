const Takeout = require('./Takeout/Takeout');

const getRoot =  (req, res) => {
    res.status(200).send(req.user.id);
};

const getTakeout = async (req, res) => {
    const takeout = new Takeout(req.user.id);

    /*await takeout.export([
        'users',
        'posts',
        'comments',
        'connections',
        'images',
        'chat_membership',
        'chats',
        'messages',
        'likeness'
    ]);*/

    //await takeout.downloadProfilePicture();
    //takeout.downloadImages();

    //const zip = takeout.zip();

    // Download profile picture
    // Download all of the user's other uploaded image files
    res.send("In development");
};

module.exports = {
    getRoot,
    getTakeout
};