const queryDB = require('../queries/queryDB');
// Helpers
const getConnections = require('../queries/getters/getConnections');
const sortContents = require('../queries/getters/helpers/sortContents');
const getContents = require('../queries/getters/getContents');

// Generate the current's feed
// GET /
const get = async (req, res) => {
    try{
        // Get all the users the current user's following
        const { followees } = await getConnections(req.user.id);

        // Get all their posts, concatenate them, and send back
        let feedPosts = [];
        for (let i = 0; i < followees.length; i++) {
            feedPosts.push(
                ...(
                    await getContents('posts', { author_id: followees[i] }, req.user)
                )
            );
        }
        // Sort the posts
        feedPosts = sortContents(feedPosts, 'new');

        return res.status(200).send(feedPosts);
    }
    catch (err) {
        return res.status(err.status || 500).send(err.message);
    }
};

module.exports = {
    get
};
