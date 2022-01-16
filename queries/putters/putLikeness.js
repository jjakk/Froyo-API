// Like or dislike content
// Given (1) the content id, (2) the requesting user, and (3) like_content status
const queryDB = require('../queryDB');

const putLikeness = async (contentId, user, likeContent) => {

    // Check if a likeness already exists. If not, create one
    const [ likeness ] = await queryDB('likeness', 'get', { where: ['content_id', 'user_id'] }, [contentId, user.id]);
    if (!likeness) {
        await queryDB('likeness', 'post', { params: ['content_id', 'user_id', 'like_content'] }, [contentId, user.id, likeContent]);
    }
    else {
        // User already likes/dislikes the content -> delete likeness
        if (likeness.like_content === likeContent) {
            await queryDB('likeness', 'delete', { where: ['content_id', 'user_id'] }, [contentId, user.id]);
        }
        else {
            // User currently has the opposite likeness of the post -> change to the desired likeness
            await queryDB('likeness', 'put', { params: ['like_content'], where: ['content_id', 'user_id'] }, [likeContent, contentId, user.id]);
        }
    }
};

module.exports = putLikeness;


