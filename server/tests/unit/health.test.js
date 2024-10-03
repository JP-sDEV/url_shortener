const request = require('supertest');
const app = require('../../src/app.js');

describe('/ health check', () => {
    test('should return HTTP 200 response', async () => {
        const res = await request(app).get('/');
        expect(res.status).toBe(200);
    });
});
