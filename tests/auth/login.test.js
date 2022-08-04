const request = require('supertest');
const { testUsers } = require('../testConstants');
const app = require('../../app');

test('Missing email', async () => {
    const response = await request(app).post("/auth/login").send({
        password: testUsers[0].password
    });
    expect(response.statusCode).toBe(422);
});

test('Missing password', async () => {
    const response = await request(app).post("/auth/login").send({
        email: testUsers[0].email
    });
    expect(response.statusCode).toBe(422);
});

test('Email & password given. Email not formatted properly', async () => {
    const response = await request(app).post("/auth/login").send({
        email: 'sdfdjsofijsdiofjosidjfoisjfosdjoifjs',
        password: testUsers[0].password
    });
    expect(response.statusCode).toBe(422);
});

test('Email & password given. Email not in the database', async () => {
    const response = await request(app).post("/auth/login").send({
        email: 'sdfdjsofijsdiofjosidjfoisjfosdjoifjsdoifjoisdjf@gmail.com',
        password: testUsers[0].password
    });
    expect(response.statusCode).toBe(422);
});

test('Email & password given. Password is incorrect', async () => {
    const response = await request(app).post("/auth/login").send({
        email: testUsers[0].email,
        password: 'sdjflsdkf'
    });
    expect(response.statusCode).toBe(422);
});

test('valid login', async () => {
    const response = await request(app).post("/auth/login").send({
        email: testUsers[0].email,
        password: testUsers[0].password
    });
    expect(response.statusCode).toBe(200);
});