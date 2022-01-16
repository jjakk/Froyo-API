// Get an array of userIDs for either likes or dislikes
// Given (1) like_content value, and (2) contentId
const queryDB = require('../queryDB');

const getLikeness = async (contentId, likeContent) => {
    // Get all likes from the database with the given content ID
    let likeness  = await queryDB('likeness', 'get', { where: ['content_id', 'like_content'] }, [contentId, likeContent]);
    likeness = likeness.map(current => current.user_id);

    return likeness;
};

module.exports = getLikeness;