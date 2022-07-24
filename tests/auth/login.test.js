const request = require('supertest');
const app = require('../../app');

test('Missing email', async () => {
    const response = await request(app).post("/auth/login").send({
        password: 'password'
    });
    expect(response.statusCode).toBe(422);
});

test('Missing password', async () => {
    const response = await request(app).post("/auth/login").send({
        email: 'sdfdjsofijsdiofjosidjfoisjfosdjoifjsdoifjoisdjf@gmail.com'
    });
    expect(response.statusCode).toBe(422);
});

test('Email & password given. Email not in database', async () => {
    const response = await request(app).post("/auth/login").send({
        email: 'sdfdjsofijsdiofjosidjfoisjfosdjoifjsdoifjoisdjf@gmail.com',
        password: 'password'
    });
    expect(response.statusCode).toBe(422);
});

test('Email & password given. Email not formatted properly', async () => {
    const response = await request(app).post("/auth/login").send({
        email: 'sdfdjsofijsdiofjosidjfoisjfosdjoifjs',
        password: 'password'
    });
    expect(response.statusCode).toBe(422);
});

test('Email & password given. Password is incorrect', async () => {
    const response = await request(app).post("/auth/login").send({
        email: 'jester@jak.bz',
        password: 'sdjflsdkf'
    });
    expect(response.statusCode).toBe(422);
});

test('valid login', async () => {
    const response = await request(app).post("/auth/login").send({
        email: 'jester@jak.bz',
        password: 'password'
    });
    expect(response.statusCode).toBe(200);
});