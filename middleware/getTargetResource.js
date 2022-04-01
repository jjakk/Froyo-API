/*
This middleware gets the resource being requested
and attaches it to the request object (i.e. Users,
Posts, Comments).

The typeName is the formatted name of the resource
Ex: posts -> Post, comments -> Comment
*/

const { capitalize } = require('../helpers/helpers');

const getTargetResource = (req, res, next) => {
    const resource = req.path.split('/')[1] || '';
    req.resource = {
        type: resource,
        typeName: capitalize(resource.slice(0, -1))
    };
    next();
};

module.exports = getTargetResource;