const Auth = {

  // ---- GET DATA ----
  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}')
    } catch {
      return {}
    }
  },

  getToken: () => localStorage.getItem('token'),

  isLoggedIn: () => !!localStorage.getItem('token'),

  // ---- HAK AKSES PER ROLE ----
  AKSES: {
    admin:   [
      'dashboard', 'anggota', 'pinjaman', 'produk',
      'toko', 'kantin', 'rfid', 'laporan', 'users'
    ],
    petugas: [
      'dashboard', 'anggota', 'pinjaman', 'laporan'
    ],
    kasir:   [
      'dashboard', 'toko', 'kantin', 'laporan'
    ],
    member:  [
      'dashboard'
    ]
  },

  // ---- CEK LOGIN ----
  check: () => {
    if (!localStorage.getItem('token')) {
      window.location.href =
        '/sistem-koperasi/frontend/pages/index.html'
      return false
    }
    // Cek token expired
    try {
      const token = localStorage.getItem('token')
      const payload = JSON.parse(atob(token.split('.')[1]))
      if (payload.exp * 1000 < Date.now()) {
        localStorage.clear()
        window.location.href =
          '/sistem-koperasi/frontend/pages/index.html'
        return false
      }
    } catch {
      localStorage.clear()
      window.location.href =
        '/sistem-koperasi/frontend/pages/index.html'
      return false
    }
    return true
  },

  // ---- CEK ROLE ----
  checkRole: (halaman) => {
    const user = Auth.getUser()
    const role = user.role || 'member'
    const akses = Auth.AKSES[role] || ['dashboard']

    if (!akses.includes(halaman)) {
      // Tampilkan pesan lalu redirect
      const toast = document.createElement('div')
      toast.style.cssText = `
        position:fixed; top:20px; left:50%;
        transform:translateX(-50%);
        background:#991B1B; color:white;
        padding:12px 24px; border-radius:12px;
        font-size:14px; font-weight:600;
        z-index:9999; box-shadow:0 4px 20px rgba(0,0,0,0.3);
      `
      toast.innerHTML = `
        <i class="fa-solid fa-ban mr-2"></i>
        Akses ditolak! Anda tidak punya izin.`
      document.body.appendChild(toast)

      setTimeout(() => {
        window.location.href =
          '/sistem-koperasi/frontend/pages/dashboard.html'
      }, 1500)

      return false
    }
    return true
  },

  // ---- AMBIL AKSES USER ----
  getAkses: () => {
    const user = Auth.getUser()
    const role = user.role || 'member'
    return Auth.AKSES[role] || ['dashboard']
  },

  // ---- CEK APAKAH PUNYA AKSES ----
  boleh: (halaman) => {
    const akses = Auth.getAkses()
    return akses.includes(halaman)
  },

  // ---- LOGOUT ----
  logout: () => {
    localStorage.clear()
    window.location.href =
      '/sistem-koperasi/frontend/pages/index.html'
  },

  // ---- TOKEN EXPIRED ----
  isTokenExpired: () => {
    const token = localStorage.getItem('token')
    if (!token) return true
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp * 1000 < Date.now()
    } catch {
      return true
    }
  }
}
