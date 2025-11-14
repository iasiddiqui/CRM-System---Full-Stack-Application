const { body } = require('express-validator');

const publicEnquiryValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .custom((value) => {
      // If value is empty or just whitespace after trim, it's valid (optional field)
      if (!value || value.trim().length === 0) {
        return true;
      }
      return /^[\d\s\-\+\(\)]+$/.test(value);
    })
    .withMessage('Please provide a valid phone number'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters')
];

module.exports = { publicEnquiryValidator };

