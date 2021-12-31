// Queries different database tables depending on the input
const dynamicQueryDB = async (type, queryMethod, { where: queryParams }, queryValues) => {
    return (
        type ? (
            await queryDB(type, queryMethod, { where: queryParams }, queryValues)
        ) : (
            (await queryDB('posts', queryMethod, { where: queryParams }, queryValues)).concat(
                await queryDB('comments', queryMethod, { where: queryParams }, queryValues)
            )
        )
    );
};

module.exports = dynamicQueryDB;

