echo 'const appContainer = document.getElementById("app");' > app.js
echo 'function renderMenuUtama() {' >> app.js
echo '    if (!appContainer) return;' >> app.js
echo '    appContainer.innerHTML = `<div class="card"><div class="header-title">Penyegaran Pagi — FKKP</div><div class="sub-header">Pilih Materi Minggu Ini</div><p style="color: #666; margin-bottom: 20px; font-size: 0.9rem;">Silakan pilih hari atau garis besar</p><div class="menu-list"><button class="btn-menu garis-besar" onclick="renderHalaman(\x27garis_besar\x27)">📄 Garis Besar Minggu Ini</button><button class="btn-menu senin" onclick="renderHalaman(\x27Senin\x27)">Senin</button><button class="btn-menu selasa" onclick="renderHalaman(\x27Selasa\x27)">Selasa</button><button class="btn-menu rabu" onclick="renderHalaman(\x27Rabu\x27)">Rabu</button><button class="btn-menu kamis" onclick="renderHalaman(\x27Kamis\x27)">Kamis</button><button class="btn-menu jumat" onclick="renderHalaman(\x27Jumat\x27)">Jumat</button><button class="btn-menu sabtu" onclick="renderHalaman(\x27Sabtu\x27)">Sabtu</button></div><div class="footer-nav" style="margin-top: 20px;"><button class="btn-footer btn-primary" onclick="renderMenuUtama()">⭐ HARI INI</button></div></div>`;' >> app.js
echo '}' >> app.js
echo 'function renderHalaman(hariKey) {' >> app.js
echo '    if (!appContainer) return;' >> app.js
echo '    const data = jadwalMateri[hariKey];' >> app.js
echo '    appContainer.innerHTML = `<div class="card"><div class="header-title">Penyegaran Pagi — FKKP</div><div style="display: flex; justify-content: space-between; align-items: center; margin: 15px 0;"><h3 style="margin: 0;">Pilih menu di bawah</h3><span class="badge">\${data.label}</span></div><div class="action-buttons"><button class="btn-action btn-baca" onclick="renderKonten(\x27teks\x27, \x27\${hariKey}\x27)">📖 Baca</button><button class="btn-action btn-audio" onclick="renderKonten(\x27audio\x27, \x27\${hariKey}\x27)">🎧 Dengar Suara</button><button class="btn-action btn-video" onclick="renderKonten(\x27video\x27, \x27\${hariKey}\x27)">🎬 Lihat Video</button></div><div class="footer-nav"><button class="btn-footer btn-secondary" onclick="renderMenuUtama()">← Menu Hari</button><button class="btn-footer btn-primary" onclick="renderMenuUtama()">🔥 Minggu Ini</button></div></div>`;' >> app.js
echo '}' >> app.js
echo 'function renderKonten(tipe, hariKey) {' >> app.js
echo '    if (!appContainer) return;' >> app.js
echo '    const data = jadwalMateri[hariKey];' >> app.js
echo '    let isiKonten = ""; let judulKonten = "";' >> app.js
echo '    if (tipe === "teks") { judulK = "Bacaan FKKP"; isiKonten = \`<iframe src="\${data.teks}" style="width:100%; height:350px; border:none;"></iframe>\`; }' >> app.js
echo '    else if (tipe === "audio") { isiKonten = \`<div style="text-align: center; padding: 20px;"><p style="color: #555; margin-bottom: 15px;">Memutar: \${data.audio}</p><audio controls style="width: 100%;"><source src="\${data.audio}" type="audio/mpeg"></audio></div>\`; }' >> app.js
echo '    else if (tipe === "video") { isiKonten = \`<div style="text-align: center;"><video controls style="width: 100%; max-height: 350px; background: #000; border-radius: 8px;"><source src="\${data.video}" type="video/mp4"></video></div>\`; }' >> app.js
echo '    appContainer.innerHTML = `<div class="card"><div class="header-title">Penyegaran Pagi — FKKP</div><div style="display: flex; justify-content: space-between; align-items: center; margin: 15px 0;"><h3 style="margin: 0; font-size: 1.1rem;">Detail Konten</h3><span class="badge">\${data.label}</span></div><div class="content-box" style="margin-bottom: 20px;">\${isiKonten}</div><div class="footer-nav"><button class="btn-footer btn-secondary" onclick="renderHalaman(\x27\${hariKey}\x27)">← Menu Hari</button><button class="btn-footer btn-primary" onclick="renderMenuUtama()">🔥 Minggu Ini</button></div></div>`;' >> app.js
echo '}' >> app.js
echo 'document.addEventListener("DOMContentLoaded", () => { renderMenuUtama(); });' >> app.js
echo "Selesai membuat app.js!"
