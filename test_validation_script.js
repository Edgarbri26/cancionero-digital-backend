const { validatePhoneNumber } = require('./utils/validation');

const tests = [
    { input: '+12125551234', expected: '+12125551234', name: 'Valid US number' },
    { input: '12125551234', expected: null, name: 'Invalid (no country code)' }, // Depending on library default, might need +
    { input: 'invalid', expected: null, name: 'Garbage string' },
    { input: '', expected: null, name: 'Empty string' },
    { input: null, expected: null, name: 'Null' },
    { input: '+5491112345678', expected: '+5491112345678', name: 'Valid Argentina number' }
];

let failed = false;
tests.forEach(test => {
    const result = validatePhoneNumber(test.input);
    if (result !== test.expected) {
        console.error(`FAILED: ${test.name}. Input: ${test.input}, Expected: ${test.expected}, Got: ${result}`);
        failed = true;
    } else {
        console.log(`PASSED: ${test.name}`);
    }
});

if (failed) process.exit(1);
console.log('All tests passed');
