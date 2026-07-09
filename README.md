# komputasi-pervasif

========================================================================
             NATUREQUEST - MOUNTAIN EXPLORER PREMIUM v1.0
========================================================================

NatureQuest adalah aplikasi berbasis web (Web App) interaktif yang 
didesain sebagai platform "Ujian Mandiri Berbasis Komunitas Pendaki". 
Aplikasi ini menggabungkan sistem kuis bertema pendakian gunung dengan
mekanisme anti-cheat berbasis gamifikasi (Stamina System).

Aplikasi ini menggunakan tampilan visual modern dengan teknik Parallax 
Background (gunung berbaris, awan bergerak, matahari terbit, dan aliran
sungai perspektif) serta antarmuka UI Glassmorphism yang elegan.

------------------------------------------------------------------------
 FITUR UTAMA
------------------------------------------------------------------------
1. Autentikasi Jalur (Login NIM): 
   Pemeriksaan identitas pendaki sebelum memulai kuis.
2. Pos Rintangan (Sistem Kuis): 
   Navigasi interaktif melalui peta pos (Base -> Pos 1-3 -> Puncak)
   dengan bank soal bertema teknik survival dan navigasi gunung.
3. Maskot Interaktif (Rupi si Rusa): 
   Memberikan petunjuk dan respons dinamis berdasarkan aksi pengguna.
4. Sistem Deteksi Badai (Anti-Cheat): 
   Menggunakan Visibility API. Jika pengguna berpindah tab atau membuka
   aplikasi lain, stamina akan berkurang 25%. Jika stamina mencapai 0%,
   pendaki didiskualifikasi (Gagal).
5. Integrasi Google Sheets API: 
   Mencatat riwayat login, skor akhir, sisa stamina, serta log audit 
   aktivitas perjalanan secara real-time.

------------------------------------------------------------------------
 STRUKTUR FILE
------------------------------------------------------------------------
├── index.html       - Struktur halaman utama web dan elemen visual.
├── style.css        - Desain UI Glassmorphism, animasi, dan layout.
├── script.js        - Logika kuis, sistem stamina, anti-cheat, dan API.
└── readme.txt       - Dokumentasi panduan proyek (file ini).

------------------------------------------------------------------------
 PETUNJUK KONFIGURASI (GOOGLE SHEETS INTEGRATION)
------------------------------------------------------------------------
Untuk mengaktifkan fitur penyimpanan data otomatis ke Google Sheets:
1. Buka Google Sheets baru, buat kolom yang dibutuhkan (Timestamp, NIM, 
   Score, Stamina, Status, Logs).
2. Buka 'Extensions' -> 'Apps Script'.
3. Tulis kode Web App Apps Script untuk menangani metode POST 
   ("AUTH_LOGIN" dan "SAVE_LOG_SCORE").
4. Deploy sebagai Web App, set akses ke "Anyone" (Siapa saja).
5. Salin URL Deployment yang dihasilkan.
6. Buka file `script.js` pada baris pertama, ubah nilai variabel 
   `GOOGLE_SHEET_URL` dengan URL deployment milikmu:
   
   const GOOGLE_SHEET_URL = "ISI_DENGAN_URL_DEPLOYMENT_ANDA";

------------------------------------------------------------------------
 CARA MENJALANKAN APLIKASI
------------------------------------------------------------------------
1. Pastikan seluruh file (`index.html`, `style.css`, `script.js`) 
   berada dalam satu folder yang sama.
2. Klik ganda (double-click) file `index.html` untuk membukanya di 
   browser (Chrome, Edge, Firefox, atau Safari).
3. Untuk pengalaman terbaik, jalankan menggunakan ekstensi "Live Server" 
   di VS Code atau hosting local server lainnya agar request API berjalan 
   lebih lancar.

------------------------------------------------------------------------
 TEKNOLOGI YANG DIGUNAKAN
------------------------------------------------------------------------
* HTML5 (Semantic Tags & Layout)
* CSS3 (Custom Properties, Clip-path, Parallax Keyframes Animation)
* JavaScript Vanilla (ES6+, Fetch API, Page Visibility API)
* Google Fonts (Nunito)

========================================================================
Dibuat untuk keperluan simulasi ujian navigasi komunitas. 
Aman, responsif, dan interaktif!
========================================================================
