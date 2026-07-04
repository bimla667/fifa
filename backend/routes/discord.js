const express = require('express');
const router = express.Router();
const { sendToDiscord } = require('../controllers/discordController');

router.post('/send', sendToDiscord);

module.exports = router;
