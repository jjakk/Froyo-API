// Add author object & like/dislike status to content
const e = require('express');
const queryDB = require('../../queryDB');
const formatUser = require('./formatUser');

const format = async (content, user) => {
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

    // Get all the content's images
    console.log(content.id);
    const images = await queryDB('images', 'get', { where: ['post_id'] }, [content.id]);
    if(images.length > 0) {
        content = {
            ...content,
            images: images.map(image => image.bucket_key)
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

const formatContent = async (content, user) => {
    // Iterate if array, otherwise format single content
    if(Array.isArray(content)){
        for (let i = 0; i < content.length; i++){
            content[i] = await format(content[i], user);
        }
    }
    else{
        content = await format(content, user);
    }
    return content;
};

module.exports = formatContent;
