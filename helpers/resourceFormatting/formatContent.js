// Add author object & like/dislike status to content
const queryDB = require('../../queries/queryDB');
const formatUser = require('./formatUser');

const formatContent = async (content, user) => {
    // Get Like & dislike status
    const [ liking ] = await queryDB('likeness', 'get',
        { where: ['user_id', 'content_id', 'like_content'] },
        [user.id, content.id, true]
    );

    const [ disliking ] = await queryDB('likeness', 'get',
        { where: ['user_id', 'content_id', 'like_content'] },
        [user.id, content.id, false]
    );

    // Add like count if it's the current user's post
    if (content.author_id === user.id){
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
    const author = await formatUser(unformattedAuthor, user);
    delete content.author_id;

    return {
        ...content,
        author,
        liking: !!liking,
        disliking: !!disliking
    };
}

const formatContents = async (contents, user) => {
    for (let i = 0; i < contents.length; i++){
        contents[i] = await formatContent(contents[i], user);
    }
    return contents;
};

module.exports = {
    formatContent,
    formatContents
};
