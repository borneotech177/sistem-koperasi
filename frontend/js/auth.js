const Auth = {
  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}')
    } catch {
      return {}
    }
  },

  getToken: () => localStorage.getItem('token'),

  isLoggedIn: () => !!localStorage.getItem('token'),

  logout: () => {
    localStorage.clear()
    window.location.href = 
      '/sistem-koperasi/frontend/pages/index.html'
  },

  check: () => {
    if (!localStorage.getItem('token')) {
      window.location.href = 
        '/sistem-koperasi/frontend/pages/index.html'
    }
  },

  isTokenExpired: () => {
    const token = localStorage.getItem('token')
    if (!token) return true
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp * 1000 < Date.now()
    } catch {
      return true
    }
  },

  checkWithExpiry: () => {
    if (!localStorage.getItem('token') || 
      Auth.isTokenExpired()) {
      localStorage.clear()
      window.location.href = 
        '/sistem-koperasi/frontend/pages/index.html'
    }
  }
}
