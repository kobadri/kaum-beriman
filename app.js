let hariAktif = "Senin";

function gantiTampilan(n) {
    document.querySelectorAll(".page-view").forEach(e => e.classList.remove("active"));
    if (n === "minggu") {
        document.getElementById("view-minggu").classList.add("active");
    } else if (n === "home") {
        muatKontenAktif();
        document.getElementById("view-home").classList.add("active");
    }
}

function pilihHariKhusus(k) {
    hariAktif = k;
    muatKontenAktif();
    document.querySelectorAll(".page-view").forEach(e => e.classList.remove("active"));
    document.getElementById("view-home").classList.add("active");
}

function bukaHariIni() {
    const d = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    let h = d[new Date().getDay()];
    if (h === "Minggu") h = "Senin";
    hariAktif = h;
    muatKontenAktif();
    document.querySelectorAll(".page-view").forEach(e => e.classList.remove("active"));
    document.getElementById("view-home").classList.add("active");
}

function bukaHalamanDetail(t) {
    muatKontenAktif();
    document.querySelectorAll(".page-view").forEach(e => e.classList.remove("active"));
    if (t === "baca") {
        document.getElementById("view-baca").classList.add("active");
    } else if (t === "dengar") {
        document.getElementById("view-dengar").classList.add("active");
    } else if (t === "lihat") {
        document.getElementById("view-lihat").classList.add("active");
    }
}

function muatKontenAktif() {
    const dt = jadwalMateri[hariAktif] || jadwalMateri["Senin"];
    
    let labelHeader = "GARIS BESAR";
    if (hariAktif !== "garis_besar") {
        labelHeader = hariAktif.toUpperCase();
    }
    document.getElementById("current-day-name").innerText = labelHeader;
    
    const ct = document.getElementById("container-teks");
    ct.innerHTML = "<p>Memuat teks bacaan...</p>";
    
    fetch(dt.teks)
        .then(r => {
            if (!r.ok) throw new Error();
            return r.text();
        })
        .then(h => {
            ct.innerHTML = h;
        })
        .catch(() => {
            ct.innerHTML = `<p style="color:red;">Gagal memuat file teks (${dt.teks}). Pastikan file HTML tersedia.</p>`;
        });

    const ap = document.getElementById("audio-player");
    const ia = document.getElementById("info-file-audio");
    if (dt.audio) {
        ap.src = dt.audio;
        ia.innerText = `Memutar: ${dt.audio}`;
    } else {
        ap.src = "";
        ia.innerText = "Tidak ada audio untuk bagian ini.";
    }

    const vp = document.getElementById("video-player");
    const iv = document.getElementById("info-file-video");
    if (dt.video) {
        vp.src = dt.video;
        iv.innerText = `Memutar: ${dt.video}`;
    } else {
        vp.src = "";
        iv.innerText = "Tidak ada video untuk bagian ini.";
    }

    document.getElementById("badge-baca").innerText = dt.label;
    document.getElementById("badge-dengar").innerText = dt.label;
    document.getElementById("badge-lihat").innerText = dt.label;
}