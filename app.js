const appContainer = document.getElementById("app");

function renderMenuUtama() {
    if (!appContainer) return;
    appContainer.innerHTML = '<div class="card"><div class="header-title">Penyegaran Pagi — FKKP</div><div class="sub-header">Pilih Materi Minggu Ini</div><p style="color: #666; margin-bottom: 20px; font-size: 0.9rem;">Silakan pilih hari atau garis besar</p><div class="menu-list"><button class="btn-menu garis-besar" onclick="renderHalaman(\'garis_besar\')">📄 Garis Besar Minggu Ini</button><button class="btn-menu senin" onclick="renderHalaman(\'Senin\')">Senin</button><button class="btn-menu selasa" onclick="renderHalaman(\'Selasa\')">Selasa</button><button class="btn-menu rabu" onclick="renderHalaman(\'Rabu\')">Rabu</button><button class="btn-menu kamis" onclick="renderHalaman(\'Kamis\')">Kamis</button><button class="btn-menu jumat" onclick="renderHalaman(\'Jumat\')">Jumat</button><button class="btn-menu sabtu" onclick="renderHalaman(\'Sabtu\')">Sabtu</button></div><div class="footer-nav" style="margin-top: 20px;"><button class="btn-footer btn-primary" onclick="renderMenuUtama()">⭐ HARI INI</button></div></div>';
}

document.addEventListener("DOMContentLoaded", () => {
    renderMenuUtama();
});