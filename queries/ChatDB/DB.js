const functionalQueryDB = require('../queryDB');
const db = require('../db');

class DB {
    constructor(req, res){
        this.req = req;
        this.res = res;
        this.db = db;
    }

    async queryDB(table, method, conditions, values){
        return await functionalQueryDB(table, method, conditions, values);
    }
}

module.exports = DB;