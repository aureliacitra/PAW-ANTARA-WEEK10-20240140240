const sendResponse = require('../utils/response');

const MAX_LENGTH = 500;

/**
 * Ini contoh "defense in depth": jangan cuma andelin system prompt buat guardrail.
 * Validasi dasar di level kode juga penting sebelum request sampe ke LLM.
 */
function validateChatInput(req, res, next) {
  const { message } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return sendResponse(res, {
      code: 400,
      success: false,
      message: 'message wajib diisi',
    });
  }

  if (message.length > MAX_LENGTH) {
    return sendResponse(res, {
      code: 400,
      success: false,
      message: `Pesan terlalu panjang, maksimal ${MAX_LENGTH} karakter`,
    });
  }

  next();
}

module.exports = validateChatInput;
