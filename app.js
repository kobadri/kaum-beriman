let dataAktif = null;

document.addEventListener("DOMContentLoaded", () => {
    if (typeof dataBuku !== 'undefined' && dataBuku.length > 0) {
        aturDataAktif(dataBuku[0], "Hari Ini");
    }
});

function aturDataAktif(item, keterangan) {
    dataAktif = item;
    const elHari = document.getElementById("current-day-name");
    const elTgl = document.getElementById("current-date-full");
    if (elHari) elHari.innerText = (item.namaHari || "SENIN").toUpperCase();
    if (elTgl) elTgl.innerText = item.tanggal || keterangan;

    document.querySelectorAll(".badge-info").forEach(el => {
        el.innerText = `${item.namaHari || ''} (${keterangan})`;
    });
}

function gantiTampilan(targetView) {
    document.querySelectorAll(".page-view").forEach(el => el.classList.remove("active"));
    const target = document.getElementById(`view-${targetView}`);
    if (target) {
        target.classList.add("active");
    }
    if (targetView === 'home') {
        const audio = document.getElementById("audio-player");
        const video = document.getElementById("video-player");
        if (audio) { audio.pause(); audio.currentTime = 0; }
        if (video) { video.pause(); video.currentTime = 0; }
    }
}

function bukaHalamanDetail(jenis) {
    const data = dataAktif || {
        judul: "Materi FKKP",
        text: "Konten bacaan belum tersedia.",
        audio: "",
        video: ""
    };

    if (jenis === 'baca') {
        document.getElementById("view-baca").classList.add("active");
        const container = document.getElementById("container-teks");
        if (container) {
            container.innerHTML = `<p>${data.text || 'Bacaan FKKP'}</p>`;
        }
    } else if (jenis === 'dengar') {
        document.getElementById("view-dengar").classList.add("active");
        const info = document.getElementById("info-file-audio");
        const player = document.getElementById("audio-player");
        if (info) info.innerText = data.audio ? `Memutar: ${data.audio}` : "File audio belum tersedia.";
        if (player && data.audio) {
            player.src = data.audio;
            player.load();
        }
    } else if (jenis === 'lihat') {
        document.getElementById("view-lihat").classList.add("active");
        const info = document.getElementById("info-file-video");
        const player = document.getElementById("video-player");
        if (info) info.innerText = data.video ? `Memutar: ${data.video}` : "File video belum tersedia.";
        if (player && data.video) {
            player.src = data.video;
            player.load();
        }
    }
}

function pilihHariKhusus(kategori) {
    if (typeof dataBuku !== 'undefined') {
        let pilihan = dataBuku.find(item => item.namaHari && item.namaHari.toLowerCase() === kategori.toLowerCase());
        if (pilihan) {
            aturDataAktif(pilihan, pilihan.tanggal);
        }
    }
    gantiTampilan('home');
}