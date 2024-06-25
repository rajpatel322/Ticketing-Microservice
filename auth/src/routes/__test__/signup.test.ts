import request from 'supertest';
import { app } from '../../app';
import { param } from 'express-validator';


it('returns a 201 on sucessful signup', async() => {
    return request(app).post('/api/users/signup').send({
        email: 'test@test.com',
        password: 'password'
    }).expect(201);
});

it('returns a 400 with an invalid email', async ()=> {
    return request(app).post('/api/users/signup').send({
        email: 'test.com',
        password: 'password'
    }).expect(400);
});

it('returns a 400 with an invalid password', async ()=> {
    return request(app).post('/api/users/signup').send({
        email: 'test@test.com',
        password: 'pd'
    }).expect(400);
});

it('returns a 400 with an invalid eemail and password', async ()=> {

    await request(app).post('/api/users/signup').send({
        email: '',
        password: 'pdasd'
    }).expect(400);
    await request(app).post('/api/users/signup').send({
        email: 'rajkpatel10@gmail.com',
        password: ''
    }).expect(400);

});

it('disallows duplicates emails', async () => {
    await request(app).post('/api/users/signup').send({
        email: 'test@test.com',
        password: "password"
    }).expect(201);

    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        }).expect(400);
});

it('sets a cookie after successful signup', async () => {
    const response = await request(app).post('/api/users/signup').send({
        email: 'test@test.com',
        password: "password"
    }).expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
});