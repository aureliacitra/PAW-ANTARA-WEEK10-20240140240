const sendResponse = require('../utils/response');

function requireAdminAuth(req, res, next) {
  if (!req.session || !req.session.adminId) {
    return sendResponse(res, {
      code: 401,
      success: false,
      message: 'Belum login sebagai admin',
    });
  }
  next();
}

module.exports = requireAdminAuth;
