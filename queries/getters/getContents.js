// Get array of contents
// Given (1) the content type, (2) query object, (3) requesting user and (4) sort order - optional
const formatContent = require('./helpers/formatContent');
const sortContents = require('./helpers/sortContents');
const queryDB = require('../queryDB');

const getContents = async (type, query, user, sort='new') => {
    // Check that the user isn't searching for all posts
    if (query.text === '') return [];
    // Get query parameters & set their default values
    let queryParams = Object.keys(query);
    let queryValues = Object.values(query);
    let queryMethod = 'search';
    queryParams.forEach(param => {
        if (param.indexOf('id') !== -1) {
            queryMethod = 'get';
        }
    });
    if (queryParams.length === 0 && queryValues.length === 0) {
        queryParams = ['author_id'];
        queryValues = [user.id];
        queryMethod = 'get';
    }

    let contents = await queryDB(type, queryMethod, { where: queryParams }, queryValues);
    // Format contents
    contents = await formatContent(contents, user);
    // Sort contents
    contents = sortContents(contents, sort);
    return contents;
};

module.exports = getContents;
