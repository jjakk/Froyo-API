const argon2 = require('argon2');
const queryDB = require('../queries/queryDB');
// Helpers
const getConnections = require('../helpers/followerLogic/getConnections');
const { formatContents } = require('../helpers/resourceFormatting/formatContent');

// Generate the current's feed
const get = async (req, res) => {
    try{
        // Get all the users the current user's following
        const { followees } = await getConnections(req.user.id);

        // Get all their posts, concatenate them, and send back
        const feedPosts = [];
        for (let i = 0; i < followees.length; i++) {
            feedPosts.push(
                ...(
                    await formatContents(
                        req,
                        res,
                        await queryDB('posts', 'get', { where: ['author_id'] }, [followees[i]])
                    )
                )
            );
        }

        return res.status(200).send(feedPosts);
    }
    catch (err) {
        return err.message;
    }
};

module.exports = {
    get
};
