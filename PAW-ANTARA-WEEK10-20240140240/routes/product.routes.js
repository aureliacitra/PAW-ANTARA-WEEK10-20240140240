const express = require('express');
const router = express.Router();
const requireAdminAuth = require('../middlewares/auth.middleware');
const {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');

// GET boleh diakses siapa aja (misal buat nampilin katalog di frontend nanti)
router.get('/', getProducts);

// nambah/edit/hapus produk wajib login admin
router.post('/', requireAdminAuth, addProduct);
router.put('/:id', requireAdminAuth, updateProduct);
router.delete('/:id', requireAdminAuth, deleteProduct);

module.exports = router;
