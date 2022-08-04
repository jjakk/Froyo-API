const request = require('supertest');
const { testUsers } = require('../testConstants');
const app = require('../../app');

const createUserForm = {
    email: 'createUserTest@jak.bz',
    username: 'createUserTest',
    dob: new Date('January 1, 2000'),
    first_name: 'creatUser',
    last_name: 'test',
    password: 'password'
};

afterEach(async () => {
    const { headers: { authorization } } = await request(app).post('/auth/login').send({
        email: createUserForm.email,
        password: createUserForm.password
    });
    if(authorization){
        await request(app).delete('/users').set('Authorization', authorization);
    }
});

test('Missing email', async () => {
    const response = await request(app).post("/users").send({
        username: createUserForm.username,
        dob: createUserForm.dob,
        first_name: createUserForm.first_name,
        last_name: createUserForm.last_name,
        password: createUserForm.password
    });
    expect(response.text).toBe('Must provide an email');
    expect(response.statusCode).toBe(422);
});

test('Missing username', async () => {
    const response = await request(app).post("/users").send({
        email: createUserForm.email,
        dob: createUserForm.dob,
        first_name: createUserForm.first_name,
        last_name: createUserForm.last_name,
        password: createUserForm.password
    });
    expect(response.text).toBe('Must provide a username');
    expect(response.statusCode).toBe(422);
});

test('Missing dob', async () => {
    const response = await request(app).post("/users").send({
        email: createUserForm.email,
        username: createUserForm.username,
        first_name: createUserForm.first_name,
        last_name: createUserForm.last_name,
        password: createUserForm.password
    });
    expect(response.text).toBe('Must provide a date of birth');
    expect(response.statusCode).toBe(422);
});

test('Missing first_name', async () => {
    const response = await request(app).post("/users").send({
        email: createUserForm.email,
        username: createUserForm.username,
        dob: createUserForm.dob,
        last_name: createUserForm.last_name,
        password: createUserForm.password
    });
    expect(response.text).toBe('Must provide a first name');
    expect(response.statusCode).toBe(422);
});


test('Missing last_name', async () => {
    const response = await request(app).post("/users").send({
        email: createUserForm.email,
        username: createUserForm.username,
        dob: createUserForm.dob,
        first_name: createUserForm.first_name,
        password: createUserForm.password
    });
    expect(response.text).toBe('Must provide a last name');
    expect(response.statusCode).toBe(422);
});

test('Missing password', async () => {
    const response = await request(app).post("/users").send({
        email: createUserForm.email,
        username: createUserForm.username,
        dob: createUserForm.dob,
        first_name: createUserForm.first_name,
        last_name: createUserForm.last_name
    });
    expect(response.text).toBe('Must provide a password');
    expect(response.statusCode).toBe(422);
});

test('All fields are given. Email formatted incorrectly', async () => {
    const response = await request(app).post("/users").send({
        email: 'createUserTest',
        username: createUserForm.username,
        dob: createUserForm.dob,
        first_name: createUserForm.first_name,
        last_name: createUserForm.last_name,
        password: createUserForm.password
    });
    expect(response.text).toBe('Not a valid email');
    expect(response.statusCode).toBe(422);
});

test('All fields are given. Username formatted incorrectly', async () => {
    const response = await request(app).post("/users").send({
        email: createUserForm.email,
        username: 'createUserTest-1',
        dob: createUserForm.dob,
        first_name: createUserForm.first_name,
        last_name: createUserForm.last_name,
        password: createUserForm.password
    });
    expect(response.text).toBe('Not a valid username');
    expect(response.statusCode).toBe(422);
});

test('All fields are given. Age is <13 years old', async () => {
    const response = await request(app).post("/users").send({
        email: createUserForm.email,
        username: createUserForm.username,
        dob: new Date(),
        first_name: createUserForm.first_name,
        last_name: createUserForm.last_name,
        password: createUserForm.password
    });
    expect(response.text).toBe('Must be at least 13 years old to create an account');
    expect(response.statusCode).toBe(422);
});

test('All fields are given. Email is already in use', async () => {
    const response = await request(app).post("/users").send({
        email: testUsers[0].email,
        username: createUserForm.username,
        dob: createUserForm.dob,
        first_name: createUserForm.first_name,
        last_name: createUserForm.last_name,
        password: createUserForm.password
    });
    expect(response.text).toBe('Email already in use');
    expect(response.statusCode).toBe(422);
});

test('All fields are given. Username is already in use', async () => {
    const response = await request(app).post("/users").send({
        email: createUserForm.email,
        username: testUsers[0].username,
        dob: createUserForm.dob,
        first_name: createUserForm.first_name,
        last_name: createUserForm.last_name,
        password: createUserForm.password
    });
    expect(response.text).toBe('Username already in use');
    expect(response.statusCode).toBe(422);
});