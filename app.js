let dataAktif = null;

document.addEventListener("DOMContentLoaded", () => {
    muatHariIni();
});

// Deteksi otomatis hari ini berdasarkan sistem HP
function muatHariIni() {
    const sekarang = new Date();
    const tahun = sekarang.getFullYear();
    const bulan = String(sekarang.getMonth() + 1).padStart(2, '0');
    const tanggal = String(sekarang.getDate()).padStart(2, '0');
    const formatHariIni = `${tahun}-${bulan}-${tanggal}`;

    let ditemukan = typeof dataBuku !== 'undefined' ? dataBuku.find(item => item.tanggal === formatHariIni) : null;
    if (!ditemukan && typeof dataBuku !== 'undefined' && dataBuku.length > 0) {
        ditemukan = dataBuku.find(item => item.tipe === "harian") || dataBuku[0];
    }
    
    if (ditemukan) {
        aturDataAktif(ditemukan, "Hari Ini");
    }
}

function aturDataAktif(item, keteranganStatus) {
    dataAktif = item;
    
    // Set Tampilan Home
    const elDay = document.getElementById("current-day-name");
    const elDate = document.getElementById("current-date-full");
    if (elDay) elDay.innerText = item.namaHari.toUpperCase();
    if (elDate) elDate.innerText = formatTanggalIndo(item.tanggal);

    // Set Badge Keterangan di Halaman Detail
    document.querySelectorAll(".badge-info").forEach(el => {
        el.innerText = `${item.namaHari} (${keteranganStatus})`;
    });
}

// Berpindah antar tampilan halaman
function gantiTampilan(targetView) {
    document.querySelectorAll(".page-view").forEach(el => el.classList.remove("active"));
    
    if (targetView === 'home') {
        document.getElementById("view-home").classList.add("active");
        muatHariIni();
        stopMediaPlayers();
    } else if (targetView === 'minggu') {
        document.getElementById("view-minggu").classList.add("active");
        if (dataAktif) {
            const elMinggu = document.getElementById("info-minggu-aktif");
            if (elMinggu) elMinggu.innerText = `Minggu ke-${dataAktif.minggu}`;
        }
    }
}

// Membuka halaman detail baca, dengar, atau lihat
function bukaHalamanDetail(jenis) {
    if (!dataAktif) return;

    if (jenis === 'baca') {
        document.getElementById("view-baca").classList.add("active");
        muatKontenTeks(dataAktif.text);
    } else if (jenis === 'dengar') {
        document.getElementById("view-dengar").classList.add("active");
        muatAudioPlayer(dataAktif.audio);
    } else if (jenis === 'lihat') {
        document.getElementById("view-lihat").classList.add("active");
        muatVideoPlayer(dataAktif.video);
    }
}

// Memuat Teks FKKP
function muatKontenTeks(fileText) {
    const container = document.getElementById("container-teks");
    if (!container) return;
    
    container.innerHTML = `<p>Memuat file: <b>${fileText}</b>...</p>`;

    fetch(fileText)
        .then(response => {
            if (!response.ok) throw new Error("File teks belum tersedia.");
            return response.text();
        })
        .then(html => {
            container.innerHTML = html;
        })
        .catch(err => {
            container.innerHTML = `<p style="color: #c0392b;">⚠️ File teks <code>${fileText}</code> belum diunggah atau belum tersedia.<br><small>Silakan unggah file dengan nama yang sesuai ke folder web.</small></p>`;
        });
}

// Memuat Audio MP3
function muatAudioPlayer(fileAudio) {
    const infoAudio = document.getElementById("info-file-audio");
    if (infoAudio) infoAudio.innerText = `Memutar: ${fileAudio}`;
    
    const player = document.getElementById("audio-player");
    if (player) {
        player.src = fileAudio;
        player.load();
    }
}

// Memuat Video MP4
function muatVideoPlayer(fileVideo) {
    const infoVideo = document.getElementById("info-file-video");
    if (infoVideo) infoVideo.innerText = `Memutar: ${fileVideo}`;
    
    const player = document.getElementById("video-player");
    if (player) {
        player.src = fileVideo;
        player.load();
    }
}

// Hentikan pemutaran audio/video saat kembali ke home
function stopMediaPlayers() {
    const audio = document.getElementById("audio-player");
    const video = document.getElementById("video-player");
    if (audio) audio.pause();
    if (video) video.pause();
}

// Pemilihan dari menu "Minggu Ini" (7 Tombol)
function pilihHariKhusus(kategori) {
    if (typeof dataBuku === 'undefined') return;
    
    let pilihan;
    if (kategori === 'garis_besar') {
        pilihan = dataBuku.find(item => item.tipe === "garis_besar" && item.minggu === dataAktif.minggu);
    } else {
        pilihan = dataBuku.find(item => item.tipe === "harian" && item.minggu === dataAktif.minggu && item.namaHari.toLowerCase() === kategori.toLowerCase());
    }

    if (pilihan) {
        aturDataAktif(pilihan, `Minggu ${pilihan.minggu}`);
        gantiTampilan('home');
    } else {
        alert("Data untuk hari tersebut belum tersedia.");
    }
}

// Helper format tanggal Indonesia
function formatTanggalIndo(tglStr) {
    const tgl = new Date(tglStr);
    const opsi = { year: 'numeric', month: 'long', day: 'numeric' };
    return tgl.toLocaleDateString('id-ID', opsi);
}