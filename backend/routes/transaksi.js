const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// GET semua transaksi
router.get('/', async (req, res) => {
  try {
    const { modul, limit = 50 } = req.query;

    let query = supabase
      .from('transaksi_penjualan')
      .select(`
        *,
        detail_transaksi(*),
        users!kasir_id(nama_lengkap)
      `)
      .order('tanggal', { ascending: false })
      .limit(limit);

    if (modul) query = query.eq('modul', modul);

    const { data, error } = await query;
    if (error) throw error;

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

// GET transaksi by ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('transaksi_penjualan')
      .select(`
        *,
        detail_transaksi(
          *,
          produk(nama_produk, satuan)
        ),
        users!kasir_id(nama_lengkap),
        anggota!member_id(nama, no_anggota)
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

// BUAT transaksi baru
router.post('/', async (req, res) => {
  try {
    const {
      kasir_id, member_id, items,
      metode_bayar, modul, diskon = 0
    } = req.body;

    // Hitung total
    let total_harga = 0;
    for (const item of items) {
      total_harga += item.harga_satuan * item.jumlah;
    }
    const total_bayar = total_harga - diskon;

    // Buat nomor transaksi
    const now = new Date();
    const no_transaksi = `TRX-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${Date.now()}`;

    // Simpan transaksi
    const { data: trx, error: trxError } = await supabase
      .from('transaksi_penjualan')
      .insert({
        no_transaksi, kasir_id, member_id,
        total_harga, diskon, total_bayar,
        metode_bayar, modul
      })
      .select()
      .single();

    if (trxError) throw trxError;

    // Simpan detail transaksi
    const details = items.map(item => ({
      transaksi_id: trx.id,
      produk_id: item.produk_id,
      jumlah: item.jumlah,
      harga_satuan: item.harga_satuan,
      subtotal: item.harga_satuan * item.jumlah
    }));

    const { error: detailError } = await supabase
      .from('detail_transaksi')
      .insert(details);

    if (detailError) throw detailError;

    // Update stok produk
    for (const item of items) {
      const { data: produk } = await supabase
        .from('produk')
        .select('stok')
        .eq('id', item.produk_id)
        .single();

      await supabase
        .from('produk')
        .update({ stok: produk.stok - item.jumlah })
        .eq('id', item.produk_id);

      // Log stok
      await supabase.from('stok_log').insert({
        produk_id: item.produk_id,
        jenis: 'keluar',
        jumlah: item.jumlah,
        stok_sebelum: produk.stok,
        stok_sesudah: produk.stok - item.jumlah,
        keterangan: `Transaksi ${no_transaksi}`,
        user_id: kasir_id
      });
    }

    res.json({ 
      success: true, 
      message: 'Transaksi berhasil', 
      data: trx 
    });

  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

// BATAL transaksi
router.put('/:id/batal', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('transaksi_penjualan')
      .update({ status: 'batal' })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ 
      success: true, 
      message: 'Transaksi dibatalkan', 
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
