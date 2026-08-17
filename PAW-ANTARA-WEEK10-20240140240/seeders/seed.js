require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, Admin, Product } = require('../models');

const SALT_ROUNDS = 10;

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Koneksi database berhasil');

    await sequelize.sync();

    const hashedPassword = await bcrypt.hash('admin123', SALT_ROUNDS);

    const [admin] = await Admin.findOrCreate({
      where: { username: 'admin' },
      defaults: { password: hashedPassword },
    });
    console.log('Admin siap:', admin.username);

    const existingProducts = await Product.count();
    if (existingProducts === 0) {
      await Product.bulkCreate([
        {
          name: 'Kaos Polos Cotton Combed',
          description: 'Kaos polos bahan cotton combed 30s, adem, cocok buat sehari-hari',
          price: 75000,
          stock: 50,
        },
        {
          name: 'Kemeja Flanel Kotak-kotak',
          description: 'Kemeja flanel lengan panjang, motif kotak-kotak, bahan tebal',
          price: 150000,
          stock: 20,
        },
        {
          name: 'Celana Chino Slim Fit',
          description: 'Celana chino warna khaki, potongan slim fit, bahan stretch nyaman dipake',
          price: 180000,
          stock: 15,
        },
        {
          name: 'Sepatu Sneakers Canvas',
          description: 'Sepatu sneakers bahan canvas, cocok buat kasual, tersedia banyak ukuran',
          price: 220000,
          stock: 30,
        },
      ]);
      console.log('Produk dummy berhasil ditambahin');
    } else {
      console.log('Produk udah ada, skip supaya gak dobel');
    }

    console.log('\nSeeding selesai ✅');
    console.log('Login admin pake:');
    console.log('  username: admin  | password: admin123');

    process.exit(0);
  } catch (err) {
    console.error('Gagal seeding:', err.message);
    process.exit(1);
  }
}

seed();
