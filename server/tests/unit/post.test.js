const request = require('supertest');
const app = require('../../src/app.js');
const { connect, disconnect } = require('../helpers/setup.js');
const { validateURL } = require('../../src/helpers/validation');

jest.mock('../../src/helpers/validation', () => ({
    validateID: jest.fn(),
    validateURL: jest.fn(),
}));

// Test values
const testBody = { full: 'https://www.example.com/long-url' };
const testUser = 'user1@email.com';

describe('/POST', () => {
    beforeAll(async () => {
        await connect();
    });

    afterAll(async () => {
        await disconnect();
    });

    describe('/POST anon submissions', () => {
        test('add a new url, should return the ShortUrl object', async () => {
            validateURL.mockResolvedValue(true);

            const res = await request(app)
                .post('/v1/urls')
                .send(testBody)
                .set('Accept', 'application/json');

            expect(res.status).toBe(201);
        });

        describe('/POST invalid requests', () => {
            // Mock resolved is not needed
            test('return 422 if full url is empty', async () => {
                const res = await request(app)
                    .post(`/v1/urls`)
                    .send({ full: '' })
                    .set('Accept', 'application/json');

                expect(res.status).toBe(422);
            });
        });

        test('return 422 if the URL cannot be reached', async () => {
            validateURL.mockResolvedValue(false);

            const res = await request(app)
                .post(`/v1/urls`)
                .send(testBody)
                .set('Accept', 'application/json');

            expect(res.status).toBe(422);
        });
    });

    describe('/POST user submissions', () => {
        const testBodyAuth = { ...testBody, user: testUser };
        test('user should be populated if the user is logged in', async () => {
            validateURL.mockResolvedValue(true);

            const res = await request(app)
                .post(`/v1/urls`)
                .set('Accept', 'application/json')
                .send(testBodyAuth);

            expect(res.status).toBe(201);
            expect(res.body.user).toBe(testUser);
        });
    });
});
