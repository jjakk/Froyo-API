const queryDB = require('../queries/queryDB');
// Helpers
const getConnections = require('../helpers/followerLogic/getConnections');
const sortContents = require('../helpers/sorting/sortContents');
const { formatContents } = require('../helpers/resourceFormatting/formatContent');

// Generate the current's feed
const get = async (req, res) => {
    try{
        // Get all the users the current user's following
        const { followees } = await getConnections(req.user.id);

        // Get all their posts, concatenate them, and send back
        let feedPosts = [];
        for (let i = 0; i < followees.length; i++) {
            feedPosts.push(
                ...(
                    await formatContents(
                        await queryDB('posts', 'get', { where: ['author_id'] }, [followees[i]]),
                        req.user
                    )
                )
            );
        }
        // Sort the posts
        feedPosts = sortContents(feedPosts, 'new');

        return res.status(200).send(feedPosts);
    }
    catch (err) {
        return err.message;
    }
};

module.exports = {
    get
};
