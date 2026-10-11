// Pop-up kopi: setiap 3 kali pemakaian berhasil (install firmware, kirim ke alat, simpan tema) muncul ajakan traktir lewat QRIS.
// Sukarela, semua fitur tetap jalan. "Sudah traktir" = baru muncul lagi setelah 10 kali pemakaian. Hitungan per browser (localStorage).
// Dipakai index.html dan converter.html: panggil window.kopiUse(jedaMs) setelah satu aksi berhasil.
(() => {
  const KEY = 'agl_kopi', EVERY = 3, AFTER_PAID = 10;
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
  const save = s => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {} };

  const css = `
.kopi { width:min(420px, calc(100vw - 32px)); max-height:calc(100dvh - 32px); padding:24px; border:1px solid #ff6302; border-radius:20px;
        background:radial-gradient(120% 50% at 50% 0%, rgba(255,99,2,.18), #0f0f0f 70%); color:#f5f5f5; text-align:center;
        font:15px/1.55 Inter, system-ui, sans-serif; box-shadow:0 30px 80px rgba(0,0,0,.8); }
.kopi[open] { animation:kopiIn .28s ease-out; }
.kopi::backdrop { background:rgba(0,0,0,.72); backdrop-filter:blur(4px); }
@keyframes kopiIn { from { opacity:0; transform:translateY(16px) scale(.97); } }
.kopi .x { position:absolute; top:8px; right:8px; width:44px; height:44px; border:0; border-radius:50%; background:none; color:#a0a0a0; font-size:1.5rem; cursor:pointer; }
.kopi .x:hover { color:#fff; background:#1a1a1a; }
.kopi svg { width:52px; height:52px; fill:none; stroke:#ff6302; stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; }
.kopi h2 { margin:6px 0 6px; font-size:1.3rem; }
.kopi p { margin:0 0 14px; color:#a0a0a0; }
.kopi p b { color:#f5f5f5; }
.kopi img { display:block; width:auto; max-width:100%; max-height:min(300px, 38dvh); margin:0 auto 16px; padding:8px; background:#fff; border-radius:12px; }
.kopi .acts { display:grid; gap:10px; }
.kopi .acts a, .kopi .acts button { min-height:48px; display:flex; align-items:center; justify-content:center; border-radius:99px; font:600 .95rem Inter, system-ui, sans-serif;
        text-decoration:none; cursor:pointer; border:1px solid #2c2c2c; background:transparent; color:#f5f5f5; }
.kopi .acts .go { background:#ff6302; border-color:#ff6302; color:#000; }
.kopi .acts .later { border:0; color:#a0a0a0; min-height:44px; }
.kopi :focus-visible { outline:2px solid #fff; outline-offset:3px; }
@media (prefers-reduced-motion:reduce) { .kopi[open] { animation:none; } }`;

  let dlg;
  function show(n) {
    if (!dlg) {
      document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);
      dlg = document.createElement('dialog');
      dlg.className = 'kopi';
      dlg.setAttribute('aria-labelledby', 'kopiT');
      dlg.innerHTML = `<button class="x" type="button" aria-label="Tutup" data-a="later">×</button>
<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M8 17h20v9a7 7 0 0 1-7 7h-6a7 7 0 0 1-7-7zM28 20h2.5a3.5 3.5 0 0 1 0 7H28M6 36h24M13 12c-2-2 2-3 0-6M18 12c-2-2 2-3 0-6M23 12c-2-2 2-3 0-6"/></svg>
<h2 id="kopiT">Kopi developer: 0%</h2>
<p>Udah <b id="kopiN"></b> kali pakai web ini, mantap! Semua fitur tetap gratis. Kalau kebantu, traktir kopi <b>mulai 5 ribu, seikhlasnya</b>, bebas berapa pun, biar project berikutnya (konsol game retro layar warna) cepat jadi.</p>
<img src="qris.jpeg" alt="QRIS donasi AGREIUS.Lab" width="1136" height="1598">
<div class="acts">
  <a class="go" href="qris.jpeg" download="QRIS-agreius-lab.jpeg">Download QRIS</a>
  <button type="button" data-a="paid">Sudah traktir, makasih!</button>
  <button type="button" class="later" data-a="later">Nanti aja</button>
</div>`;
      dlg.onclick = e => {
        const a = e.target.closest('[data-a]')?.dataset.a;
        if (a === 'paid') { const s = load(); s.next = s.n + AFTER_PAID; save(s); }
        const r = dlg.getBoundingClientRect();  // klik di backdrop (luar kotak) = tutup
        if (a || e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dlg.close();
      };
      document.body.append(dlg);
    }
    dlg.querySelector('#kopiN').textContent = n;
    if (!dlg.open) dlg.showModal();
  }

  window.kopiUse = (delay = 0) => {
    const s = load();
    s.n = (s.n || 0) + 1;
    s.next ||= EVERY;  // pemakaian ke berapa pop-up muncul
    const due = s.n >= s.next;
    if (due) s.next = s.n + EVERY;  // "Sudah traktir" menggeser ini ke +10
    save(s);
    if (due) setTimeout(() => show(s.n), delay);
  };
})();
