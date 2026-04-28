const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// GET semua produk
router.get('/', async (req, res) => {
  try {
    const { modul, status } = req.query

    let query = supabase
      .from('produk')
      .select(`*, kategori_produk(nama_kategori)`)
      .order('nama_produk', { ascending: true })

    if (modul) query = query.eq('modul', modul)
    if (status) query = query.eq('status', status)

    const { data, error } = await query
    if (error) throw error

    res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET produk by ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('produk')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (error) throw error
    res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// TAMBAH produk
router.post('/', async (req, res) => {
  try {
    const {
      kode_produk, nama_produk, kategori_id,
      harga_beli, harga_jual, stok,
      stok_minimum, satuan, modul
    } = req.body

    if (!kode_produk || !nama_produk || !harga_jual) {
      return res.status(400).json({
        success: false,
        message: 'Kode, nama, dan harga jual wajib diisi!'
      })
    }

    const { data, error } = await supabase
      .from('produk')
      .insert({
        kode_produk, nama_produk, kategori_id,
        harga_beli, harga_jual,
        stok: stok || 0,
        stok_minimum: stok_minimum || 5,
        satuan: satuan || 'pcs',
        modul: modul || 'toko',
        status: 'aktif'
      })
      .select()
      .single()

    if (error) throw error
    res.json({ success: true, message: 'Produk berhasil ditambahkan', data })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// UPDATE produk
router.put('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('produk')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) throw error
    res.json({ success: true, message: 'Produk berhasil diupdate', data })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// UPDATE stok
router.patch('/:id/stok', async (req, res) => {
  try {
    const { jumlah, jenis, keterangan, user_id } = req.body

    // Ambil stok sekarang
    const { data: produk } = await supabase
      .from('produk')
      .select('stok')
      .eq('id', req.params.id)
      .single()

    const stokBaru = jenis === 'masuk'
      ? produk.stok + jumlah
      : produk.stok - jumlah

    if (stokBaru < 0) {
      return res.status(400).json({
        success: false,
        message: 'Stok tidak cukup!'
      })
    }

    // Update stok
    const { data, error } = await supabase
      .from('produk')
      .update({ stok: stokBaru })
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) throw error

    // Log stok
    await supabase.from('stok_log').insert({
      produk_id: req.params.id,
      jenis,
      jumlah,
      stok_sebelum: produk.stok,
      stok_sesudah: stokBaru,
      keterangan,
      user_id
    })

    res.json({ success: true, message: 'Stok berhasil diupdate', data })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// NONAKTIFKAN produk
router.delete('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('produk')
      .update({ status: 'nonaktif' })
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) throw error
    res.json({ success: true, message: 'Produk dinonaktifkan', data })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
