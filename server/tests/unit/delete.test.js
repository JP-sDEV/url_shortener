const request = require('supertest');
const app = require('../../src/app.js');
const ShortUrl = require('../../src/models/ShortUrl.js');
const { connect, disconnect } = require('../helpers/setup.js');
const { validateID, validateURL } = require('../../src/helpers/validation');

jest.mock('../../src/helpers/validation', () => ({
    validateID: jest.fn(),
    validateURL: jest.fn(),
}));

// Test values
const testBody = { full: 'https//www.example.com/long-url' };
let testShortId;

describe('/DELETE', () => {
    beforeAll(async () => {
        await connect();
    });

    afterAll(async () => {
        await disconnect();
    });

    describe('/DELETE anon requests', () => {
        beforeEach(async () => {
            // Clean up existing data
            await ShortUrl.deleteMany({});

            // Re-seed the database with the test data with anon submission
            validateID.mockResolvedValue(true);
            validateURL.mockResolvedValue(true);
            const testUrl = await request(app)
                .post('/v1/urls')
                .send(testBody)
                .set('Accept', 'application/json');

            testShortId = testUrl.body.short;
        });

        test('successful deletion via short url should have status 200', async () => {
            validateID.mockResolvedValue(true);
            const res = await request(app)
                .delete(`/v1/urls/${testShortId}`)
                .set('Content-Type', 'application/json');

            expect(res.status).toBe(200);
        });

        test('removed url should not longer be in the db', async () => {
            // does not require mock validate
            await request(app).delete(`/v1/urls/${testShortId}`);
            const res = await request(app).get(`/v1/urls/${testShortId}`);

            expect(res.status).toBe(404);
        });

        test('return 404 if the id does not exist', async () => {
            // does not require mock validate
            const res = await request(app).delete(`/v1/urls/fake-id`);
            expect(res.status).toBe(404);
        });
    });

    describe('/DELETE with auth', () => {
        beforeEach(async () => {
            // Clean up existing data
            await ShortUrl.deleteMany({});

            // validate.mockResolvedValue(true);

            const testUrl = await request(app)
                .post(`/v1/urls`)
                .send({ user: '1234', full: 'http://www.example.com' })
                .set('Accept', 'application/json');

            testShortId = String(testUrl.body.short);
        });

        test('return 401 if deleting a user url with no auth', async () => {
            const res = await request(app).delete(`/v1/urls/${testShortId}`);
            expect(res.status).toBe(401);
        });

        test('return 401 if deleting a user url with wrong auth', async () => {
            const res = await request(app).delete(`/v1/urls/${testShortId}`);
            expect(res.status).toBe(401);
        });

        test('return 200 if deleting a user url with matching user', async () => {
            // validate.mockResolvedValue(true);

            const res = await request(app)
                .delete(`/v1/urls/${testShortId}`)
                .send({ userId: '1234' });

            expect(res.status).toBe(200);
        });
    });
});
