const express = require('express');
const {
  createPublicEnquiry,
  getUnclaimedEnquiries,
  claimEnquiry,
  getMyEnquiries
} = require('../controllers/enquiryController');
const { publicEnquiryValidator } = require('../validators/enquiryValidator');
const { handleValidationErrors } = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Public route (unauthenticated)
router.post('/public', publicEnquiryValidator, handleValidationErrors, createPublicEnquiry);

// Protected routes (authenticated)
router.get('/unclaimed', authenticate, getUnclaimedEnquiries);
router.post('/:id/claim', authenticate, claimEnquiry);
router.get('/mine', authenticate, getMyEnquiries);

module.exports = router;

