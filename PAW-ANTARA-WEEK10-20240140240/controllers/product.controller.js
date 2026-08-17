const { Product } = require('../models');
const sendResponse = require('../utils/response');

async function getProducts(req, res) {
  try {
    const products = await Product.findAll({ order: [['createdAt', 'DESC']] });
    return sendResponse(res, { message: 'Berhasil ambil produk', data: products });
  } catch (err) {
    return sendResponse(res, { code: 500, success: false, message: err.message });
  }
}

async function addProduct(req, res) {
  try {
    const { name, description, price, stock } = req.body;

    if (!name || price === undefined) {
      return sendResponse(res, {
        code: 400,
        success: false,
        message: 'name dan price wajib diisi',
      });
    }

    const product = await Product.create({ name, description, price, stock: stock || 0 });

    return sendResponse(res, { code: 201, message: 'Produk berhasil ditambahkan', data: product });
  } catch (err) {
    return sendResponse(res, { code: 500, success: false, message: err.message });
  }
}

async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return sendResponse(res, { code: 404, success: false, message: 'Produk tidak ditemukan' });
    }

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;
    await product.save();

    return sendResponse(res, { message: 'Produk berhasil diupdate', data: product });
  } catch (err) {
    return sendResponse(res, { code: 500, success: false, message: err.message });
  }
}

async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return sendResponse(res, { code: 404, success: false, message: 'Produk tidak ditemukan' });
    }

    await product.destroy();

    return sendResponse(res, { message: 'Produk berhasil dihapus' });
  } catch (err) {
    return sendResponse(res, { code: 500, success: false, message: err.message });
  }
}

module.exports = { getProducts, addProduct, updateProduct, deleteProduct };
