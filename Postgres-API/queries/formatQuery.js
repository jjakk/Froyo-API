// Ex: ('users', 'get', ['id', 'email']) -> 'SELECT * FROM users WHERE id = $1 AND email = $2'
const formatQuery = (table, method, data) => {
    let format;
    const {
        params,
        where
    } = data;

    switch (method) {
        case 'get':
            if (!where) return `SELECT * FROM ${table}`;
            format = where.map(
                (ele, index) => ele + ' = $' + (index + 1)
            ).join(' AND ');
            return `SELECT * FROM ${table} WHERE ${format}`;

        case 'post':
            format = [
                params.join(', '),
                params.map(
                    (_, index) => ('$' + (index+1))
                ).join(', ')
            ];
            return `INSERT INTO ${table} (${format[0]}) VALUES (${format[1]})`;

        case 'put':
            format = [
                params.map(
                    (param, index) => param + ' = $' + (index + 1)
                ).join(', '),
                where.map(
                    (ele, index) => ele + ' = $' + (params.length + index + 1)
                ).join(' AND ')
            ];
            return `UPDATE ${table} SET ${format[0]} WHERE ${format[1]}`;

        case 'delete':
            format = [
                where.map(
                    (ele, index) => ele + ' = $' + (index + 1)
                ).join(' AND ')
            ];
            return `DELETE FROM ${table} WHERE ${format}`;
    }
}

module.exports = formatQuery;

