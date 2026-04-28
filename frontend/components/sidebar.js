function renderSidebar(activePage = 'dashboard') {
  const user = Auth.getUser()
  const aksesUser = Auth.getAkses()

  const menus = [
    {
      group: 'Menu Utama',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: 'fa-house', href: 'dashboard.html' },
      ]
    },
    {
      group: 'Data',
      items: [
        { id: 'anggota', label: 'Anggota', icon: 'fa-users', href: 'anggota.html' },
        { id: 'pinjaman', label: 'Pinjaman KSP', icon: 'fa-hand-holding-dollar', href: 'pinjaman.html' },
        { id: 'produk', label: 'Manajemen Produk', icon: 'fa-box', href: 'produk.html' },
        { id: 'users', label: 'Manajemen User', icon: 'fa-user-gear', href: 'users.html' },
      ]
    },
    {
      group: 'Transaksi',
      items: [
        { id: 'toko', label: 'ePOS Toko', icon: 'fa-cart-shopping', href: 'toko.html' },
        { id: 'kantin', label: 'eKantin', icon: 'fa-utensils', href: 'kantin.html' },
        { id: 'rfid', label: 'RFID Member', icon: 'fa-id-card', href: 'rfid.html' },
      ]
    },
    {
      group: 'Laporan',
      items: [
        { id: 'laporan', label: 'Laporan & Statistik', icon: 'fa-chart-bar', href: 'laporan.html' },
      ]
    }
  ]

  let nav = ''
  menus.forEach(({ group, items }) => {
    nav += `
      <p class="text-gray-400 text-xs font-semibold uppercase 
        tracking-wider px-3 mb-1 mt-4 first:mt-0">${group}</p>`
    items.filter(p => aksesUser.includes(p.id)).forEach(p => {
      const isActive = activePage === p.id
      nav += `
        <a href="${p.href}" 
          class="sidebar-link ${isActive ? 'active' : ''}">
          <span class="icon">
            <i class="fa-solid ${p.icon} text-sm"></i>
          </span>
          <span>${p.label}</span>
          ${isActive ? '<span class="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-70"></span>' : ''}
        </a>`
    })
  })

  return `
    <aside class="hidden lg:flex flex-col fixed left-0 top-0 
      h-full w-64 bg-white border-r border-gray-200 z-40"
      style="box-shadow: 2px 0 8px rgba(0,0,0,0.04)">

      <!-- Logo -->
      <div class="px-5 py-5 border-b border-gray-100">
        <a href="dashboard.html" 
          class="flex items-center gap-3 no-underline">
          <img src="/sistem-koperasi/frontend/assets/logo.png" 
            alt="SisKop" 
            class="w-9 h-9 object-contain flex-shrink-0"/>
          <div>
            <div class="text-gray-800 font-bold text-base 
              leading-tight">${CONFIG.APP_NAME}</div>
            <div class="text-gray-400 text-xs">
              ${CONFIG.APP_DESC}</div>
          </div>
        </a>
      </div>

      <!-- Nav -->
      <nav class="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        ${nav}
      </nav>

      <!-- User -->
      <div class="px-3 py-3 border-t border-gray-100">
        <div class="flex items-center gap-3 px-3 py-2.5 
          rounded-xl bg-gray-50 hover:bg-gray-100 transition">
          <div class="bg-green-100 rounded-full w-8 h-8 flex 
            items-center justify-center flex-shrink-0">
            <i class="fa-solid fa-user text-green-700 text-xs"></i>
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-gray-800 text-sm font-semibold 
              truncate">${user.nama || 'User'}</div>
            <div class="text-gray-400 text-xs">
              ${(user.role || '').toUpperCase()}</div>
          </div>
          <button onclick="Auth.logout()"
            class="text-gray-300 hover:text-red-500 transition 
            p-1 rounded-lg hover:bg-red-50"
            title="Keluar">
            <i class="fa-solid fa-right-from-bracket text-sm"></i>
          </button>
        </div>
      </div>

    </aside>`
}
