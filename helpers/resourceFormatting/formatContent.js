// Add author object & like/dislike status to content
const queryDB = require('../../queries/queryDB');
const formatUser = require('./formatUser');

const formatContent = async (req, res, content) => {
    // Get Like & dislike status
    const [ liking ] = await queryDB('likeness', 'get',
        { where: ['user_id', 'content_id', 'like_content'] },
        [req.user.id, content.id, true]
    );

    const [ disliking ] = await queryDB('likeness', 'get',
        { where: ['user_id', 'content_id', 'like_content'] },
        [req.user.id, content.id, false]
    );

    // Add like count if it's the current user's post
    if (content.author_id === req.user.id){
        const likes = await queryDB('likeness', 'get',
            { where: ['content_id', 'like_content'] },
            [content.id, true]
        );

        const dislikes = await queryDB('likeness', 'get',
            { where: ['content_id', 'like_content'] },
            [content.id, false]
        );
        content = {
            ...content,
            like_count: likes.length,
            dislike_count: dislikes.length
        };
    }

    // Replace author_id with author object
    const [ unformattedAuthor ] = await queryDB('users', 'get', { where: ['id'] }, [content.author_id]);
    const author = await formatUser(req, res, unformattedAuthor);
    delete content.author_id;

    return {
        ...content,
        author,
        liking: !!liking,
        disliking: !!disliking
    };
}

const formatContents = async (req, res, contents) => {
    for (let i = 0; i < contents.length; i++){
        contents[i] = await formatContent(req, res, contents[i]);
    }
    return contents;
};

module.exports = {
    formatContent,
    formatContents
};
