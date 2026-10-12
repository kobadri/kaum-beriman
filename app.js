let dataAktif = null;

document.addEventListener("DOMContentLoaded", () => {
    muatHariIni();
});

// Set default data ke hari Senin atau item pertama dari dataBuku
function muatHariIni() {
    if (typeof dataBuku !== 'undefined' && dataBuku.length > 0) {
        // Ambil data pertama sebagai default aktif
        aturDataAktif(dataBuku[0], "Hari Ini");
    } else {
        console.warn("dataBuku belum dimuat dari data.js");
    }
}

function aturDataAktif(item, keteranganStatus) {
    dataAktif = item;
    
    // Set Tampilan Home
    const elHari = document.getElementById("current-day-name");
    const elTgl = document.getElementById("current-date-full");
    if (elHari) elHari.innerText = (item.namaHari || item.tipe || "Materi").toUpperCase();
    if (elTgl) elTgl.innerText = item.judul || keteranganStatus;

    // Set Badge Keterangan di Halaman Detail
    document.querySelectorAll(".badge-info").forEach(el => {
        el.innerText = `${item.namaHari || ''} (${keteranganStatus})`;
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
    }
}

// Membuka halaman detail baca, dengar, atau lihat
function bukaHalamanDetail(jenis) {
    if (!dataAktif) {
        // Fallback data default jika dataAktif kosong
        dataAktif = {
            judul: "Materi Penyegaran Pagi",
            subjudul: "FKKP",
            text: "Materi teks sedang dipersiapkan.",
            audio: "",
            video: ""
        };
    }

    if (jenis === 'baca') {
        const viewBaca = document.getElementById("view-baca");
        if (viewBaca) viewBaca.classList.add("active");
        muatKontenTeks(dataAktif.text);
    } else if (jenis === 'dengar') {
        const viewDengar = document.getElementById("view-dengar");
        if (viewDengar) viewDengar.classList.add("active");
        muatAudioPlayer(dataAktif.audio);
    } else if (jenis === 'lihat') {
        const viewLihat = document.getElementById("view-lihat");
        if (viewLihat) viewLihat.classList.add("active");
        muatVideoPlayer(dataAktif.video);
    }
}

// Memuat Teks FKKP
function muatKontenTeks(teksAtauFile) {
    const container = document.getElementById("container-teks");
    if (!container) return;

    if (!teksAtauFile) {
        container.innerHTML = `<p style="color: #666;">Belum ada teks bacaan untuk sesi ini.</p>`;
        return;
    }

    // Jika berupa string teks langsung atau HTML
    if (!teksAtauFile.endsWith && !teksAtauFile.endsWith(".html") && !teksAtauFile.endsWith(".txt")) {
        container.innerHTML = `<div>${teksAtauFile}</div>`;
        return;
    }

    container.innerHTML = `<p>Memuat file: <b>${teksAtauFile}</b>...</p>`;

    fetch(teksAtauFile)
        .then(response => {
            if (!response.ok) throw new Error("File teks belum tersedia.");
            return response.text();
        })
        .then(html => {
            container.innerHTML = html;
        })
        .catch(err => {
            container.innerHTML = `<div><h3>${dataAktif.judul || 'Bacaan'}</h3><p>${dataAktif.text || 'Konten materi tersedia di sini.'}</p></div>`;
        });
}

// Memuat Audio MP3
function muatAudioPlayer(fileAudio) {
    const infoAudio = document.getElementById("info-file-audio");
    if (infoAudio) infoAudio.innerText = fileAudio ? `Memutar: ${fileAudio}` : "File audio belum tersedia untuk sesi ini.";
    
    const player = document.getElementById("audio-player");
    if (player && fileAudio) {
        player.src = fileAudio;
        player.load();
    }
}

// Memuat Video MP4
function muatVideoPlayer(fileVideo) {
    const infoVideo = document.getElementById("info-file-video");
    if (infoVideo) infoVideo.innerText = fileVideo ? `Memutar: ${fileVideo}` : "File video belum tersedia untuk sesi ini.";
    
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
    if (audio) { audio.pause(); audio.currentTime = 0; }
    if (video) { video.pause(); video.currentTime = 0; }
}

// Pemilihan dari menu "Minggu Ini" (7 Tombol)
function pilihHariKhusus(kategori) {
    if (typeof dataBuku === 'undefined') {
        alert("Data buku belum dimuat.");
        return;
    }

    let pilihan;
    if (kategori === 'garis_besar') {
        pilihan = dataBuku.find(item => item.tipe === "garis_besar");
    } else {
        pilihan = dataBuku.find(item => item.tipe === "harian" && item.namaHari && item.namaHari.toLowerCase() === kategori.toLowerCase());
    }

    if (pilihan) {
        aturDataAktif(pilihan, `Pilihan ${pilihan.namaHari || kategori}`);
        gantiTampilan('home');
    } else {
        // Fallback fleksibel jika pencarian string pas
        aturDataAktif({
            namaHari: kategori,
            judul: `Materi ${kategori}`,
            text: `Konten materi untuk ${kategori} sedang disiapkan.`,
            audio: "",
            video: ""
        }, kategori);
        gantiTampilan('home');
    }
}

// Helper format tanggal Indonesia
function formatTanggalIndo(tglStr) {
    if (!tglStr) return "";
    const tgl = new Date(tglStr);
    const opsi = { year: 'numeric', month: 'long', day: 'numeric' };
    return tgl.toLocaleDateString('id-ID', opsi);
}