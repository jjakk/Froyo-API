const Takeout = require('./Takeout/Takeout');

const getRoot =  (req, res) => {
    res.status(200).send(req.user.id);
};

const getTakeout = async (req, res) => {
    /*const takeout = new Takeout(req.user.id);

    takeout.export([
        'users',
        'posts',
        'comments',
        'connections',
        'images',
        'chat_membership',
        'chats'
    ]);*/

    // Get the USERS cell - DONE
    // Get all of the user's CONNECTIONS - DONE
    // Get all of the user's POSTS and COMMENTS - DONE
    // Get all of the user's uploaded image files as well as IMAGES cells in the database - DONE
    // Get all of the user's CHAT_MEMBERSHIP cells in the database - DONE
    // Get all of the user's CHATS - DONE
    // Get all of the user's MESSAGES
    // Get all of the user's LIKENESS
    // Download profile picture
    // Download all of the user's other uploaded image files
    res.send("In development");
};

module.exports = {
    getRoot,
    getTakeout
};