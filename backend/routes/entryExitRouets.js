const express = require('express');
const router = express.Router();
const { exit, entry } = require('../controllers/entryController');

// Record entry time
router.post('/entry', entry);

// Record exit, compute fee, and send email
router.post('/exit', exit);

module.exports = router;
