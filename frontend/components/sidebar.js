function renderSidebar(activePage = 'dashboard') {
  const user = Auth.getUser()
  const pages = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-house', href: 'dashboard.html' },
    { id: 'anggota', label: 'Anggota', icon: 'fa-users', href: 'anggota.html', group: 'Data' },
    { id: 'pinjaman', label: 'Pinjaman KSP', icon: 'fa-hand-holding-dollar', href: 'pinjaman.html', group: 'Data' },
    { id: 'toko', label: 'ePOS Toko', icon: 'fa-cart-shopping', href: 'toko.html', group: 'Transaksi' },
    { id: 'kantin', label: 'eKantin', icon: 'fa-utensils', href: 'kantin.html', group: 'Transaksi' },
    { id: 'rfid', label: 'RFID Member', icon: 'fa-id-card', href: 'rfid.html', group: 'Transaksi' },
    { id: 'laporan', label: 'Laporan', icon: 'fa-chart-bar', href: 'laporan.html', group: 'Laporan' },
  ]

  let groups = {}
  pages.forEach(p => {
    const g = p.group || 'Menu Utama'
    if (!groups[g]) groups[g] = []
    groups[g].push(p)
  })

  let nav = ''
  Object.entries(groups).forEach(([group, items]) => {
    nav += `<p class="text-gray-400 text-xs font-semibold uppercase 
      tracking-wider px-3 mb-2 mt-4">${group}</p>`
    items.forEach(p => {
      nav += `
        <a href="${p.href}" class="sidebar-link ${activePage === p.id ? 'active' : ''}">
          <i class="fa-solid ${p.icon} w-5 text-center"></i>
          ${p.label}
        </a>`
    })
  })

  return `
    <aside class="hidden lg:flex flex-col fixed left-0 top-0 
      h-full w-64 bg-white border-r border-gray-200 z-40 shadow-sm">
      
      <div class="px-6 py-5 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <img src="assets/logo.png" alt="SisKop" class="w-10 h-10 object-contain"/>
          <div>
            <div class="text-gray-800 font-bold text-lg leading-tight">
              ${CONFIG.APP_NAME}</div>
            <div class="text-gray-400 text-xs">${CONFIG.APP_DESC}</div>
          </div>
        </div>
      </div>

      <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">${nav}</nav>

      <div class="px-3 py-4 border-t border-gray-100">
        <div class="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50">
          <div class="bg-green-100 rounded-full w-9 h-9 flex 
            items-center justify-center flex-shrink-0">
            <i class="fa-solid fa-user text-green-700 text-sm"></i>
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-gray-800 text-sm font-semibold truncate">
              ${user.nama || '-'}</div>
            <div class="text-gray-400 text-xs">
              ${(user.role || '').toUpperCase()}</div>
          </div>
          <button onclick="Auth.logout()" 
            class="text-gray-400 hover:text-red-500 transition" 
            title="Keluar">
            <i class="fa-solid fa-right-from-bracket text-sm"></i>
          </button>
        </div>
      </div>
    </aside>`
}
