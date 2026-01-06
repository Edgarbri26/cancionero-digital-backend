const { parsePhoneNumber } = require('libphonenumber-js');

/**
 * Validates a phone number.
 * Expects the phone number to be in international format (e.g., +1234567890) or a format that can be parsed.
 * Returns the formatted number (E.164) if valid, or null if invalid.
 * @param {string} phoneNumber 
 * @returns {string|null}
 */
const validatePhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return null;
    try {
        const phoneNumberParsed = parsePhoneNumber(phoneNumber);
        if (phoneNumberParsed && phoneNumberParsed.isValid()) {
            return phoneNumberParsed.number;
        }
        return null;
    } catch (error) {
        return null;
    }
};

module.exports = { validatePhoneNumber };
