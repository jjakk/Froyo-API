/*
This middleware gets the resource being requested
and attaches it to the request object (i.e. User,
Post, Comment)
*/

const getTargetResource = (req, res, next) => {
    req.targetResource = req.path.split('/')[1] || '';
    if(req.targetResource === 'content') req.targetResource = '';
    next();
};

module.exports = getTargetResource;