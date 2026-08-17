const { askGemini } = require('../services/gemini.service');
const sendResponse = require('../utils/response');

async function chat(req, res) {
  try {
    const { message } = req.body;

    const reply = await askGemini(message);

    return sendResponse(res, {
      message: 'Berhasil dapat balasan',
      data: { reply },
    });
  } catch (err) {
    console.error('Gemini error:', err.message);
    return sendResponse(res, {
      code: 500,
      success: false,
      message: 'Gagal menghubungi AI, coba lagi nanti',
    });
  }
}

module.exports = { chat };
