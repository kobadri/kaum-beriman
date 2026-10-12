// ==========================================
// DATA.JS - STANDAR NAMA HARI (MURNI & CLEAN)
// ==========================================

const TANGGAL_MULAI = new Date(2026, 9, 5); // Senin Minggu ke-1 (5 Oktober 2026)

function getMingguAktifOtomatis() {
    const hariIni = new Date();
    const selisihHari = Math.floor((hariIni - TANGGAL_MULAI) / (1000 * 60 * 60 * 24));
    
    if (selisihHari < 0) return "01";
    
    let angkaMinggu = Math.floor(selisihHari / 7) + 1;
    if (angkaMinggu > 12) angkaMinggu = 12;
    
    return String(angkaMinggu).padStart(2, '0');
}

const mingguAktif = getMingguAktifOtomatis();

function getMateri(hariKey) {
    return {
        label: `${hariKey} - Minggu ke-${mingguAktif}`,
        teks: `T_${mingguAktif}_${hariKey}.html`,
        audio: `S_${mingguAktif}_${hariKey}.mp3`,
        video: `V_${mingguAktif}_${hariKey}.mp4`
    };
}

const jadwalMateri = {
    get Senin() { return getMateri("Senin"); },
    get Selasa() { return getMateri("Selasa"); },
    get Rabu() { return getMateri("Rabu"); },
    get Kamis() { return getMateri("Kamis"); },
    get Jumat() { return getMateri("Jumat"); },
    get Sabtu() { return getMateri("Sabtu"); },
    get garis_besar() { return getMateri("garis_besar"); }
};
