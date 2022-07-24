const request = require('supertest');
const app = require('../app');

const teardown = async () => {
    await request(app).delete("/users").send({});
}

module.exports = teardown;