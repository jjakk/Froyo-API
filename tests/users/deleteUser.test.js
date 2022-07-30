const request = require('supertest');
const app = require('../../app');

const deleteUserForm = {
    email: 'createUserTest@jak.bz',
    username: 'createUserTest',
    dob: new Date('January 1, 2000'),
    first_name: 'creatUser',
    last_name: 'test',
    password: 'password'
};

const getAuthToken = async () => {
    const { headers: { authorization } } = await request(app).post('/auth/login').send({
        email: deleteUserForm.email,
        password: deleteUserForm.password
    });
    return authorization;
};

beforeEach(async () => {
    await request(app).post('/users').send(deleteUserForm);
});

test('Not signed in', async () => {
    const response = await request(app).delete('/users');
    expect(response.text).toBe('You\'re not logged in');
    expect(response.statusCode).toBe(200);
});

test('Valid deletion', async () => {
    const response = await request(app).delete('/users').set('Authorization', await getAuthToken());
    expect(response.text).toBe('User deleted');
    expect(response.statusCode).toBe(200);
});