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
const testShortId = 'hello123';
const testUserId = 'test-user@email.com';
const testFullUrl = 'https://example.com/long-url';
const initialClicks = 5;
const testBody = { full: 'https://example.com/long-url' };

describe('/GET', () => {
    beforeAll(async () => {
        await connect();
    });

    afterAll(async () => {
        await disconnect();
    });

    beforeEach(async () => {
        // Clean up existing data
        await ShortUrl.deleteMany({});

        // Re-seed the database with the test data
        const testShortUrl = new ShortUrl({
            full: testFullUrl,
            short: testShortId,
            clicks: initialClicks,
            user: testUserId,
            created: new Date(),
        });

        await testShortUrl.save();
    });

    test('retrieve all urls', async () => {
        const res = await request(app).get('/v1/urls');
        expect(res.status).toBe(200);
        // Urls
        expect(res.body.urls.length).toBeGreaterThan(0);

        // Metadata
        expect(res.body.page).toBeDefined();
        expect(res.body.limit).toBeDefined();
        expect(res.body.totalPages).toBeDefined();
        expect(res.body.totalDocuments).toBeDefined();
    });

    describe('/GET by id', () => {
        test('successful retrieval via short url should have status 200', async () => {
            validateID.mockResolvedValue(true);
            validateURL.mockResolvedValue(true);

            const res = await request(app).get(`/v1/urls/${testShortId}`);
            expect(res.status).toBe(200);
        });

        test('get full url via short url', async () => {
            const res = await request(app).get(`/v1/urls/${testShortId}`);
            expect(res.status).toBe(200);
            expect(res.body.shortUrl.full).toBe(testFullUrl);
        });

        test('clicks should increment when accessing via short url', async () => {
            // Get the short url -> increments click count
            const res = await request(app).get(`/v1/urls/${testShortId}`);
            expect(res.status).toBe(200);
            expect(res.body.shortUrl.clicks).toBe(initialClicks + 1); // Clicks should be incremented
        });

        test('user should be present in return object if submitted by user', async () => {
            const res = await request(app).get(`/v1/urls/${testShortId}`);
            expect(res.status).toBe(200);
            expect(res.body.shortUrl.user).toBe(String(testUserId));
        });
    });

    describe('/GET invalid requests', () => {
        test('return 404 if short url id does not exist', async () => {
            const res = await request(app).get(`/v1/urls/fakeShortUrlId`);
            expect(res.status).toBe(404);
        });
    });

    describe('/GET auth protected routes', () => {
        test('req.user should be populated', async () => {
            const res = await request(app)
                .get(`/v1/protectedRoute`)
                .auth('user1@email.com', 'password1')
                .set('Accept', 'application/json');
            expect(res.status).toBe(200);
            // presence of cookie = authenticated
            expect(res.headers['set-cookie']).toBeDefined();
        });

        test('get a user submitted link', async () => {
            // Submit link
            const postReq = await request(app)
                .post(`/v1/urls`)
                .set('Accept', 'application/json')
                .send(testBody);

            expect(postReq.status).toBe(201);
            expect(postReq.body.short).toBeDefined();

            const linkID = postReq.body.short; // get the id of the submitted link

            const res = await request(app).get(`/v1/urls/${linkID}`);
            expect(res.status).toBe(200);
        });
    });
});
