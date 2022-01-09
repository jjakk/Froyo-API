
const sortContents = (contents, method='new') => {
    switch(method){
        case 'new':
            return sortByNew(contents);
    }
    return contents;
};

const sortByNew = (contents) => {
    return contents.sort((a,b) => {
        return b.timestamp - a.timestamp;
    });
};

module.exports = sortContents;

