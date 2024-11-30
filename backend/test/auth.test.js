// Importing functions/libraries
const request = require('supertest');
const app = require('../app');
const { User } = require('../database/models');

describe('Testing auth system', () => {
    describe('Testing the register', () => {
        test('Test 1: error when username too short', async () => {
            const user = await request(app).post('/auth/register').send({
                username: 't',
                password: 'test123',
                email: 'test123@gmail.com',
                dob: '1922-06-23',
                firstName: 'test123',
                lastName: 'test123',
                gender: 'male',
                cardNumber: '4564597528984342',
                expiryDate: '2026-08-14',
                cvc: '321',
                biography: '13th commander of the survey corp'
            });
            expect(user.statusCode).toBe(400)
            const bodyObj = JSON.parse(String(user.text))
            expect(bodyObj).toStrictEqual({ error: "Username too short" });
        });

        test('Test 2: error when username already taken', async () => {
            const user = await request(app).post('/auth/register').send({
                username: 'ethanLammie',
                password: 'test123',
                email: 'test123@gmail.com',
                dob: '1922-06-23',
                firstName: 'test123',
                lastName: 'test123',
                gender: 'male',
                cardNumber: '4564597528984342',
                expiryDate: '2026-08-14',
                cvc: '321',
                biography: '13th commander of the survey corp'
            });
            expect(user.statusCode).toBe(400)
            const bodyObj = JSON.parse(String(user.text))
            expect(bodyObj).toStrictEqual({ error: "Username already used" });
        });;

        test('Test 3: error when password is too short', async () => {
            const user = await request(app).post('/auth/register').send({
                username: 'test123',
                password: 'a',
                email: 'test123@gmail.com',
                dob: '1922-06-23',
                firstName: 'test123',
                lastName: 'test123',
                gender: 'male',
                cardNumber: '4564597528984342',
                expiryDate: '2026-08-14',
                cvc: '321',
                biography: '13th commander of the survey corp'
            });
            expect(user.statusCode).toBe(400)
            const bodyObj = JSON.parse(String(user.text))
            expect(bodyObj).toStrictEqual({ error: 'Password must be longer 6 characters or longer' });
        });

        test('Test 4: error when email invalid', async () => {
            const user = await request(app).post('/auth/register').send({
                username: 'test123',
                password: 'test123',
                email: 'td',
                dob: '1922-06-23',
                firstName: 'test123',
                lastName: 'test123',
                gender: 'male',
                cardNumber: '4564597528984342',
                expiryDate: '2026-08-14',
                cvc: '321',
                biography: '13th commander of the survey corp'
            });
            expect(user.statusCode).toBe(400)
            const bodyObj = JSON.parse(String(user.text))
            expect(bodyObj).toStrictEqual({ error: 'Email invalid' });
        });

        test('Test 5: error when email in use', async () => {
            const user = await request(app).post('/auth/register').send({
                username: 'test123',
                password: 'test123',
                email: 'niceguysu3@gmail.com',
                dob: '1922-06-23',
                firstName: 'test123',
                lastName: 'test123',
                gender: 'male',
                cardNumber: '4564597528984342',
                expiryDate: '2026-08-14',
                cvc: '321',
                biography: '13th commander of the survey corp'
            });
            expect(user.statusCode).toBe(400)
            const bodyObj = JSON.parse(String(user.text))
            expect(bodyObj).toStrictEqual({ error: 'Email already used' });
        });

        test('Test 6: error when credit card is invalid', async () => {
            const user = await request(app).post('/auth/register').send({
                username: 'test123',
                password: 'test123',
                email: 'test123@gmail.com',
                dob: '1922-06-23',
                firstName: 'test123',
                lastName: 'test123',
                gender: 'male',
                cardNumber: '4564597528984343',
                expiryDate: '2026-08-14',
                cvc: '321',
                biography: '13th commander of the survey corp'
            });
            expect(user.statusCode).toBe(400)
            const bodyObj = JSON.parse(String(user.text))
            expect(bodyObj).toStrictEqual({ error: 'Credit card invalid' });
        });
    });

    describe('Testing login', () => {
        test('Test 1: error when logging in a user already logged in and testing logout', async () => {

            const user_login2 = await request(app).post('/auth/login').send({
                username: "ethanLammie",
                password: "password123"
            });
            expect(user_login2.statusCode).toBe(200)

            const user_login3 = await request(app).post('/auth/login').send({
                username: "ethanLammie",
                password: "password123"
            });
            expect(user_login3.statusCode).toBe(400)
            const bodyObj = JSON.parse(String(user_login3.text))
            expect(bodyObj).toStrictEqual({ error: "User already logged in" });

            const user = await User.findOne({ where: { username: 'ethanLammie' } });
            const userLogout = await request(app).post('/auth/logout').set('token', user.token)
            expect(userLogout.statusCode).toBe(200)
            expect(userLogout.text).toStrictEqual("{}")
        });
        test('Test 2: error when user does not exist', async () => {
            const user = await request(app).post('/auth/login').send({
                username: "random",
                password: ";lkhjhfefd"
            });
            expect(user.statusCode).toBe(401)
            const bodyObj = JSON.parse(String(user.text))
            expect(bodyObj).toStrictEqual({ error: "User does not exist" });
        });
        test('Test 3: error password is wrong', async () => {
            const user_login = await request(app).post('/auth/login').send({
                username: "ethanLammie",
                password: "passwordpassword"
            });
            expect(user_login.statusCode).toBe(400)
            const bodyObj2 = JSON.parse(String(user_login.text))
            expect(bodyObj2).toStrictEqual({ error: "Wrong username or password" });
        });
    });
});
