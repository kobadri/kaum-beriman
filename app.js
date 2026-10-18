(() => {
  "use strict";

  const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const START = new Date(2026, 9, 5); // 5 Oktober 2026, waktu lokal
  const WEEKS = 12;
  const $ = (selector) => document.querySelector(selector);
  const dayGrid = $("#dayGrid");
  const weekSelect = $("#weekSelect");
  let selectedWeek = 1;
  let zoom = 100;

  function localMidnight(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function dayDifference(a, b) {
    return Math.round((localMidnight(a).getTime() - localMidnight(b).getTime()) / 86400000);
  }

  function formatDate(date) {
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long", day: "numeric", month: "long", year: "numeric"
    }).format(date);
  }

  function fileBase(week, key) {
    const number = String(week).padStart(2, "0");
    return `media/S_${number}_${key}.mp3`;
  }

  function renderWeek(week) {
    selectedWeek = Math.max(1, Math.min(WEEKS, Number(week) || 1));
    weekSelect.value = String(selectedWeek);
    $("#weekHeading").textContent = `Pekan Bacaan ${selectedWeek}`;
    $("#weekPill").textContent = `${String(selectedWeek).padStart(2, "0")} / ${WEEKS}`;
    dayGrid.replaceChildren();

    DAYS.forEach((day, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "day-card";
      button.innerHTML = `<span class="day-number">${String(index + 1).padStart(2, "0")}</span>
        <span><strong>${day}</strong><br><small>Bacaan harian</small></span>`;
      button.addEventListener("click", () => openReading(selectedWeek, day, fileBase(selectedWeek, day)));
      dayGrid.appendChild(button);
    });
  }

  function openReading(week, title, mediaPath, isOutline = false) {
    $("#readingList").hidden = true;
    $(".welcome").hidden = true;
    $("#readingView").hidden = false;
    $("#readingWeekLabel").textContent = `Pekan ${week}`;
    $("#readingKicker").textContent = `PEKAN BACAAN ${week}`;
    $("#readingTitle").textContent = title;
    $("#articleContent").innerHTML = `<p>Materi teks untuk <strong>${title}</strong>, Pekan Bacaan ${week}, belum dimasukkan ke aplikasi.</p>
      <p>Jika berkas audio asli sudah diunggah ke folder <code>media</code> dengan nama yang sesuai, audio dapat diputar di bawah.</p>`;
    $("#mediaArea").replaceChildren();

    const audio = document.createElement("audio");
    audio.controls = true;
    audio.preload = "none";
    audio.src = mediaPath;
    audio.addEventListener("error", () => {
      if (audio.parentNode) {
        const note = document.createElement("p");
        note.className = "media-note";
        note.textContent = "Audio belum tersedia pada alamat ini. Pastikan berkas audio diunggah ke folder media dengan nama yang sesuai.";
        $("#mediaArea").appendChild(note);
      }
    }, { once: true });
    $("#mediaArea").appendChild(audio);
    applyZoom();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function backToList() {
    $("#readingView").hidden = true;
    $("#readingList").hidden = false;
    $(".welcome").hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openToday() {
    const today = localMidnight(new Date());
    const offset = dayDifference(today, START);
    const message = $("#todayMessage");
    message.textContent = "";

    if (offset < 0) {
      message.textContent = "Program belum dimulai. Bacaan pertama dimulai Senin, 5 Oktober 2026.";
      return;
    }

    const calendarWeek = Math.floor(offset / 7) + 1;
    const dayOfWeek = offset % 7;

    if (calendarWeek > WEEKS || (calendarWeek === WEEKS && dayOfWeek === 6)) {
      message.textContent = "Program 12 pekan telah selesai. Silakan pilih pekan bacaan yang ingin dibuka.";
      return;
    }

    if (dayOfWeek === 6) {
      const nextWeek = calendarWeek + 1;
      if (nextWeek > WEEKS) {
        message.textContent = "Program 12 pekan telah selesai. Silakan pilih pekan bacaan yang ingin dibuka.";
        return;
      }
      renderWeek(nextWeek);
      openReading(nextWeek, "Garis Besar", fileBase(nextWeek, "garis_besar"), true);
      return;
    }

    renderWeek(calendarWeek);
    const day = DAYS[dayOfWeek];
    openReading(calendarWeek, day, fileBase(calendarWeek, day));
  }

  function applyZoom() {
    $("#articleContent").style.fontSize = `${16 * zoom / 100}px`;
    $("#articleContent").style.lineHeight = zoom >= 140 ? "1.95" : "1.8";
    $("#zoomPercent").textContent = `${zoom}%`;
    $("#zoomOut").disabled = zoom <= 80;
    $("#zoomIn").disabled = zoom >= 180;
  }

  for (let week = 1; week <= WEEKS; week++) {
    const option = document.createElement("option");
    option.value = String(week);
    option.textContent = `Pekan Bacaan ${week}`;
    weekSelect.appendChild(option);
  }

  $("#todayDate").textContent = formatDate(new Date());
  renderWeek(1);
  $("#todayButton").addEventListener("click", openToday);
  $("#weekSelect").addEventListener("change", () => renderWeek(weekSelect.value));
  $("#garisButton").addEventListener("click", () =>
    openReading(selectedWeek, "Garis Besar", fileBase(selectedWeek, "garis_besar"), true));
  $("#backButton").addEventListener("click", backToList);
  $("#zoomOut").addEventListener("click", () => { zoom = Math.max(80, zoom - 10); applyZoom(); });
  $("#zoomIn").addEventListener("click", () => { zoom = Math.min(180, zoom + 10); applyZoom(); });
  $("#zoomReset").addEventListener("click", () => { zoom = 100; applyZoom(); });
  $("#adminLink").addEventListener("click", () => { window.location.href = "./admin.html"; });
  applyZoom();
})();