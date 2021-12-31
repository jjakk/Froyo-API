// Add author object & like/dislike status to content
const queryDB = require('../../queries/queryDB');
const formatUser = require('./formatUser');

const formatContent = async (req, res, content) => {
    // Like & dislike status
    const [ liking ] = await queryDB('likeness', 'get',
        { where: ['user_id', 'content_id', 'like_content'] },
        [req.user.id, content.id, true]
    );

    const [ disliking ] = await queryDB('likeness', 'get',
        { where: ['user_id', 'content_id', 'like_content'] },
        [req.user.id, content.id, false]
    );

    // Author object
    const [ unformattedAuthor ] = await queryDB('users', 'get', { where: ['id'] }, [content.author_id]);
    const author = formatUser(req, res, unformattedAuthor);

    return {
        ...content,
        author,
        liking: !!liking,
        disliking: !!disliking
    };
}

module.exports = formatContent;
