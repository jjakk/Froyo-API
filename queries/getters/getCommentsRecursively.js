/*
This function gets all the comments of some
content recursively. In other words, it gets
all the comments, and their sub-comments, and so on.
*/
const getContents = require('./getContents');

// Deletes an individual comment.
const getComments = async (commentId, user) => {
    return await getContents('comments', { parent_id: commentId }, user);
};

// Deletes all the comments of a parent content
const getCommentsRecursively = async (contentId, user) => {
    const comments = await getComments(contentId, user);
    let coms = [];
    if(comments.length === 0) {
        return [];
    };
    for (let i = 0; i < comments.length; i++) {
        coms.push({
            ...comments[i],
            comments: await getCommentsRecursively(comments[i].id, user)
        });
    }
    return coms;
};

module.exports = getCommentsRecursively;