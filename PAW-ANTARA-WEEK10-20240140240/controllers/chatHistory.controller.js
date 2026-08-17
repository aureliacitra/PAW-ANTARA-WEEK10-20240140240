const { ChatMessage } = require('../models');
const sendResponse = require('../utils/response');

/**
 * CREATE - simpan satu pesan ke riwayat percakapan.
 * Sengaja "dikunci" pake flag save_history di body: kalo false/gak dikirim,
 * endpoint ini nolak nyimpen. Jadi penyimpanan riwayat cuma aktif kalau
 * user beneran udah nyetujuin (checkbox "simpan riwayat" di halaman chat).
 */
async function saveMessage(req, res) {
  try {
    const { role, content, save_history } = req.body;

    if (!save_history) {
      return sendResponse(res, {
        code: 403,
        success: false,
        message: 'Penyimpanan riwayat belum disetujui user (save_history harus true)',
      });
    }

    if (!role || !['user', 'assistant'].includes(role)) {
      return sendResponse(res, {
        code: 400,
        success: false,
        message: "role wajib diisi, salah satu dari: 'user' atau 'assistant'",
      });
    }

    if (!content || typeof content !== 'string' || !content.trim()) {
      return sendResponse(res, {
        code: 400,
        success: false,
        message: 'content wajib diisi',
      });
    }

    // session_id diambil dari session express (otomatis ada walau user gak login)
    const chatMessage = await ChatMessage.create({
      session_id: req.sessionID,
      role,
      content,
    });

    return sendResponse(res, {
      code: 201,
      message: 'Pesan berhasil disimpan ke riwayat',
      data: chatMessage,
    });
  } catch (err) {
    return sendResponse(res, { code: 500, success: false, message: err.message });
  }
}

/**
 * READ - ambil kembali riwayat percakapan milik session yang lagi request.
 * Cuma nampilin riwayat punya session ini sendiri (session_id dari cookie),
 * gak bisa liat riwayat session/orang lain.
 */
async function getHistory(req, res) {
  try {
    const history = await ChatMessage.findAll({
      where: { session_id: req.sessionID },
      order: [['createdAt', 'ASC']],
    });

    return sendResponse(res, {
      message: 'Berhasil ambil riwayat percakapan',
      data: history,
    });
  } catch (err) {
    return sendResponse(res, { code: 500, success: false, message: err.message });
  }
}

module.exports = { saveMessage, getHistory };
