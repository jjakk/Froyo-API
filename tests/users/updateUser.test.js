test('Todo', () => {
    expect(true).toBe(true);
});
/*const request = require('supertest');
const app = require('../../app');

const updateUserForm = {
    email: 'createUserTest@jak.bz',
    username: 'createUserTest',
    dob: new Date('January 1, 2000'),
    first_name: 'creatUser',
    last_name: 'test',
    password: 'password'
};

const getAuthToken = async () => {
    const { headers: { authorization } } = await request(app).post('/auth/login').send({
        email: updateUserForm.email,
        password: updateUserForm.password
    });
    return authorization;
};

const getUserId = async () => {
    const { body: { id } } = await request(app).post('/users').send(updateUserForm);
    return id;
}

beforeEach(async () => {
    await request(app).post('/users').send(updateUserForm);
});

afterEach(async () => {
    await request(app)
        .delete('/users')
        .set('Authorization', await getAuthToken());
})

test('Not signed in', async () => {
    const response = await request(app).put('/users');
    expect(response.text).toBe('You\'re not logged in');
    expect(response.statusCode).toBe(200);
});

test('Signed in. Update email', async () => {
    const newEmail = 'createUserTestUpdated@jak.bz';

    const userId = await getUserId();
    const { text: oldUser } = await request(app)
        .get(`/users/${userId}`)
        .set('Authorization', await getAuthToken());
    expect(oldUser.email).toBe(updateUserForm.email);

    const { text: updatedUser, statusCode } = await request(app)
        .update('/users')
        .send({
            ...updateUserForm,
            email: newEmail
        })
        .set('Authorization', await getAuthToken());
    expect(updatedUser.email).toBe(newEmail);
    expect(statusCode).toBe(200);
});*/