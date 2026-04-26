const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../supabase');

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Cari user di database
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('status', 'aktif')
      .single();

    if (error || !user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Username tidak ditemukan' 
      });
    }

    // Cek password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Password salah' 
      });
    }

    // Buat token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Simpan log login
    await supabase.from('login_log').insert({
      user_id: user.id,
      status: 'berhasil',
      ip_address: req.ip
    });

    res.json({
      success: true,
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        nama: user.nama_lengkap,
        role: user.role,
        username: user.username
      }
    });

  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: err.message 
    });
  }
});

// REGISTER (hanya admin)
router.post('/register', async (req, res) => {
  try {
    const { username, password, nama_lengkap, role, no_hp, email } = req.body;

    // Enkripsi password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const { data, error } = await supabase
      .from('users')
      .insert({ username, password_hash, nama_lengkap, role, no_hp, email })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }

    res.json({ 
      success: true, 
      message: 'User berhasil dibuat', 
      user: data 
    });

  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: err.message 
    });
  }
});

module.exports = router;
