const express = require('express');
const router = express.Router();
const { runResearch } = require('../controllers/researchController');

router.post('/', runResearch);

module.exports = router;
