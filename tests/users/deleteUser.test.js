test('Todo', () => {
    expect(true).toBe(true);
});
/*const request = require('supertest');
const { testUser } = require('../testConstants');
const app = require('../../app');

const createUserForm = {
    email: 'createUserTest@jak.bz',
    username: 'createUserTest',
    dob: new Date('January 1, 2000'),
    first_name: 'creatUser',
    last_name: 'test',
    password: 'password'
};

const getAuthToken = () => {
    const { headers: { authorization } } = await request(app).post('/auth/login').send({
        email: createUserForm.email,
        password: createUserForm.password
    });
    return authorization;
};

beforeEach(async () => {
    const { headers: { authorization } } = await request(app).post('/users').send(createUserForm);
});

test('Not signed in', async () => {
    const res = await request(app).delete('/users').set('Authorization', getAuthToken());
    expect(response.text).toBe('Must provide an email');
    expect(response.statusCode).toBe(422);
});

test('Missing email', async () => {
    const res = await request(app).delete('/users').set('Authorization', getAuthToken());
    expect(response.text).toBe('Must provide an email');
    expect(response.statusCode).toBe(422);
});*/