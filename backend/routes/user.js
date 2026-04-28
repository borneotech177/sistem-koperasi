const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const supabase = require('../supabase');

// GET semua user
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, nama_lengkap, role, no_hp, email, status, created_at')
      .order('nama_lengkap', { ascending: true })

    if (error) throw error
    res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET user by ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, nama_lengkap, role, no_hp, email, status, created_at')
      .eq('id', req.params.id)
      .single()

    if (error) throw error
    res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// TAMBAH user
router.post('/', async (req, res) => {
  try {
    const {
      username, password, nama_lengkap,
      role, no_hp, email
    } = req.body

    if (!username || !password || !nama_lengkap || !role) {
      return res.status(400).json({
        success: false,
        message: 'Username, password, nama, dan role wajib diisi!'
      })
    }

    // Cek username sudah ada
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single()

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Username sudah digunakan!'
      })
    }

    // Enkripsi password
    const salt = await bcrypt.genSalt(10)
    const password_hash = await bcrypt.hash(password, salt)

    const { data, error } = await supabase
      .from('users')
      .insert({
        username, password_hash,
        nama_lengkap, role,
        no_hp, email,
        status: 'aktif'
      })
      .select('id, username, nama_lengkap, role, status')
      .single()

    if (error) throw error
    res.json({
      success: true,
      message: 'User berhasil ditambahkan',
      data
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// UPDATE user
router.put('/:id', async (req, res) => {
  try {
    const { nama_lengkap, role, no_hp, email, status } = req.body

    const { data, error } = await supabase
      .from('users')
      .update({ nama_lengkap, role, no_hp, email, status })
      .eq('id', req.params.id)
      .select('id, username, nama_lengkap, role, status')
      .single()

    if (error) throw error
    res.json({
      success: true,
      message: 'User berhasil diupdate',
      data
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GANTI PASSWORD
router.patch('/:id/password', async (req, res) => {
  try {
    const { password_baru } = req.body

    if (!password_baru || password_baru.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password minimal 6 karakter!'
      })
    }

    const salt = await bcrypt.genSalt(10)
    const password_hash = await bcrypt.hash(password_baru, salt)

    const { error } = await supabase
      .from('users')
      .update({ password_hash })
      .eq('id', req.params.id)

    if (error) throw error
    res.json({
      success: true,
      message: 'Password berhasil diganti'
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// NONAKTIFKAN user
router.delete('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ status: 'nonaktif' })
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) throw error
    res.json({
      success: true,
      message: 'User dinonaktifkan',
      data
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
