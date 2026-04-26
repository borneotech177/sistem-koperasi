const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// GET semua anggota
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('anggota')
      .select('*')
      .order('nama', { ascending: true });

    if (error) throw error;

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

// GET anggota by ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('anggota')
      .select(`
        *,
        saldo_simpanan(*),
        pinjaman(*)
      `)
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

// TAMBAH anggota baru
router.post('/', async (req, res) => {
  try {
    const {
      no_anggota, nik, nama, alamat,
      no_hp, jenis_kelamin, tanggal_lahir,
      pekerjaan, tanggal_daftar
    } = req.body;

    const { data, error } = await supabase
      .from('anggota')
      .insert({
        no_anggota, nik, nama, alamat,
        no_hp, jenis_kelamin, tanggal_lahir,
        pekerjaan, tanggal_daftar
      })
      .select()
      .single();

    if (error) throw error;

    // Buat saldo awal otomatis
    await supabase.from('saldo_simpanan').insert({
      anggota_id: data.id
    });

    res.json({ 
      success: true, 
      message: 'Anggota berhasil ditambahkan', 
      data 
    });

  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

// UPDATE anggota
router.put('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('anggota')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ 
      success: true, 
      message: 'Anggota berhasil diupdate', 
      data 
    });

  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

// NONAKTIFKAN anggota
router.delete('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('anggota')
      .update({ status: 'nonaktif' })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ 
      success: true, 
      message: 'Anggota dinonaktifkan', 
      data 
    });

  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

module.exports = router;
