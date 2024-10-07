const { getLocation } = require('../../src/helpers/location');

describe('/ health check', () => {
    test('US ip address', async () => {
        const usIP = '128.101.101.101';
        const res = await getLocation(usIP);
        expect(res).toBe('US');
    });

    test('CA ip address', async () => {
        const caIP = '104.143.8.255';
        const res = await getLocation(caIP);
        expect(res).toBe('CA');
    });

    test('FR ip address', async () => {
        const caIP = '105.22.127.255';
        const res = await getLocation(caIP);
        expect(res).toBe('FR');
    });

    test('Unknown ip address', async () => {
        const fakeIP = '127.0.0.1';
        const res = await getLocation(fakeIP);
        expect(res).toBe('N/A');
    });
});
