const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/chat');
});

router.get('/chat', (req, res) => {
  res.render('chat', { title: 'Chat with AI' });
});

module.exports = router;
