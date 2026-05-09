# Sign Talker - Mobile App Interface Design

## Overview
Sign Talker adalah aplikasi Android yang membantu komunikasi dengan penyandang tunawicara melalui deteksi bahasa isyarat real-time menggunakan kamera perangkat.

## Screen List

1. **Home Screen (Kamera Utama)**
   - Layar utama dengan live feed kamera
   - Area deteksi gerakan tangan di tengah layar
   - Tombol untuk memulai/menghentikan deteksi
   - Indikator status deteksi

2. **Translation Result Screen**
   - Menampilkan teks hasil terjemahan bahasa isyarat
   - Tombol untuk memutar suara (Text-to-Speech)
   - Indikator delay 1 detik sebelum suara diputar
   - Tombol untuk menyalin teks
   - Tombol untuk membersihkan hasil

3. **Settings Screen**
   - Pengaturan bahasa (Indonesian, English, dll)
   - Pengaturan kecepatan pemrosesan
   - Pengaturan volume suara
   - Informasi aplikasi

## Primary Content and Functionality

### Home Screen
- **Live Camera Feed**: Menampilkan video real-time dari kamera depan
- **Hand Detection Overlay**: Visualisasi kerangka tangan yang terdeteksi (landmark points)
- **Status Indicator**: Menunjukkan apakah sedang mendeteksi atau idle
- **Start/Stop Button**: Tombol untuk mengaktifkan/menonaktifkan deteksi
- **Recent Translations**: Daftar singkat terjemahan terakhir

### Translation Result Screen
- **Translation Text**: Teks besar yang mudah dibaca hasil terjemahan
- **Confidence Score**: Persentase akurasi deteksi (jika tersedia)
- **Speak Button**: Tombol untuk memutar suara dengan delay 1 detik
- **Delay Countdown**: Visual countdown dari 1 detik sebelum suara diputar
- **Copy Button**: Salin teks ke clipboard
- **Clear Button**: Hapus hasil terjemahan

### Settings Screen
- **Language Selection**: Pilihan bahasa untuk terjemahan dan suara
- **Processing Speed**: Slider untuk kecepatan deteksi (fast/normal/accurate)
- **Voice Settings**: Pilihan suara (pria/wanita), kecepatan bicara, pitch
- **Volume Control**: Slider untuk volume suara
- **About**: Versi aplikasi, lisensi, kontak

## Key User Flows

### Flow 1: Deteksi dan Terjemahan Bahasa Isyarat
1. User membuka aplikasi → Home Screen dengan live camera feed
2. User membuat gerakan tangan (bahasa isyarat)
3. Aplikasi mendeteksi gerakan → menampilkan landmark tangan
4. Setelah gerakan selesai, aplikasi menunggu 1 detik
5. Hasil terjemahan ditampilkan di Translation Result Screen
6. User dapat memutar suara atau menyalin teks

### Flow 2: Mengatur Preferensi
1. User membuka Settings dari Home Screen
2. User mengubah bahasa, kecepatan, atau suara
3. Pengaturan disimpan secara otomatis
4. User kembali ke Home Screen dengan pengaturan baru

### Flow 3: Melihat Riwayat Terjemahan
1. User melihat daftar terjemahan terakhir di Home Screen
2. User dapat mengetuk item untuk melihat detail atau memutar ulang suara

## Color Choices

| Element | Color | Usage |
|---------|-------|-------|
| **Primary** | #0A7EA4 (Teal Blue) | Tombol utama, highlight, accent |
| **Background** | #FFFFFF (Light) / #151718 (Dark) | Latar belakang layar |
| **Surface** | #F5F5F5 (Light) / #1E2022 (Dark) | Kartu, panel |
| **Foreground** | #11181C (Light) / #ECEDEE (Dark) | Teks utama |
| **Muted** | #687076 (Light) / #9BA1A6 (Dark) | Teks sekunder |
| **Success** | #22C55E (Green) | Status berhasil, deteksi aktif |
| **Warning** | #F59E0B (Orange) | Peringatan, akurasi rendah |
| **Error** | #EF4444 (Red) | Error, deteksi gagal |

## Layout Specifications

### Safe Area & Orientation
- **Orientation**: Portrait (9:16 aspect ratio)
- **Safe Area**: Menggunakan ScreenContainer untuk menangani notch dan home indicator
- **One-Handed Usage**: Tombol utama ditempatkan di bagian bawah layar untuk kemudahan akses

### Camera Feed
- **Ukuran**: Full-width, 60-70% dari tinggi layar
- **Aspect Ratio**: 16:9 atau sesuai kamera perangkat
- **Border Radius**: 16px untuk tampilan modern

### Buttons & Controls
- **Primary Button**: 48px height, full-width atau 80% width
- **Secondary Button**: 40px height, outline style
- **Icon Button**: 44px × 44px untuk akses mudah

### Typography
- **Heading**: 28px, bold (Terjemahan hasil)
- **Body**: 16px, regular (Teks konten)
- **Caption**: 12px, muted (Keterangan, timestamp)

## Accessibility Considerations
- Semua tombol memiliki ukuran minimal 44×44px untuk kemudahan tap
- Kontras warna memenuhi standar WCAG AA
- Support untuk screen reader (VoiceOver di iOS, TalkBack di Android)
- Haptic feedback pada interaksi penting
