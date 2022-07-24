const request = require('supertest');
const app = require('../../app');

test('invalid formatted username', async () => {
    const response = await request(app).get('/auth/validateParameter/username/sdf-df').send({});
    expect(response.statusCode).toBe(400);
});

test('username already in use', async () => {
    const response = await request(app).get('/auth/validateParameter/username/jester').send({});
    expect(response.statusCode).toBe(400);
});

test('valid username', async () => {
    const response = await request(app).get('/auth/validateParameter/username/asdjfaldfjkdlsd').send({});
    expect(response.statusCode).toBe(200);
});

test('invalid formatted email', async () => {
    const response = await request(app).get('/auth/validateParameter/email/sdfsdf').send({});
    expect(response.statusCode).toBe(400);
});

test('email already in use', async () => {
    const response = await request(app).get('/auth/validateParameter/email/jester@jak.bz').send({});
    expect(response.statusCode).toBe(400);
});

test('valid username', async () => {
    const response = await request(app).get('/auth/validateParameter/email/woejfoiwjfoi@gmail.com').send({});
    expect(response.statusCode).toBe(200);
});

