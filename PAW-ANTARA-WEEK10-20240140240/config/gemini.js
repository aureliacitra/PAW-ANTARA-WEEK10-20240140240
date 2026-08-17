require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  console.warn(
    "⚠️  GEMINI_API_KEY belum diset di .env, fitur chat bakal error",
  );
}

// API key HANYA dibaca dari .env di server, gak pernah nyentuh client/browser
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// model gratis & cepet, cocok buat CS bot simple
const MODEL_NAME = "gemini-3.6-flash";

module.exports = { genAI, MODEL_NAME };
