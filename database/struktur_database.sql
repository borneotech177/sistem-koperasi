-- ============================================================
--  STRUKTUR DATABASE SISTEM KOPERASI / KANTIN / ePOS
--  Versi: PostgreSQL (Supabase)
--  BORNEO-TECH
-- ============================================================

-- ============================================================
-- 1. USERS & AUTENTIKASI
-- ============================================================

CREATE TABLE users (
    id              SERIAL PRIMARY KEY,
    username        VARCHAR(50) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    nama_lengkap    VARCHAR(100) NOT NULL,
    role            VARCHAR(20) CHECK (role IN ('admin','petugas','member','kasir')) NOT NULL,
    no_hp           VARCHAR(20),
    email           VARCHAR(100),
    foto            VARCHAR(255),
    status          VARCHAR(10) CHECK (status IN ('aktif','nonaktif')) DEFAULT 'aktif',
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE login_log (
    id              SERIAL PRIMARY KEY,
    user_id         INT NOT NULL REFERENCES users(id),
    waktu_login     TIMESTAMP DEFAULT NOW(),
    ip_address      VARCHAR(45),
    status          VARCHAR(10) CHECK (status IN ('berhasil','gagal')) NOT NULL,
    keterangan      VARCHAR(255)
);

-- ============================================================
-- 2. MODUL KSP/KSPPS/KSU — SIMPAN PINJAM
-- ============================================================

CREATE TABLE anggota (
    id              SERIAL PRIMARY KEY,
    no_anggota      VARCHAR(20) NOT NULL UNIQUE,
    user_id         INT REFERENCES users(id),
    nik             VARCHAR(20) NOT NULL UNIQUE,
    nama            VARCHAR(100) NOT NULL,
    alamat          TEXT,
    no_hp           VARCHAR(20),
    jenis_kelamin   CHAR(1) CHECK (jenis_kelamin IN ('L','P')),
    tanggal_lahir   DATE,
    pekerjaan       VARCHAR(100),
    foto_ktp        VARCHAR(255),
    tanggal_daftar  DATE NOT NULL,
    status          VARCHAR(10) CHECK (status IN ('aktif','nonaktif')) DEFAULT 'aktif'
);

CREATE TABLE simpanan (
    id              SERIAL PRIMARY KEY,
    anggota_id      INT NOT NULL REFERENCES anggota(id),
    jenis_simpanan  VARCHAR(20) CHECK (jenis_simpanan IN ('pokok','wajib','sukarela','tabungan')) NOT NULL,
    jumlah          NUMERIC(15,2) NOT NULL,
    tanggal         DATE NOT NULL,
    keterangan      VARCHAR(255),
    petugas_id      INT REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE saldo_simpanan (
    id              SERIAL PRIMARY KEY,
    anggota_id      INT NOT NULL UNIQUE REFERENCES anggota(id),
    saldo_pokok     NUMERIC(15,2) DEFAULT 0,
    saldo_wajib     NUMERIC(15,2) DEFAULT 0,
    saldo_sukarela  NUMERIC(15,2) DEFAULT 0,
    saldo_tabungan  NUMERIC(15,2) DEFAULT 0,
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE pengajuan_pinjaman (
    id              SERIAL PRIMARY KEY,
    no_pengajuan    VARCHAR(30) NOT NULL UNIQUE,
    anggota_id      INT NOT NULL REFERENCES anggota(id),
    jumlah_pinjaman NUMERIC(15,2) NOT NULL,
    tenor_bulan     INT NOT NULL,
    bunga_persen    NUMERIC(5,2) NOT NULL,
    tujuan_pinjaman TEXT,
    agunan          VARCHAR(255),
    tanggal_pengajuan DATE NOT NULL,
    status          VARCHAR(20) CHECK (status IN ('pending','disetujui','ditolak','lunas')) DEFAULT 'pending',
    disetujui_oleh  INT REFERENCES users(id),
    tanggal_approval TIMESTAMP,
    keterangan_admin VARCHAR(255)
);

CREATE TABLE pinjaman (
    id              SERIAL PRIMARY KEY,
    pengajuan_id    INT NOT NULL UNIQUE REFERENCES pengajuan_pinjaman(id),
    anggota_id      INT NOT NULL REFERENCES anggota(id),
    pokok_pinjaman  NUMERIC(15,2) NOT NULL,
    total_bunga     NUMERIC(15,2) NOT NULL,
    total_angsuran  NUMERIC(15,2) NOT NULL,
    tenor_bulan     INT NOT NULL,
    tanggal_cair    DATE NOT NULL,
    tanggal_jatuh_tempo DATE,
    sisa_pokok      NUMERIC(15,2),
    status          VARCHAR(20) CHECK (status IN ('berjalan','lunas','macet')) DEFAULT 'berjalan'
);

CREATE TABLE angsuran (
    id              SERIAL PRIMARY KEY,
    pinjaman_id     INT NOT NULL REFERENCES pinjaman(id),
    ke_angsuran     INT NOT NULL,
    tanggal_jatuh_tempo DATE NOT NULL,
    tanggal_bayar   DATE,
    jumlah_pokok    NUMERIC(15,2) NOT NULL,
    jumlah_bunga    NUMERIC(15,2) NOT NULL,
    jumlah_bayar    NUMERIC(15,2),
    denda           NUMERIC(15,2) DEFAULT 0,
    status          VARCHAR(20) CHECK (status IN ('belum','lunas','terlambat')) DEFAULT 'belum',
    petugas_id      INT REFERENCES users(id)
);

CREATE TABLE simulasi_kredit (
    id              SERIAL PRIMARY KEY,
    user_id         INT REFERENCES users(id),
    jumlah_pinjaman NUMERIC(15,2),
    tenor_bulan     INT,
    bunga_persen    NUMERIC(5,2),
    angsuran_per_bulan NUMERIC(15,2),
    total_bayar     NUMERIC(15,2),
    total_bunga     NUMERIC(15,2),
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 3. MODUL ePOS — TOKO
-- ============================================================

CREATE TABLE kategori_produk (
    id              SERIAL PRIMARY KEY,
    nama_kategori   VARCHAR(100) NOT NULL,
    deskripsi       TEXT,
    modul           VARCHAR(10) CHECK (modul IN ('toko','kantin')) DEFAULT 'toko'
);

CREATE TABLE produk (
    id              SERIAL PRIMARY KEY,
    kode_produk     VARCHAR(30) NOT NULL UNIQUE,
    nama_produk     VARCHAR(150) NOT NULL,
    kategori_id     INT REFERENCES kategori_produk(id),
    harga_beli      NUMERIC(15,2),
    harga_jual      NUMERIC(15,2) NOT NULL,
    stok            INT DEFAULT 0,
    stok_minimum    INT DEFAULT 5,
    satuan          VARCHAR(20) DEFAULT 'pcs',
    foto            VARCHAR(255),
    status          VARCHAR(10) CHECK (status IN ('aktif','nonaktif')) DEFAULT 'aktif',
    modul           VARCHAR(10) CHECK (modul IN ('toko','kantin')) DEFAULT 'toko'
);

CREATE TABLE stok_log (
    id              SERIAL PRIMARY KEY,
    produk_id       INT NOT NULL REFERENCES produk(id),
    jenis           VARCHAR(10) CHECK (jenis IN ('masuk','keluar','koreksi')) NOT NULL,
    jumlah          INT NOT NULL,
    stok_sebelum    INT,
    stok_sesudah    INT,
    keterangan      VARCHAR(255),
    user_id         INT REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE transaksi_penjualan (
    id              SERIAL PRIMARY KEY,
    no_transaksi    VARCHAR(30) NOT NULL UNIQUE,
    kasir_id        INT NOT NULL REFERENCES users(id),
    member_id       INT REFERENCES anggota(id),
    tanggal         TIMESTAMP DEFAULT NOW(),
    total_harga     NUMERIC(15,2) NOT NULL,
    diskon          NUMERIC(15,2) DEFAULT 0,
    total_bayar     NUMERIC(15,2) NOT NULL,
    metode_bayar    VARCHAR(20) CHECK (metode_bayar IN ('tunai','saldo_rfid','transfer')) DEFAULT 'tunai',
    kembalian       NUMERIC(15,2) DEFAULT 0,
    modul           VARCHAR(10) CHECK (modul IN ('toko','kantin')) DEFAULT 'toko',
    status          VARCHAR(10) CHECK (status IN ('selesai','batal')) DEFAULT 'selesai'
);

CREATE TABLE detail_transaksi (
    id              SERIAL PRIMARY KEY,
    transaksi_id    INT NOT NULL REFERENCES transaksi_penjualan(id),
    produk_id       INT NOT NULL REFERENCES produk(id),
    jumlah          INT NOT NULL,
    harga_satuan    NUMERIC(15,2) NOT NULL,
    subtotal        NUMERIC(15,2) NOT NULL
);

-- ============================================================
-- 4. MODUL eKANTIN
-- ============================================================

CREATE TABLE menu_kantin (
    id              SERIAL PRIMARY KEY,
    produk_id       INT NOT NULL REFERENCES produk(id),
    ketersediaan    VARCHAR(10) CHECK (ketersediaan IN ('tersedia','habis')) DEFAULT 'tersedia',
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 5. MODUL RFID MEMBER
-- ============================================================

CREATE TABLE rfid_kartu (
    id              SERIAL PRIMARY KEY,
    no_kartu        VARCHAR(50) NOT NULL UNIQUE,
    anggota_id      INT NOT NULL UNIQUE REFERENCES anggota(id),
    saldo           NUMERIC(15,2) DEFAULT 0,
    tanggal_terbit  DATE NOT NULL,
    tanggal_expired DATE,
    status          VARCHAR(10) CHECK (status IN ('aktif','blokir','hilang')) DEFAULT 'aktif',
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE rfid_topup (
    id              SERIAL PRIMARY KEY,
    kartu_id        INT NOT NULL REFERENCES rfid_kartu(id),
    jumlah          NUMERIC(15,2) NOT NULL,
    saldo_sebelum   NUMERIC(15,2),
    saldo_sesudah   NUMERIC(15,2),
    metode          VARCHAR(10) CHECK (metode IN ('tunai','transfer')) DEFAULT 'tunai',
    petugas_id      INT REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE rfid_tap_log (
    id              SERIAL PRIMARY KEY,
    kartu_id        INT NOT NULL REFERENCES rfid_kartu(id),
    waktu_tap       TIMESTAMP DEFAULT NOW(),
    lokasi          VARCHAR(100),
    jenis           VARCHAR(20) CHECK (jenis IN ('validasi','transaksi','topup')),
    transaksi_id    INT REFERENCES transaksi_penjualan(id),
    status          VARCHAR(10) CHECK (status IN ('berhasil','gagal')) DEFAULT 'berhasil',
    keterangan      VARCHAR(255)
);

-- ============================================================
-- 6. MODUL WEBSITE CMS
-- ============================================================

CREATE TABLE cms_konten (
    id              SERIAL PRIMARY KEY,
    slug            VARCHAR(100) NOT NULL UNIQUE,
    judul           VARCHAR(255) NOT NULL,
    konten          TEXT,
    tipe            VARCHAR(20) CHECK (tipe IN ('halaman','berita','pengumuman','banner')) DEFAULT 'halaman',
    status          VARCHAR(10) CHECK (status IN ('publish','draft')) DEFAULT 'draft',
    penulis_id      INT REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE pendaftaran_online (
    id              SERIAL PRIMARY KEY,
    nama            VARCHAR(100) NOT NULL,
    nik             VARCHAR(20) NOT NULL,
    alamat          TEXT,
    no_hp           VARCHAR(20),
    email           VARCHAR(100),
    pekerjaan       VARCHAR(100),
    jenis_simpanan  VARCHAR(50),
    tanggal_daftar  TIMESTAMP DEFAULT NOW(),
    status          VARCHAR(20) CHECK (status IN ('baru','diproses','diterima','ditolak')) DEFAULT 'baru',
    diproses_oleh   INT REFERENCES users(id),
    keterangan      VARCHAR(255)
);

-- ============================================================
-- 7. NOTIFIKASI WHATSAPP
-- ============================================================

CREATE TABLE notifikasi_wa (
    id              SERIAL PRIMARY KEY,
    tujuan_no_hp    VARCHAR(20) NOT NULL,
    anggota_id      INT REFERENCES anggota(id),
    jenis           VARCHAR(20) CHECK (jenis IN ('angsuran','saldo','transaksi','info','broadcast')) NOT NULL,
    pesan           TEXT NOT NULL,
    referensi_id    INT,
    referensi_tabel VARCHAR(50),
    status          VARCHAR(10) CHECK (status IN ('pending','terkirim','gagal')) DEFAULT 'pending',
    waktu_kirim     TIMESTAMP,
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE template_notifikasi (
    id              SERIAL PRIMARY KEY,
    kode            VARCHAR(50) NOT NULL UNIQUE,
    nama            VARCHAR(100) NOT NULL,
    template_pesan  TEXT NOT NULL,
    jenis           VARCHAR(20) CHECK (jenis IN ('angsuran','saldo','transaksi','info','broadcast')),
    aktif           BOOLEAN DEFAULT TRUE
);

-- ============================================================
-- 8. LAPORAN & AUDIT
-- ============================================================

CREATE TABLE laporan_harian (
    id              SERIAL PRIMARY KEY,
    tanggal         DATE NOT NULL,
    modul           VARCHAR(10) CHECK (modul IN ('ksp','epos','ekantin','rfid')) NOT NULL,
    total_transaksi INT DEFAULT 0,
    total_nominal   NUMERIC(15,2) DEFAULT 0,
    dibuat_oleh     INT REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE audit_log (
    id              SERIAL PRIMARY KEY,
    user_id         INT REFERENCES users(id),
    aksi            VARCHAR(100) NOT NULL,
    tabel_terkait   VARCHAR(50),
    id_data         INT,
    data_lama       JSONB,
    data_baru       JSONB,
    ip_address      VARCHAR(45),
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_anggota_no ON anggota(no_anggota);
CREATE INDEX idx_pinjaman_anggota ON pinjaman(anggota_id);
CREATE INDEX idx_angsuran_pinjaman ON angsuran(pinjaman_id);
CREATE INDEX idx_transaksi_tanggal ON transaksi_penjualan(tanggal);
CREATE INDEX idx_transaksi_member ON transaksi_penjualan(member_id);
CREATE INDEX idx_rfid_kartu ON rfid_kartu(no_kartu);
CREATE INDEX idx_notif_status ON notifikasi_wa(status);
CREATE INDEX idx_produk_modul ON produk(modul);

-- ============================================================
-- END OF SCRIPT
-- ============================================================
  
