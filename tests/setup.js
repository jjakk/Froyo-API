const request = require('supertest');
const app = require('../app');

const setup = async () => {
    await request(app).post("/users").send({
        email: "jester@jak.com",
        username: "jester",
        dob: new Date("November 23, 1995"),
        first_name: "jester",
        last_name: "lester",
        password: "password"
    });
};

module.exports = setup;