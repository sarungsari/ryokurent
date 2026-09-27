# RyokouRent - Rental Sepeda Motor Malang & Kota Wisata Batu 🛵⛰️

Platform website modern untuk layanan rental sepeda motor di Kota Malang, Kota Wisata Batu, dan kawasan Taman Nasional Bromo Tengger Semeru. Dilengkapi sistem reservasi online instan, galeri armada terawat, asisten perencana rute wisata berbasis AI (Gemini 3.1 Pro High Thinking), dan integrasi WhatsApp customer service 24 jam.

---

## ✨ Fitur Unggulan

### 1. Sistem Reservasi Online Instan
- **Kalkulator Tarif Otomatis:** Perhitungan biaya sewa harian dan mingguan transparan tanpa biaya tersembunyi.
- **Titik Serah Terima & Garasi Utama:**
  - **Garasi Utama:** [Sewa Motor Ryokou Malang (Google Maps)](https://www.google.com/maps/place/Sewa+Motor+Ryokou+Malang/@-7.9365273,112.6085936,17z/data=!3m1!4b1!4m6!3m5!1s0x2e788328b2c88daf:0x8d9c145244188579!8m2!3d-7.9365273!4d112.6085936!16s%2Fg%2F11vs8qg8tr?entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D) - Tlogomas, Kec. Lowokwaru, Kota Malang (Jalur utama Malang - Batu)
  - **Gratis Antar-Jemput Stasiun & Kota:**
    - Stasiun Malang Kotabaru (Pintu Timur & Pintu Barat)
    - Stasiun Malang Kota Lama
    - Kayutangan Heritage & Alun-Alun Tugu Malang
    - Hotel / Villa di Kota Malang & Kota Wisata Batu
- **Kode Booking Unik & Cek Status:** Setiap reservasi menghasilkan tiket kode unik (misal: `RYK-260927-XXXX`) yang dapat dicek statusnya langsung di website.

### 2. Galeri Armada Honda Lengkap
1. **Honda CRF 150 L** (Adventure & Trail siap Lautan Pasir Bromo & Cangar)
2. **Honda Vario 160 eSP+** (Matic Premium bertenaga tanjakan Payung & Pujon Batu)
3. **Honda Vario 125 CBS-ISS** (Matic Handal & Irit untuk Malang - Batu)
4. **Honda BeAT Deluxe 2024** (Varian 2024 Emblem 3D & Power Charger)
5. **Honda Scoopy 2024 Smart Key** (Retro Modern Aesthetic untuk Kayutangan Heritage & Cafe)
6. **Honda BeAT Street 2024** (Street Naked Handlebar & Full Digital Meter)
7. **Honda All New BeAT Street 2025** (Generasi 2025 Velg 12 Inci & Anti-Theft Alarm)
8. **Honda BeAT CBS 2022** (Pilihan Hemat & Terjangkau untuk Backpacker)
9. **Honda BeAT Deluxe 2021** (Paling Ekonomis & Mesin Terawat Prima)
- **Kelengkapan Standar Setiap Unit:**
  - 2 Helm SNI bersih & higienis
  - 2 Jas hujan setelan tebal anti-rembes di bagasi
  - 1 Phone holder stang 360° untuk navigasi Google Maps
  - Layanan bantuan darurat jalan (Emergency Roadside Assistance) 24 jam.

### 3. Konsultan Rute AI (Gemini 3.1 Pro High Thinking)
- Menganalisis topografi jalan, sudut elevasi tanjakan Payung Batu, turunan ekstrem Klemuk/Cangar, lautan pasir Bromo, serta hawa dingin pegunungan.
- Menyarankan motor yang paling aman dan efisien sesuai jumlah penumpang dan pengalaman berkendara.
- Memberikan peringatan keselamatan (engine brake & manajemen rem), rekomendasi pitstop kuliner lokal (Pos Ketan Legenda, Cafe Sawah Pujon, Warung Wareg), dan estimasi biaya bahan bakar.

### 4. Integrasi WhatsApp 24 Jam
- Otomatis membuat draf tiket reservasi dengan format rapi ke nomor WhatsApp resmi (+62 852-2736-6130).
- Widget floating WhatsApp dengan live status *Online* dan pertanyaan cepat (*quick inquiry*).

### 5. Panel Operator Web (Command Center)
- **Akses Cepat:** Tombol *Panel Operator* di Navbar atas, galeri armada, dan footer.
- **Manajemen Armada (CRUD):** Tambah unit motor baru, edit spesifikasi & harga sewa, serta hapus unit.
- **Live Status Unit:** Toggle instan status motor (*Ready / Tersedia*, *Sedang Disewa*, *Servis Rutin AHASS*).
- **Unggah Foto & Galeri:** Unggah file foto motor langsung dari laptop/HP (drag & drop atau file browser) atau pilih dari galeri preset studio Honda resolusi tinggi.
- **Manajemen Booking Masuk:** Pantau tiket reservasi pelanggan, ubah status sewa, dan tombol chat WhatsApp langsung ke calon penyewa.
- **Reset Bawaan:** Opsi 1-klik untuk mengembalikan armada ke 9 unit standar Honda.

---

## 🛠️ Stack Teknologi

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide React, Motion.
- **Backend:** Express.js, TypeScript (`tsx server.ts`).
- **AI Engine:** `@google/genai` dengan model `gemini-3.1-pro-preview` (ThinkingLevel.HIGH).
- **Bundler:** Vite 8.

---

## 🚀 Menjalankan Proyek Secara Lokal

1. **Klon Repositori:**
   ```bash
   git clone https://github.com/cxperia575/ryokurent.git
   cd ryokurent
   ```

2. **Instal Dependensi:**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment:**
   Salin `.env.example` ke `.env` dan masukkan API key Gemini:
   ```env
   GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
   PORT=3000
   ```

4. **Jalankan Server Development:**
   ```bash
   npm run dev
   ```
   Buka peramban pada `http://localhost:3000`.

5. **Build untuk Produksi:**
   ```bash
   npm run build
   npm run start
   ```

---

## 📋 Endpoint API

| Method | Endpoint | Keterangan |
|---|---|---|
| `GET` | `/api/fleet` | Mengambil seluruh katalog armada sepeda motor beserta spesifikasi teknis |
| `GET` | `/api/config` | Mengambil daftar titik antar-jemput dan aksesori sewa |
| `POST` | `/api/reservations` | Membuat tiket reservasi baru & menghasilkan link WhatsApp terformat |
| `GET` | `/api/reservations/:id` | Mengambil detail bukti booking berdasarkan ID |
| `POST` | `/api/ai/trip-planner` | Menganalisis rute perjalanan dengan Gemini 3.1 Pro High Thinking |

---

## 📄 Lisensi
Hak Cipta © 2026 RyokouRent. Melayani rental sepeda motor di Kota Malang, Kota Wisata Batu, dan Gunung Bromo.
