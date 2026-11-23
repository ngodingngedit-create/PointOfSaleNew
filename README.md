# POS kasir, Member, transaksi, dan keamanan PIN

Kasir memakai API server-only untuk PIN, Member, checkout, laporan, dan Insight. PIN di-hash dengan salt per PIN di Supabase. Data kontak Member dan ledger transaksi hanya disimpan/diakses melalui service role Supabase; browser tidak mendapat service key atau token sesi, dan autentikasi memakai cookie `HttpOnly`, `SameSite=Strict`. Sanity tetap menjadi katalog produk publik serta sumber konfigurasi cabang/meja.

## Sebelum mengaktifkan sign-in dan checkout produksi

API sengaja fail-closed sampai skema Supabase Free yang sudah ada dan pengaturan server-only siap. Jangan deploy ke produksi sebelum langkah berikut selesai.

1. Pada project Supabase yang sudah ada (`qrqwdrhogdiqdbzbhbcl`, tetap di Free), jalankan `supabase/migrations/20261103000000_pos_pin_security.sql` lalu `supabase/migrations/20261123000000_pos_members_sales.sql`. Tabel Member, transaksi, dan item transaksi memakai RLS ketat; role `anon` dan `authenticated` tidak mendapat akses, sedangkan API server memakai service role.
2. Set pengaturan **server-only** berikut di Vercel (bukan variabel `VITE_`):
   - `SUPABASE_URL=https://qrqwdrhogdiqdbzbhbcl.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` — service-role key dari project yang sama; jangan gunakan awalan `VITE_` dan jangan masukkan ke build browser.
   - `POS_SESSION_SECRET` — setidaknya 32 byte acak. Buat dengan `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"`.
   - `POS_ADMIN_USERNAME` — nama administrator privat yang dipilih pemilik.
   - `SANITY_API_TOKEN` — token tulis server untuk pengurangan stok; jangan paparkan melalui `VITE_`.
3. Buat password hash administrator dengan `npm run admin:hash`; gunakan password unik minimal 12 karakter dan simpan hanya hasil hash ke `POS_ADMIN_PASSWORD_HASH` di server.
4. Untuk Insight saja, konfigurasi `TOKEN_HARBOR_POS_API_KEY` sebagai kunci POS terpisah. Model dipatok ke `mimo-v2.6-flash:free`, tanpa fallback berbayar, dan hanya mengirim agregat penjualan, bukan identitas/nomor Member. Jangan gunakan ulang kunci untuk bot atau layanan lain.
5. Konfigurasi nama variabel server yang sama di `.env.local` yang diabaikan Git hanya bila perlu menguji API lokal. `.env.example` berisi placeholder, bukan secret. Jangan taruh service role, token tulis Sanity, atau kunci AI di variabel client.
6. Di Sanity Studio, buat cabang aktif yang nyata, tautkan setiap kasir ke cabang, dan atur meja aktif. Tidak ada cabang/meja contoh dibuat. Dokumen produk yang sudah ada tidak diubah oleh revisi ini.
7. Set PIN kasir dari `/admin/login` setelah migrasi PIN dan pengaturan server aktif. Profil kasir tanpa kredensial belum bisa login. Tidak ada PIN default/fallback.

Keep the existing public Sanity Free dataset settings unchanged. Do not store Member PII or transaction values in Sanity. Checkout creates opaque stock-application markers in the public dataset so a retry can be checked without decrementing stock twice; markers contain no customer, item, or price details. Apply production environment settings only after the deployment is approved.

## Sanity Studio

Source Studio ada di `studio-sanity-baru/` agar schema cabang, meja, dan relasi kasir dapat ikut disinkronkan melalui repository ini. Jalankan `npm ci` lalu `npm run build` di direktori tersebut. Deploy Studio ke project yang sama hanya dengan akun yang berwenang; jangan sertakan `.env.local`, token, atau hasil build dalam Git. Buat hanya data cabang, meja, dan kasir yang sebenarnya.

## Local checks

```bash
npm install
npm test
npm run build
```

PIN authentication uses Supabase RPC-backed 15-minute windows with limits by cashier/IP, cashier account, and IP; administrator sign-in is limited by admin account and IP. Reaching a threshold creates a 15-minute lockout. A missing project credential, SQL migration, password hash, or session secret yields a server error rather than enabling demo authentication.

## Insight penjualan

Insight mengambil transaksi `completed` dari cabang kasir dan periode yang dipilih (zona waktu Jakarta, maksimal 90 hari). Tidak ada data penjualan contoh atau jawaban pengganti. Periode kosong ditampilkan sebagai kosong; data yang tidak dapat diakses atau layanan AI yang gagal menghasilkan pesan error, bukan analisis palsu. Angka uji di `tests/` hanya fixture untuk pengujian lokal, tidak dimasukkan ke database atau aplikasi.

Server mengirim pertanyaan dan agregat penjualan (total, harian, dan produk) ke Token Harbor, tanpa nama kasir atau identitas Member. Periksa ketentuan dan izin data model gratis di akun Token Harbor secara terpisah sebelum mengaktifkannya: [kebijakan privasi Token Harbor](https://tokenharbor.ai/privacy). Persetujuan tidak diaktifkan oleh aplikasi dan tidak ada fallback ke model berbayar. Jika secret Vercel atau pengaturannya berubah, perubahan itu berlaku pada deployment baru; jangan deploy production sebelum disetujui pemilik. Respons AI dapat keliru, jadi cocokkan angka dengan laporan penjualan.

## Data and checkout behavior

Checkout verifies current prices, product variants/SKUs, stock revisions, cashier branch, table, and optional Member on the server. A private Supabase transaction is reserved before Sanity stock is decremented. A retry uses the same idempotency key; revision conflicts fail without recording a completed sale. If the system cannot determine whether a stock update completed, it marks the response as uncertain and does not repeat the decrement automatically. Reports include completed database transactions only; pending or failed checkouts are not counted as sales.
