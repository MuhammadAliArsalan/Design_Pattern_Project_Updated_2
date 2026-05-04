const express = require('express');
const router = express.Router();

const { sendContactMessage } = require('../controllers/contact');

// Send contact message
router.post('/contact', sendContactMessage);

module.exports = router;
