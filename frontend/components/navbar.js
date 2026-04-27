function renderNavbar(title = 'Dashboard', activePage = 'dashboard') {
  const user = Auth.getUser()
  const bottomLinks = [
    { id: 'dashboard', label: 'Home', icon: 'fa-house', href: 'dashboard.html' },
    { id: 'anggota', label: 'Anggota', icon: 'fa-users', href: 'anggota.html' },
    { id: 'toko', label: 'Toko', icon: 'fa-cart-shopping', href: 'toko.html' },
    { id: 'laporan', label: 'Laporan', icon: 'fa-chart-bar', href: 'laporan.html' },
    { id: 'more', label: 'Menu', icon: 'fa-grip', href: 'dashboard.html' },
  ]

  return `
    <!-- Topbar -->
    <header class="bg-white border-b border-gray-200 px-4 lg:px-8 
      py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div class="flex items-center gap-3">
        <img src="assets/logo.png" alt="SisKop"
          class="w-9 h-9 object-contain lg:hidden"/>
        <div>
          <h1 class="text-gray-800 font-bold text-lg leading-tight">
            ${title}</h1>
          <p id="topWaktu" class="text-gray-400 text-xs"></p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <div class="text-right hidden sm:block">
          <div class="text-gray-700 text-sm font-semibold">
            ${user.nama || '-'}</div>
          <div class="text-gray-400 text-xs">
            ${(user.role || '').toUpperCase()}</div>
        </div>
        <div class="bg-green-100 rounded-full w-9 h-9 flex 
          items-center justify-center">
          <i class="fa-solid fa-user text-green-700 text-sm"></i>
        </div>
        <button onclick="Auth.logout()"
          class="lg:hidden bg-red-50 hover:bg-red-100 text-red-500 
          w-9 h-9 rounded-xl flex items-center justify-center transition">
          <i class="fa-solid fa-right-from-bracket text-sm"></i>
        </button>
      </div>
    </header>

    <!-- Bottom Nav Mobile -->
    <nav class="lg:hidden fixed bottom-0 left-0 right-0 bg-white 
      border-t border-gray-200 px-2 py-1 flex justify-around z-40">
      ${bottomLinks.map(l => `
        <a href="${l.href}"
          class="flex flex-col items-center px-3 py-1.5 rounded-xl
          ${activePage === l.id ? 'text-green-600' : 'text-gray-400'}">
          <i class="fa-solid ${l.icon} text-lg"></i>
          <span class="text-xs mt-0.5 ${activePage === l.id ? 'font-semibold' : ''}">
            ${l.label}</span>
        </a>`).join('')}
    </nav>

    <!-- Toast Notification -->
    <div id="toast" class="hidden fixed top-4 right-4 z-50 
      px-4 py-3 rounded-xl text-sm font-medium shadow-lg"></div>

    <!-- Spacer mobile -->
    <div class="lg:hidden h-16"></div>`
}

// Update jam realtime
function startClock() {
  function update() {
    const el = document.getElementById('topWaktu')
    if (el) el.textContent = new Date().toLocaleString('id-ID', {
      weekday: 'long', day: 'numeric',
      month: 'long', hour: '2-digit', minute: '2-digit'
    })
  }
  update()
  setInterval(update, 1000)
}
