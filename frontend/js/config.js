const CONFIG = {
  // API
  API: 'https://sistem-koperasi-production.up.railway.app',

  // App Info
  APP_NAME: 'SisKop',
  APP_DESC: 'Sistem Manajemen Koperasi',
  VERSION: '1.0.0',
  COMPANY: 'BORNEO-TECH',
  YEAR: '2026',

  // Base URL
  BASE_URL: '/sistem-koperasi/frontend/pages',
  ASSETS_URL: '/sistem-koperasi/frontend/assets',

  // Routes
  ROUTES: {
    login:     '/sistem-koperasi/frontend/pages/index.html',
    dashboard: '/sistem-koperasi/frontend/pages/dashboard.html',
    anggota:   '/sistem-koperasi/frontend/pages/anggota.html',
    pinjaman:  '/sistem-koperasi/frontend/pages/pinjaman.html',
    toko:      '/sistem-koperasi/frontend/pages/toko.html',
    kantin:    '/sistem-koperasi/frontend/pages/kantin.html',
    rfid:      '/sistem-koperasi/frontend/pages/rfid.html',
    laporan:   '/sistem-koperasi/frontend/pages/laporan.html',
  },

  // Koperasi (bisa diganti sesuai client)
  KOPERASI: {
    nama: 'Koperasi',
    alamat: '',
    telp: '',
    email: ''
  }
}
