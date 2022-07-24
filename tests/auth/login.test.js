const request = require('supertest');
const { testUser } = require('../testConstants');
const app = require('../../app');

test('Missing email', async () => {
    const response = await request(app).post("/auth/login").send({
        password: testUser.password
    });
    expect(response.statusCode).toBe(422);
});

test('Missing password', async () => {
    const response = await request(app).post("/auth/login").send({
        email: testUser.email
    });
    expect(response.statusCode).toBe(422);
});

test('Email & password given. Email not formatted properly', async () => {
    const response = await request(app).post("/auth/login").send({
        email: 'sdfdjsofijsdiofjosidjfoisjfosdjoifjs',
        password: testUser.password
    });
    expect(response.statusCode).toBe(422);
});

test('Email & password given. Email not in the database', async () => {
    const response = await request(app).post("/auth/login").send({
        email: 'sdfdjsofijsdiofjosidjfoisjfosdjoifjsdoifjoisdjf@gmail.com',
        password: testUser.password
    });
    expect(response.statusCode).toBe(422);
});

test('Email & password given. Password is incorrect', async () => {
    const response = await request(app).post("/auth/login").send({
        email: testUser.email,
        password: 'sdjflsdkf'
    });
    expect(response.statusCode).toBe(422);
});

test('valid login', async () => {
    const response = await request(app).post("/auth/login").send({
        email: testUser.email,
        password: testUser.password
    });
    expect(response.statusCode).toBe(200);
});