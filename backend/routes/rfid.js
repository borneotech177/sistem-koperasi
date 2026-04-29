const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// GET semua kartu
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('rfid_kartu')
      .select(`
        *,
        anggota(nama, no_anggota)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    const formatted = data.map(k => ({
      ...k,
      nama_anggota: k.anggota?.nama,
      no_anggota: k.anggota?.no_anggota
    }))

    res.json({ success: true, data: formatted })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// SCAN kartu by no_kartu
router.get('/scan/:no_kartu', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('rfid_kartu')
      .select(`*, anggota(nama, no_anggota, no_hp)`)
      .eq('no_kartu', req.params.no_kartu)
      .eq('status', 'aktif')
      .single()

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: 'Kartu tidak ditemukan atau tidak aktif!'
      })
    }

    res.json({
      success: true,
      data: {
        ...data,
        nama_anggota: data.anggota?.nama,
        no_anggota: data.anggota?.no_anggota
      }
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// TERBITKAN kartu baru
router.post('/', async (req, res) => {
  try {
    const {
      anggota_id, no_kartu,
      tanggal_terbit, tanggal_expired, saldo
    } = req.body

    if (!anggota_id || !no_kartu) {
      return res.status(400).json({
        success: false,
        message: 'Anggota dan no. kartu wajib diisi!'
      })
    }

    // Cek kartu sudah ada
    const { data: existing } = await supabase
      .from('rfid_kartu')
      .select('id')
      .eq('no_kartu', no_kartu)
      .single()

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'No. kartu sudah digunakan!'
      })
    }

    const { data, error } = await supabase
      .from('rfid_kartu')
      .insert({
        anggota_id, no_kartu,
        tanggal_terbit, tanggal_expired,
        saldo: saldo || 0,
        status: 'aktif'
      })
      .select()
      .single()

    if (error) throw error
    res.json({
      success: true,
      message: 'Kartu berhasil diterbitkan',
      data
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// TOP UP saldo
router.post('/:id/topup', async (req, res) => {
  try {
    const { jumlah, metode, petugas_id } = req.body

    if (!jumlah || jumlah <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Jumlah top up tidak valid!'
      })
    }

    // Ambil saldo sekarang
    const { data: kartu } = await supabase
      .from('rfid_kartu')
      .select('saldo')
      .eq('id', req.params.id)
      .single()

    const saldoBaru = parseFloat(kartu.saldo) + parseFloat(jumlah)

    // Update saldo
    const { data, error } = await supabase
      .from('rfid_kartu')
      .update({ saldo: saldoBaru })
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) throw error

    // Log topup
    await supabase.from('rfid_topup').insert({
      kartu_id: req.params.id,
      jumlah,
      saldo_sebelum: kartu.saldo,
      saldo_sesudah: saldoBaru,
      metode: metode || 'tunai',
      petugas_id
    })

    res.json({
      success: true,
      message: `Top up ${jumlah} berhasil`,
      data
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// BLOKIR kartu
router.patch('/:id/blokir', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('rfid_kartu')
      .update({ status: 'blokir' })
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) throw error
    res.json({ success: true, message: 'Kartu diblokir', data })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
