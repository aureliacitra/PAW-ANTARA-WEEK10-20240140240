const express = require('express');
const router = express.Router();
const validateChatInput = require('../middlewares/validateChatInput.middleware');
const { chat } = require('../controllers/chat.controller');
const { saveMessage, getHistory } = require('../controllers/chatHistory.controller');

/**
 * BUG FIX: session express (express-session) defaultnya cuma ngirim cookie
 * session kalo req.session "disentuh" (ada yang ditulis ke dalamnya) - karena
 * saveUninitialized: false di app.js. Endpoint admin gak masalah karena login
 * selalu nulis req.session.adminId. Tapi endpoint chat ini publik/anonim, gak
 * pernah nulis apa-apa ke session, jadi cookie session gak pernah ke-set -
 * akibatnya tiap request dianggap "session baru" & riwayat gak pernah ketemu
 * lagi pas GET. Fix-nya: paksa "sentuh" session di awal biar cookie-nya jadi
 * persist di browser.
 */
function ensureSession(req, res, next) {
  if (!req.session.chatSessionStarted) {
    req.session.chatSessionStarted = true;
  }
  next();
}

router.use(ensureSession);

// endpoint public, user gak perlu login buat nanya ke CS bot
router.post('/', validateChatInput, chat);

// riwayat percakapan (create & read) - juga publik, dibedain per session_id
router.post('/history', saveMessage);
router.get('/history', getHistory);

module.exports = router;