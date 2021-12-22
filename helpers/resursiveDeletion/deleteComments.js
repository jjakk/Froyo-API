/*
This function delete all the comments of some
content recursively. In other words, it deletes
all the comments, and their sub-comments, and so on.
*/
const queryDB = require('../../queries/queryDB');

// Deletes an individual comment.
const deleteComment = async (commentId) => {
    // Delete all the comment's likeness
    await queryDB('likeness', 'delete', { where: ['content_id'] }, [commentId]);
    // Delete the comment
    await queryDB('comments', 'delete', { where: ['id'] }, [commentId]);
};

// Deletes all the comments of a parent content
const deleteComments = async (contentId) => {
    const comments = await queryDB('comments', 'get', { where: ['parent_id'] }, [contentId]);
    if(comments.length === 0) return;
    for (let i = 0; i < comments.length; i++) {
        console.log(comments[i].text);
        await deleteComments(comments[i].id);
        await deleteComment(comments[i].id);
    }
};

module.exports = deleteComments;