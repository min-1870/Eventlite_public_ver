// Importing functions/libraries
const request = require('supertest');
const app = require('../app');
const { User, Event } = require('../database/models');

describe('Testing star_rating system', () => {
    describe('Testing /review/create', () => {
        test('Test 1: Invalid token', async () => {
            const review = await request(app).post('/review/create').set('token', "random token")
            expect(review.statusCode).toBe(400)
            const bodyObj = JSON.parse(String(review.text))
            expect(bodyObj).toStrictEqual({ error: "Cannot find token" })
        })
        test('Test 2: Event does not exist', async () => {

            const user_login = await request(app).post('/auth/login').send({
                username: "ethanLammie",
                password: "password123"
            });
            expect(user_login.statusCode).toBe(200)
            const user = await User.findOne({ where: { username: 'ethanLammie' } });
            const review = await request(app).post('/review/create').set('token', user.token).send({
                eventId: -1,
                review: "I hate this event",
                star_rating: 2
            })
            expect(review.statusCode).toBe(400)
            const bodyObj = JSON.parse(String(review.text))
            expect(bodyObj).toStrictEqual({ error: 'Event does not exist' })

            const userLogout = await request(app).post('/auth/logout').set('token', user.token)
            expect(userLogout.statusCode).toBe(200)
            expect(userLogout.text).toStrictEqual("{}")
        })
    })
})