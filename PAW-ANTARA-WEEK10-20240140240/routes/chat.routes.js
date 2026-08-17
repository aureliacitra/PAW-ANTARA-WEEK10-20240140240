const express = require('express');
const router = express.Router();
const validateChatInput = require('../middlewares/validateChatInput.middleware');
const { chat } = require('../controllers/chat.controller');
const { saveMessage, getHistory } = require('../controllers/chatHistory.controller');

// endpoint public, user gak perlu login buat nanya ke CS bot
router.post('/', validateChatInput, chat);

// riwayat percakapan (create & read) - juga publik, dibedain per session_id
router.post('/history', saveMessage);
router.get('/history', getHistory);

module.exports = router;
