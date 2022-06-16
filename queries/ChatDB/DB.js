const functionalQueryDB = require('../queryDB');

class DB {
    constructor(req, res){
        this.req = req;
        this.res = res;
    }

    async queryDB(table, method, conditions, values){
        return await functionalQueryDB(table, method, conditions, values);
    }
}

module.exports = DB;