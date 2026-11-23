# Sanity Studio Baru

Studio Sanity mandiri untuk proyek `Sanity Studio Baru` (`aejzrj0n`) pada dataset `production`.

## Menjalankan secara lokal

Gunakan Node.js 22.12 atau lebih baru. Setelah mengekstrak folder, jalankan:

```sh
npm install
npm run dev
```

Untuk memeriksa build produksi lokal:

```sh
npm run build
```

Studio menggunakan template clean TypeScript. Daftar schema saat ini kosong di `schemaTypes/index.ts`, sehingga tipe konten dapat ditambahkan sesuai kebutuhan.

## Penting: visibilitas dataset

Dataset `production` disetel **publik** sesuai pilihan paket gratis. Konten terbitan dapat dibaca publik melalui API Sanity; jangan menyimpan konten rahasia atau sensitif di dataset ini. Lihat [dokumentasi visibilitas dataset](https://www.sanity.io/docs/content-lake/keeping-your-data-safe).

Proyek baru mendapat trial Growth 30 hari. Setelah trial, proyek otomatis turun ke Free jika tidak di-upgrade, dan Sanity menyatakan tidak ada biaya kecuali Anda memilih upgrade. Baca [ketentuan trial](https://www.sanity.io/docs/platform-management/growth-plan-trial).

Studio ini belum dideploy ke hosting Sanity dan belum ditambahkan ke aplikasi web apa pun.
