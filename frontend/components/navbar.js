function renderNavbar(title = 'Dashboard', activePage = 'dashboard') {
  const user = Auth.getUser()

  const bottomLinks = [
    { id: 'dashboard', label: 'Home', icon: 'fa-house', href: 'dashboard.html' },
    { id: 'anggota', label: 'Anggota', icon: 'fa-users', href: 'anggota.html' },
    { id: 'toko', label: 'Toko', icon: 'fa-cart-shopping', href: 'toko.html' },
    { id: 'kantin', label: 'Kantin', icon: 'fa-utensils', href: 'kantin.html' },
    { id: 'laporan', label: 'Laporan', icon: 'fa-chart-bar', href: 'laporan.html' },
  ]

  return `
    <!-- Topbar -->
    <header class="bg-white border-b border-gray-200 px-4 
      lg:px-8 py-3 flex items-center justify-between 
      sticky top-0 z-30"
      style="box-shadow: 0 1px 4px rgba(0,0,0,0.06)">

      <!-- Kiri -->
      <div class="flex items-center gap-3">
        <img src="/sistem-koperasi/frontend/assets/logo.png"
          alt="SisKop"
          class="w-8 h-8 object-contain lg:hidden flex-shrink-0"/>
        <div>
          <h1 class="text-gray-800 font-bold text-base 
            leading-tight">${title}</h1>
          <p id="topWaktu" 
            class="text-gray-400 text-xs leading-tight"></p>
        </div>
      </div>

      <!-- Kanan -->
      <div class="flex items-center gap-2">

        <!-- Notifikasi -->
        <button class="btn-icon btn-ghost relative 
          hide-mobile">
          <i class="fa-regular fa-bell text-gray-500"></i>
        </button>

        <!-- User Info Desktop -->
        <div class="hidden lg:flex items-center gap-2 
          px-3 py-1.5 rounded-xl hover:bg-gray-50 
          transition cursor-pointer">
          <div class="text-right">
            <div class="text-gray-700 text-sm font-semibold 
              leading-tight">${user.nama || 'User'}</div>
            <div class="text-gray-400 text-xs leading-tight">
              ${(user.role || '').toUpperCase()}</div>
          </div>
          <div class="bg-green-100 rounded-full w-8 h-8 flex 
            items-center justify-center flex-shrink-0">
            <i class="fa-solid fa-user text-green-700 text-xs"></i>
          </div>
        </div>

        <!-- Logout Mobile -->
        <button onclick="Auth.logout()"
          class="lg:hidden btn-icon btn-ghost">
          <i class="fa-solid fa-right-from-bracket 
            text-red-400"></i>
        </button>

      </div>
    </header>

    <!-- Bottom Nav Mobile -->
    <nav class="lg:hidden fixed bottom-0 left-0 right-0 
      bg-white border-t border-gray-200 z-40"
      style="box-shadow: 0 -2px 8px rgba(0,0,0,0.06)">
      <div class="flex items-center justify-around px-1 py-1">
        ${bottomLinks.map(l => `
          <a href="${l.href}"
            class="flex flex-col items-center gap-0.5 px-3 
            py-2 rounded-xl transition ${
              activePage === l.id
                ? 'text-green-600'
                : 'text-gray-400 hover:text-gray-600'
            }">
            <i class="fa-solid ${l.icon} text-lg"></i>
            <span style="font-size:10px;font-weight:${
              activePage === l.id ? '600' : '500'
            }">${l.label}</span>
            ${activePage === l.id 
              ? '<span class="w-1 h-1 rounded-full bg-green-600"></span>' 
              : '<span class="w-1 h-1"></span>'}
          </a>`).join('')}
      </div>
    </nav>

    <!-- Toast -->
    <div id="toast" class="hidden"></div>

    <!-- Spacer Mobile -->
    <div class="lg:hidden" style="height:64px"></div>`
}

// Jam realtime
function startClock() {
  function update() {
    const el = document.getElementById('topWaktu')
    if (!el) return
    el.textContent = new Date().toLocaleString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  update()
  setInterval(update, 1000)
}
