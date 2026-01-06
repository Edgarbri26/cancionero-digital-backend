const http = require('http');

const postData = JSON.stringify({
    name: 'Test Debug User',
    email: `testdebug${Date.now()}@example.com`,
    password: 'password123',
    phoneNumber: '+5491112345678' // Valid number
});

const options = {
    hostname: 'localhost',
    port: 3000, // Assuming default port, will check env or user info
    path: '/api/auth/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(postData);
req.end();
