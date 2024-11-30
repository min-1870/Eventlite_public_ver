// Importing functions/libraries
const request = require('supertest');
const app = require('../app');

describe('Testing search/fitler function', () => {
    describe('Testing the register', () => {
        test('Test 1: cannot find results', async () => {
            const search = await request(app).get('/search?search=;alksdjfanef&tags=Music&sortTime=ASC')
            expect(search.statusCode).toBe(404);
            const bodyObj = JSON.parse(String(search.text));
            expect(bodyObj).toStrictEqual({ error: 'Cannot find search phrase' });
        });
        test('Test 2: Trying to pass search without a search parameter', async () => {
            const search = await request(app).get('/search?tags=Music&sortTime=ASC')
            expect(search.statusCode).toBe(400);
            const bodyObj = JSON.parse(String(search.text));
            expect(bodyObj).toStrictEqual({ error: 'Need search' });
        });
        test('Test 3: Trying to pass search without a tags parameter', async () => {
            const search = await request(app).get('/search?search=;alksdjfanef&sortTime=ASC')
            expect(search.statusCode).toBe(400);
            const bodyObj = JSON.parse(String(search.text));
            expect(bodyObj).toStrictEqual({ error: 'Need tag' });
        });
        test('Test 4: Cannot find searches with tags filter', async () => {
            const search = await request(app).get('/search?search=funeral&tags="Other"&sortTime=ASC')
            expect(search.statusCode).toBe(404);
            const bodyObj = JSON.parse(String(search.text));
            expect(bodyObj).toStrictEqual({ error: 'Cannot find searches with tags' });
        });
    })
});