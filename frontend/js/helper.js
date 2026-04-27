const Helper = {
  // Format Rupiah
  rupiah: (n) => {
    return 'Rp ' + Math.round(n).toLocaleString('id-ID')
  },

  // Format tanggal
  tanggal: (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    })
  },

  // Format tanggal + jam
  datetime: (date) => {
    return new Date(date).toLocaleString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  },

  // Tanggal hari ini (YYYY-MM-DD)
  today: () => new Date().toISOString().split('T')[0],

  // Alert notifikasi
  toast: (msg, type = 'success') => {
    const toast = document.getElementById('toast')
    if (!toast) return
    toast.textContent = msg
    toast.className = `fixed top-4 right-4 z-50 px-4 py-3 
      rounded-xl text-sm font-medium shadow-lg transition-all ${
      type === 'success' 
        ? 'bg-green-600 text-white' 
        : type === 'error'
        ? 'bg-red-600 text-white'
        : 'bg-yellow-500 text-white'
    }`
    toast.classList.remove('hidden')
    setTimeout(() => toast.classList.add('hidden'), 3000)
  },

  // Fetch dengan token
  fetch: async (url, options = {}) => {
    const token = Auth.getToken()
    const res = await fetch(CONFIG.API + url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }
    })
    return res.json()
  },

  // Konfirmasi hapus
  confirm: (msg = 'Yakin ingin menghapus data ini?') => {
    return window.confirm(msg)
  }
}
