const request = require('supertest');
const app = require('../../app');

test('Missing email', async () => {
    const response = await request(app).post("/users").send({
        username: 'createUserTest',
        dob: new Date('January 1, 2000'),
        first_name: 'creatUser',
        last_name: 'test',
        password: 'password'
    });
    expect(response.text).toBe('Must provide an email');
    expect(response.statusCode).toBe(422);
});

test('Missing username', async () => {
    const response = await request(app).post("/users").send({
        email: 'createUserTest@jak.bz',
        dob: new Date('January 1, 2000'),
        first_name: 'creatUser',
        last_name: 'test',
        password: 'password'
    });
    expect(response.text).toBe('Must provide a username');
    expect(response.statusCode).toBe(422);
});

test('Missing dob', async () => {
    const response = await request(app).post("/users").send({
        email: 'createUserTest@jak.bz',
        username: 'createUserTest',
        first_name: 'creatUser',
        last_name: 'test',
        password: 'password'
    });
    expect(response.text).toBe('Must provide a date of birth');
    expect(response.statusCode).toBe(422);
});

test('Missing first_name', async () => {
    const response = await request(app).post("/users").send({
        email: 'createUserTest@jak.bz',
        username: 'createUserTest',
        dob: new Date('January 1, 2000'),
        last_name: 'test',
        password: 'password'
    });
    expect(response.text).toBe('Must provide a first name');
    expect(response.statusCode).toBe(422);
});


test('Missing last_name', async () => {
    const response = await request(app).post("/users").send({
        email: 'createUserTest@jak.bz',
        username: 'createUserTest',
        dob: new Date('January 1, 2000'),
        first_name: 'creatUser',
        password: 'password'
    });
    expect(response.text).toBe('Must provide a last name');
    expect(response.statusCode).toBe(422);
});

test('Missing password', async () => {
    const response = await request(app).post("/users").send({
        email: 'createUserTest@jak.bz',
        username: 'createUserTest',
        dob: new Date('January 1, 2000'),
        first_name: 'creatUser',
        last_name: 'test'
    });
    expect(response.text).toBe('Must provide a password');
    expect(response.statusCode).toBe(422);
});

test('All fields are given. Email formatted incorrectly', async () => {
    const response = await request(app).post("/users").send({
        email: 'createUserTest',
        username: 'createUserTest',
        dob: new Date('January 1, 2000'),
        first_name: 'creatUser',
        last_name: 'test',
        password: 'password'
    });
    expect(response.text).toBe('Not a valid email');
    expect(response.statusCode).toBe(422);
});

test('All fields are given. Username formatted incorrectly', async () => {
    const response = await request(app).post("/users").send({
        email: 'createUserTest@jak.bz',
        username: 'createUserTest-1',
        dob: new Date('January 1, 2000'),
        first_name: 'creatUser',
        last_name: 'test',
        password: 'password'
    });
    expect(response.text).toBe('Not a valid username');
    expect(response.statusCode).toBe(422);
});

test('All fields are given. Age is <13 years old', async () => {
    const response = await request(app).post("/users").send({
        email: 'createUserTest@jak.bz',
        username: 'createUserTest',
        dob: new Date(),
        first_name: 'creatUser',
        last_name: 'test',
        password: 'password'
    });
    expect(response.text).toBe('Must be at least 13 years old to create an account');
    expect(response.statusCode).toBe(422);
});