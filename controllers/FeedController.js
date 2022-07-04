const getConnections = require('../queries/getters/getConnections');
const sortContents = require('../queries/getters/helpers/sortContents');
const getContents = require('../queries/getters/getContents');

const getFeed = async (req, res) => {
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
};

module.exports = {
    getFeed
};
