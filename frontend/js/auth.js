const Auth = {
  getUser: () => JSON.parse(localStorage.getItem('user') || '{}'),
  getToken: () => localStorage.getItem('token'),
  isLoggedIn: () => !!localStorage.getItem('token'),
  logout: () => {
    localStorage.clear()
    window.location.href = '/sistem-koperasi/frontend/pages/index.html'
  },
  check: () => {
    if (!Auth.isLoggedIn()) {
      window.location.href = '/sistem-koperasi/frontend/pages/index.html'
    }
  }
}
