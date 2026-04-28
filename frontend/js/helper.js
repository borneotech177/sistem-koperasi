const Helper = {
  rupiah: (n) => {
    if (!n && n !== 0) return 'Rp 0'
    return 'Rp ' + Math.round(n).toLocaleString('id-ID')
  },

  tanggal: (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    })
  },

  datetime: (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  },

  today: () => new Date().toISOString().split('T')[0],

  toast: (msg, type = 'success') => {
    let toast = document.getElementById('toast')
    if (!toast) {
      toast = document.createElement('div')
      toast.id = 'toast'
      document.body.appendChild(toast)
    }

    const icons = {
      success: 'fa-circle-check',
      error: 'fa-circle-xmark',
      warning: 'fa-triangle-exclamation',
      info: 'fa-circle-info'
    }

    const colors = {
      success: 'background:#166534;color:white',
      error: 'background:#991B1B;color:white',
      warning: 'background:#92400E;color:white',
      info: 'background:#1D4ED8;color:white'
    }

    toast.style.cssText = colors[type] || colors.info
    toast.innerHTML = `
      <i class="fa-solid ${icons[type] || icons.info}"></i>
      ${msg}`
    toast.classList.remove('hidden')

    clearTimeout(toast._timeout)
    toast._timeout = setTimeout(() => {
      toast.classList.add('hidden')
    }, 3000)
  },

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

  confirm: (msg = 'Yakin ingin melakukan aksi ini?') => {
    return window.confirm(msg)
  },

  loading: (el, show = true) => {
    if (!el) return
    if (show) {
      el.dataset.original = el.innerHTML
      el.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>'
      el.disabled = true
    } else {
      el.innerHTML = el.dataset.original || el.innerHTML
      el.disabled = false
    }
  }
}
