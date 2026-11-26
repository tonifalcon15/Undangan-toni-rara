# Undangan Toni & Rara — Guestbook publik

Paket ini menambahkan:
- Form ucapan dan konfirmasi kehadiran.
- Daftar ucapan yang dapat dibaca semua pengunjung.
- Penyimpanan persisten memakai Netlify Blobs.
- Audio piano `golden-hour-piano.mp3`.

## Penting: cara deploy
Paket ini memerlukan Netlify Functions dan Netlify Blobs. **Jangan hanya drag-and-drop ZIP sebagai folder statis.**
Deploy melalui GitHub (Continuous Deployment) atau Netlify CLI agar function `netlify/functions/ucapan.mjs` ikut terpasang.

### GitHub (lebih mudah dari HP jika sudah punya akun)
1. Ekstrak ZIP ini.
2. Buat repository baru di GitHub, misalnya `undangan-toni-rara`.
3. Upload seluruh isi folder hasil ekstrak ke repository, termasuk folder `netlify/functions`.
4. Di Netlify: Add new project → Import an existing project → GitHub.
5. Pilih repository tersebut. Build command kosong; publish directory `.`.
6. Deploy. Netlify akan memasang dependency `@netlify/blobs` dari `package.json` dan mendeteksi function dari `netlify.toml`.
7. Setelah deploy, buka website, kirim satu ucapan percobaan, lalu periksa apakah ucapan muncul di daftar.

Ucapan dan nama yang dikirim akan terlihat oleh semua pengunjung website. Jangan minta nomor telepon, alamat, atau data sensitif di form publik. Data disimpan pada Netlify Blobs dan tetap ada setelah deploy baru.
