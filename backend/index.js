const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const anggotaRoutes = require('./routes/anggota');
const transaksiRoutes = require('./routes/transaksi');

app.use('/api/auth', authRoutes);
app.use('/api/anggota', anggotaRoutes);
app.use('/api/transaksi', transaksiRoutes);

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
