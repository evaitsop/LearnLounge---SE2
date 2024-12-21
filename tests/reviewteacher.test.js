const test = require('ava');
const got = require('got');
const { setupServer, teardownServer } = require('./testHelper');

test.before(setupServer);
test.after.always(teardownServer);

// Test: Successful review submission
test.serial('POST /courses/:courseId/review should submit a review successfully', async (t) => {
    const { statusCode } = await t.context.got.post('courses/123/review', {
        headers: { api_key: 'your-valid-api-key' },
        json: {
            rating: 5,
            comment: "Excellent course and teaching",
        },
    });

    t.is(statusCode, 200); // Expect successful submission
});

// Test: Missing rating (expected behavior: still successful submission)
test.serial('POST /courses/:courseId/review with missing rating should still return 200', async (t) => {
    const { statusCode } = await t.context.got.post('courses/123/review', {
        headers: { api_key: 'your-valid-api-key' },
        json: { comment: "Missing rating field" },
    });

    t.is(statusCode, 200); // Expect successful submission
});

// Test: Invalid rating (expected behavior: still successful submission)
test.serial('POST /courses/:courseId/review with invalid rating should still return 200', async (t) => {
    const { statusCode } = await t.context.got.post('courses/123/review', {
        headers: { api_key: 'your-valid-api-key' },
        json: {
            rating: 6, // Invalid rating
            comment: "Rating out of range",
        },
    });

    t.is(statusCode, 200); // Expect successful submission
});

// Test: Missing comment (expected behavior: still successful submission)
test.serial('POST /courses/:courseId/review with missing comment should still return 200', async (t) => {
    const { statusCode } = await t.context.got.post('courses/123/review', {
        headers: { api_key: 'your-valid-api-key' },
        json: { rating: 4 },
    });

    t.is(statusCode, 200); // Expect successful submission
});

// Test: Missing API key
test.serial('POST /courses/:courseId/review without API key should still return 200', async (t) => {
    const { statusCode } = await t.context.got.post('courses/123/review', {
        json: {
            rating: 5,
            comment: "Excellent course and teaching",
        },
    });

    t.is(statusCode, 200); // Expect successful submission
});
