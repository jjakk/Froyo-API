// Get array of contents
// Given (1) the content type, (2) query object, (3) requesting user and (4) sort order - optional
// Get contents from database
const formatContent = require('./helpers/formatContent');
const sortContents = require('./helpers/sortContents');
const queryDB = require('../queryDB');

const getContents = async (type, query, user, sort='new') => {
    // Check that the user isn't searching for all posts
    if (query.text === '') return [];
    const {
        queryParams,
        queryValues,
        queryMethod
    } = determineQuery(query);

    let contents = await queryDB(type, queryMethod, { where: queryParams }, queryValues);
    // Format contents
    contents = await formatContent(contents, user);
    // Sort contents
    contents = sortContents(contents, sort);
    return contents;
};

// Determine query parameters and values based on query object
const determineQuery = (query) => {
    // Get query parameters & set their default values
    let queryParams = Object.keys(query);
    let queryValues = Object.values(query);
    let queryMethod = 'search';
    // If the query object contains anything with an ID, change the query method to get
    queryParams.forEach(param => {
        if (param.indexOf('id') !== -1) {
            queryMethod = 'get';
        }
    });
    // If give empty query object, return all the current user's posts
    if (queryParams.length === 0 && queryValues.length === 0) {
        queryParams = ['author_id'];
        queryValues = [user.id];
        queryMethod = 'get';
    }
    return {
        queryParams,
        queryValues,
        queryMethod
    };
};

module.exports = getContents;
