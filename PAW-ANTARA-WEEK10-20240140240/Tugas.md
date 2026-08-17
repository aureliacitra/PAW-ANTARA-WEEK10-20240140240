# PAW-ANTARA-WEEK10 — Fitur Riwayat Percakapan (Chat History)

**Nama:** Aurelia Citra Pangukir (Racit)
**NIM:** 20240140240

## Deskripsi Fitur

Menambahkan fitur penyimpanan riwayat percakapan pada halaman **Chat with AI**.
Fitur ini **aktif hanya kalau user menyetujui** (centang checkbox "Simpan riwayat
percakapan saya" di halaman `/chat`). Riwayat dibedakan per pengunjung memakai
`session_id` dari `express-session` (cookie), jadi tidak perlu login untuk pakai
fitur ini — sama seperti endpoint chat aslinya yang publik.

Struktur dasar (auth, config, middleware, admin, product) **tidak diubah**.
Yang ditambahkan/dikembangkan:
- `models/chatMessage.model.js` (model baru)
- `controllers/chatHistory.controller.js` (logic create & read)
- `routes/chat.routes.js` (ditambah 2 route baru)
- `views/chat.ejs`, `public/js/chat.js`, `public/css/style.css` (UI halaman chat)
- `app.js` (setup view engine EJS, gak ubah route API yang udah ada)

## Kontrak API

### 1. Create — simpan pesan ke riwayat

```
POST /api/chat/history
Content-Type: application/json
```

**Body:**
```json
{
  "role": "user",
  "content": "kaos polos ada warna apa aja?",
  "save_history": true
}
```

| Field          | Tipe    | Wajib | Keterangan                                             |
|----------------|---------|-------|-----------------------------------------------------------|
| `role`         | string  | ya    | `"user"` atau `"assistant"`                              |
| `content`      | string  | ya    | isi pesan                                                  |
| `save_history` | boolean | ya    | harus `true`. Kalau `false`/tidak dikirim → ditolak (403) |

**Response sukses (201):**
```json
{
  "code": 201,
  "success": true,
  "message": "Pesan berhasil disimpan ke riwayat",
  "data": {
    "id": 1,
    "session_id": "a1b2c3...",
    "role": "user",
    "content": "kaos polos ada warna apa aja?",
    "createdAt": "2026-08-17T07:00:00.000Z",
    "updatedAt": "2026-08-17T07:00:00.000Z"
  }
}
```

**Response ditolak, belum consent (403):**
```json
{
  "code": 403,
  "success": false,
  "message": "Penyimpanan riwayat belum disetujui user (save_history harus true)",
  "data": null
}
```

### 2. Read — ambil kembali riwayat percakapan

```
GET /api/chat/history
```

Mengembalikan semua pesan yang tersimpan untuk `session_id` (browser/cookie) yang
sedang request, urut dari yang paling lama.

**Response sukses (200):**
```json
{
  "code": 200,
  "success": true,
  "message": "Berhasil ambil riwayat percakapan",
  "data": [
    { "id": 1, "session_id": "a1b2c3...", "role": "user", "content": "kaos polos ada warna apa aja?", "createdAt": "..." },
    { "id": 2, "session_id": "a1b2c3...", "role": "assistant", "content": "Kaos Polos Cotton Combed kami...", "createdAt": "..." }
  ]
}
```

## Alur di UI (`/chat`)

1. User buka `/chat`, ada checkbox **"Simpan riwayat percakapan saya"** (default: ikut state terakhir, disimpan di `localStorage` browser).
2. Kalau checkbox **dicentang**:
   - Tiap kali user kirim pesan → pesan user langsung tampil di chat, lalu dikirim ke `POST /api/chat/history`.
   - Bot balas lewat `POST /api/chat` (endpoint chat yang sudah ada, tidak diubah) → balasan bot juga dikirim ke `POST /api/chat/history`.
   - Kalau halaman di-refresh/dibuka lagi, riwayat otomatis dimuat lewat `GET /api/chat/history`.
3. Kalau checkbox **tidak dicentang**: chat tetap jalan seperti biasa (tanya-jawab ke bot), tapi tidak ada yang disimpan ke database.

## Tampilan

Preview halaman Chat with AI (contoh isi percakapan untuk demo tampilan):

![Preview halaman Chat with AI](./chat-preview.png)

> **Catatan:** gambar di atas adalah preview tampilan UI-nya. Sebelum di-submit,
> ganti/tambahkan screenshot hasil run project ini beneran di laptop kamu
> (`npm run dev`, buka `http://localhost:3000/chat`, coba kirim pesan & centang
> "simpan riwayat", lalu refresh buat buktiin riwayatnya kesimpen) — taruh
> screenshot itu di folder `docs/` dan update link gambar di atas.

## Cara testing manual (Postman/Thunder Client)

1. `POST http://localhost:3000/api/chat` dengan body `{ "message": "ada kaos apa aja?" }` → dapat balasan bot.
2. `POST http://localhost:3000/api/chat/history` dengan body `{ "role": "user", "content": "ada kaos apa aja?", "save_history": true }` → tersimpan (code 201).
3. `GET http://localhost:3000/api/chat/history` → riwayat yang barusan disimpan muncul.
4. **Penting:** pakai cookie session yang sama antar-request (di Postman aktifkan cookie jar), karena riwayat dibedakan per `session_id`.
