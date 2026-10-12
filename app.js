let dataAktif = null;

document.addEventListener("DOMContentLoaded", () => {
    muatHariIni();
});

// Deteksi otomatis hari ini berdasarkan sistem
function muatHariIni() {
    if (typeof dataBuku !== 'undefined' && dataBuku.length > 0) {
        const sekarang = new Date();
        const tahun = sekarang.getFullYear();
        const bulan = String(sekarang.getMonth() + 1).padStart(2, '0');
        const tanggal = String(sekarang.getDate()).padStart(2, '0');
        const formatHariIni = `${tahun}-${bulan}-${tanggal}`;

        let ditemukan = dataBuku.find(item => item.tanggal === formatHariIni);
        if (!ditemukan) {
            ditemukan = dataBuku[0]; // Fallback ke data pertama jika tanggal tidak cocok
        }
        aturDataAktif(ditemukan, "Hari Ini");
    } else {
        // Fallback jika dataBuku belum dimuat
        const elHari = document.getElementById("current-day-name");
        if (elHari) elHari.innerText = "HARI INI";
    }
}

function aturDataAktif(item, keteranganStatus) {
    dataAktif = item;
    
    // Set Tampilan Home
    const elHari = document.getElementById("current-day-name");
    const elTgl = document.getElementById("current-date-full");
    if (elHari) elHari.innerText = item.namaHari.toUpperCase();
    if (elTgl) elTgl.innerText = formatTanggalIndo(item.tanggal);

    // Set Badge Keterangan di Halaman Detail
    document.querySelectorAll(".badge-info").forEach(el => {
        el.innerText = `${item.namaHari} (${keteranganStatus})`;
    });
}

// Berpindah antar tampilan halaman
function gantiTampilan(targetView) {
    document.querySelectorAll(".page-view").forEach(el => el.classList.remove("active"));
    
    if (targetView === 'home') {
        const viewHome = document.getElementById("view-home");
        if (viewHome) viewHome.classList.add("active");
        stopMediaPlayers();
    } else if (targetView === 'minggu') {
        const viewMinggu = document.getElementById("view-minggu");
        if (viewMinggu) viewMinggu.classList.add("active");
        if (dataAktif) {
            const elInfoMinggu = document.getElementById("info-minggu-aktif");
            if (elInfoMinggu) elInfoMinggu.innerText = `Minggu ke-${dataAktif.minggu || 1}`;
        }
    }
}

// Membuka halaman detail baca, dengar, atau lihat
function bukaHalamanDetail(jenis) {
    if (!dataAktif) {
        alert("Data materi belum siap.");
        return;
    }

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

    if (!fileText) {
        container.innerHTML = `<p style="color: #c0392b;">⚠️ File teks belum tersedia.</p>`;
        return;
    }

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
    if (infoAudio) infoAudio.innerText = `Memutar: ${fileAudio || 'Tidak ada audio'}`;
    
    const player = document.getElementById("audio-player");
    if (player && fileAudio) {
        player.src = fileAudio;
        player.load();
    }
}

// Memuat Video MP4
function muatVideoPlayer(fileVideo) {
    const infoVideo = document.getElementById("info-file-video");
    if (infoVideo) infoVideo.innerText = `Memutar: ${fileVideo || 'Tidak ada video'}`;
    
    const player = document.getElementById("video-player");
    if (player && fileVideo) {
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
    if (typeof dataBuku === 'undefined') {
        alert("Data buku belum dimuat.");
        return;
    }

    let pilihan;
    const mingguAktif = dataAktif ? dataAktif.minggu : 1;

    if (kategori === 'garis_besar') {
        pilihan = dataBuku.find(item => item.tipe === "garis_besar" && item.minggu === mingguAktif);
    } else {
        pilihan = dataBuku.find(item => item.tipe === "harian" && item.minggu === mingguAktif && item.namaHari.toLowerCase() === kategori.toLowerCase());
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
    if (!tglStr) return "";
    const tgl = new Date(tglStr);
    const opsi = { year: 'numeric', month: 'long', day: 'numeric' };
    return tgl.toLocaleDateString('id-ID', opsi);
}