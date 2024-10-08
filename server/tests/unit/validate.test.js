const https = require('https');
const { validateID, validateURL } = require('../../src/helpers/validation');
const { createErrorResponse } = require('../../src/response');

jest.mock('https');
jest.mock('../../src/response');

describe('Validation functions', () => {
    describe('validate', () => {
        it('should return true if id is a string', () => {
            expect(validateID('test')).toBe(true);
        });

        it('should return false if id is not a string', () => {
            expect(validateID(123)).toBe(false);
            expect(validateID({})).toBe(false);
            expect(validateID([])).toBe(false);
            expect(validateID(null)).toBe(false);
            expect(validateID(undefined)).toBe(false);
        });
    });

    describe('validateURL', () => {
        it('should return true if URL returns a 200 status code', async () => {
            // Mock the https.get call to return a successful response
            https.get.mockImplementation((url, callback) => {
                const res = { statusCode: 200 };
                callback(res);
                return { on: jest.fn() }; // Mock 'on' method for error handling
            });

            const result = await validateURL('https://valid-url.com');
            expect(result).toBe(true);
        });

        it('should return false if URL returns a non-200 status code', async () => {
            https.get.mockImplementation((url, callback) => {
                const res = { statusCode: 404 };
                callback(res);
                return { on: jest.fn() };
            });

            const result = await validateURL('https://invalid-url.com');
            expect(result).toBe(false);
        });

        it('should return false if an error occurs during the request', async () => {
            const errorMessage = 'Request failed';

            // Mock the https.get call to simulate an error
            https.get.mockImplementation(() => {
                return {
                    on: (event, errorCallback) => {
                        if (event === 'error') errorCallback(new Error(errorMessage));
                    },
                };
            });

            // Mock createErrorResponse to return the error message
            createErrorResponse.mockReturnValue({ error: errorMessage });

            const result = await validateURL('https://error-url.com');
            expect(result).toBe(false);
            expect(createErrorResponse).toHaveBeenCalledWith(errorMessage);
        });
    });
});
