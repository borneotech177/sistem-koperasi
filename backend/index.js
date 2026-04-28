const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'https://borneotech177.github.io',
    'http://localhost:3000',
    'http://127.0.0.1:5500'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const anggotaRoutes = require('./routes/anggota');
const transaksiRoutes = require('./routes/transaksi');
const produkRoutes = require('./routes/produk');

app.use('/api/auth', authRoutes);
app.use('/api/anggota', anggotaRoutes);
app.use('/api/transaksi', transaksiRoutes);
app.use('/api/produk', produkRoutes);

// Test endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'API Sistem Koperasi berjalan!',
    version: '1.0.0'
  });
});

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
