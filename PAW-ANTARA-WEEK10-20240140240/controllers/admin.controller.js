const bcrypt = require('bcrypt');
const { Admin } = require('../models');
const sendResponse = require('../utils/response');

// catatan: sengaja gak ada endpoint public buat register admin baru.
// Admin dibikin lewat seeder aja (npm run seed), biar gak sembarang orang
// bisa daftar jadi admin dari luar. Ini juga poin materi keamanan API.

async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return sendResponse(res, {
        code: 400,
        success: false,
        message: 'username dan password wajib diisi',
      });
    }

    const admin = await Admin.findOne({ where: { username } });
    if (!admin) {
      return sendResponse(res, {
        code: 401,
        success: false,
        message: 'username atau password salah',
      });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return sendResponse(res, {
        code: 401,
        success: false,
        message: 'username atau password salah',
      });
    }

    req.session.adminId = admin.id;

    return sendResponse(res, {
      message: 'Login berhasil',
      data: { id: admin.id, username: admin.username },
    });
  } catch (err) {
    return sendResponse(res, { code: 500, success: false, message: err.message });
  }
}

function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      return sendResponse(res, { code: 500, success: false, message: 'Gagal logout' });
    }
    res.clearCookie('connect.sid');
    return sendResponse(res, { message: 'Logout berhasil' });
  });
}

module.exports = { login, logout };
