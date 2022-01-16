// Get an array of userIDs for either likes or dislikes
// Given (1) like_content value, and (2) contentId

const getLikeness = async (contentId, likeContent) => {
    // Get all likes from the database with the given content ID
    let likes  = await queryDB('likeness', 'get', { where: ['content_id', 'like_content'] }, [contentId, likeContent]);
    likes = likes.map(like => like.user_id);

    return likes;
};