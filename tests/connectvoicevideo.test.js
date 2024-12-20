const http = require('http');
const test = require('ava');
const got = require('got');
const app = require('../index.js');

test.before(async (t) => {
    t.context.server = http.createServer(app);
    const server = t.context.server.listen();
    const { port } = server.address();
    t.context.got = got.extend({ responseType: "json", prefixUrl: `http://localhost:${port}` });
});

test.after.always((t) => {
    t.context.server.close();
});

// Test: Successfully connect to a course's voice and video channels
test.serial('POST /courses/:courseId/connect - Successfully connect to a course\'s voice and video channels', async (t) => {
    const { statusCode } = await t.context.got.post('courses/13/connect', {
        headers: {
            api_key: 'api_key', // Replace with your valid API key
        },
    });

    // Assertions
    t.is(statusCode, 200); // Expecting a 200 OK response
});

// Test: Invalid request body should return 400
test.serial('POST /courses/:courseId/connect should return 400 for invalid request body', async (t) => {
    const error = await t.throwsAsync(() =>
        t.context.got.post('courses/13/connect', {
            headers: { api_key: 'api_key' },
            json: null, // Explicitly sending invalid payload
        })
    );

    // Assertions
    t.is(error.response.statusCode, 400); // Expecting a 400 Bad Request
    t.regex(error.response.body.message, /Unexpected token n in JSON at position 0/); // Error message indicating invalid JSON
});
