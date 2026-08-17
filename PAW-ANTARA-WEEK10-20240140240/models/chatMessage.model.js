const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Nyimpen riwayat percakapan chat with AI.
 * Gak pake relasi ke Admin/User karena endpoint chat-nya publik (gak wajib login) -
 * jadi identitas "pemilik" riwayat dipakein session_id (dari express-session,
 * otomatis kebentuk per browser walau user gak login).
 */
const ChatMessage = sequelize.define(
  'ChatMessage',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    session_id: {
      type: DataTypes.STRING,
      allowNull: false, // diisi dari req.sessionID, bukan input user
    },
    role: {
      type: DataTypes.ENUM('user', 'assistant'),
      allowNull: false, // siapa yang ngomong: user atau bot
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: 'chat_messages',
    timestamps: true,
  }
);

module.exports = ChatMessage;
