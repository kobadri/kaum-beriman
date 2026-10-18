const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const PROGRAM_START = new Date(2026, 9, 5);
const PROGRAM_WEEKS = 12;
const $ = (selector) => document.querySelector(selector);
const weekSelect = $("#weekSelect");
const dayGrid = $("#dayGrid");
const weekPill = $("#weekPill");
const readingView = $("#readingView");
const readingWeekLabel = $("#readingWeekLabel");
const articleContent = $("#articleContent");
const mediaArea = $("#mediaArea");
let readingZoom = 100;

function localMidnight(date) { return new Date(date.getFullYear(), date.getMonth(), date.getDate()); }
function dayDifference(a, b) { return Math.round((localMidnight(a).getTime() - localMidnight(b).getTime()) / 86400000); }
function formatDate(date) {
  return new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(date);
}
function applyReadingZoom() {
  articleContent.style.fontSize = `${16 * readingZoom / 100}px`;
  articleContent.style.lineHeight = readingZoom >= 140 ? "1.95" : "1.8";
  $("#zoomPercent").textContent = `${readingZoom}%`;
  $("#zoomOut").disabled = readingZoom <= 80;
  $("#zoomIn").disabled = readingZoom >= 180;
}
for (let n = 1; n <= PROGRAM_WEEKS; n++) {
  const option = document.createElement("option");
  option.value = String(n);
  option.textContent = `Pekan Bacaan ${n}`;
  weekSelect.append(option);
}
function getWeek() { return Number(weekSelect.value) || 1; }
function renderWeek() {
  const week = getWeek();
  $("#weekHeading").textContent = `Pekan Bacaan ${week}`;
  weekPill.textContent = `${String(week).padStart(2, "0")} / ${PROGRAM_WEEKS}`;
  dayGrid.replaceChildren();
  DAYS.forEach((day, index) => {
    const button = document.createElement("button");
    button.className = "day-card";
    button.type = "button";
    button.innerHTML = `<span class="day-number">${String(index + 1).padStart(2, "0")}</span><span><strong>${day}</strong><br><small>Bacaan harian</small></span>`;
    button.addEventListener("click", () => openReading(day, week));
    dayGrid.append(button);
  });
}
function openReading(label, week = getWeek()) {
  readingZoom = 100;
  applyReadingZoom();
  readingView.hidden = false;
  $(".reading-section").hidden = true;
  $(".welcome").hidden = true;
  $("#readingTitle").textContent = label;
  $("#readingKicker").textContent = `PEKAN BACAAN ${week}`;
  readingWeekLabel.textContent = `Pekan ${week}`;
  mediaArea.replaceChildren();
  articleContent.replaceChildren();
  const p1 = document.createElement("p");
  const strong = document.createElement("strong");
  strong.textContent = "Materi belum diterbitkan.";
  p1.append(strong);
  const p2 = document.createElement("p");
  p2.textContent = `Bacaan ${label} untuk Pekan Bacaan ${week} akan tampil di sini setelah materi dimasukkan dan diterbitkan.`;
  articleContent.append(p1, p2);
  const notice = document.createElement("p");
  notice.className = "eyebrow";
  notice.textContent = "PDF, audio, atau video akan muncul jika tersedia.";
  mediaArea.append(notice);
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function backToList() {
  readingView.hidden = true;
  $(".reading-section").hidden = false;
  $(".welcome").hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function openToday() {
  const today = localMidnight(new Date());
  $("#todayDate").textContent = formatDate(today);
  $("#todayMessage").textContent = "";
  const offset = dayDifference(today, PROGRAM_START);
  if (offset < 0) {
    $("#todayMessage").textContent = "Program belum dimulai. Bacaan pertama tersedia mulai Senin, 5 Oktober 2026.";
    return;
  }
  const week = Math.floor(offset / 7) + 1;
  const dayIndex = offset % 7;
  if (dayIndex === 6) {
    const nextWeek = week + 1;
    if (nextWeek > PROGRAM_WEEKS) {
      $("#todayMessage").textContent = "Program 12 pekan telah selesai. Tidak ada bacaan berikutnya dalam program ini.";
      return;
    }
    weekSelect.value = String(nextWeek);
    renderWeek();
    $("#todayMessage").textContent = `Membuka Garis Besar untuk Pekan Bacaan ${nextWeek}.`;
    openReading("Garis Besar", nextWeek);
    return;
  }
  if (week > PROGRAM_WEEKS) {
    $("#todayMessage").textContent = "Program 12 pekan telah selesai.";
    return;
  }
  weekSelect.value = String(week);
  renderWeek();
  $("#todayMessage").textContent = `Membuka bacaan hari ini: ${DAYS[dayIndex]}.`;
  openReading(DAYS[dayIndex], week);
}
weekSelect.addEventListener("change", renderWeek);
$("#garisButton").addEventListener("click", () => openReading("Garis Besar"));
$("#backButton").addEventListener("click", backToList);
$("#zoomIn").addEventListener("click", () => { readingZoom = Math.min(180, readingZoom + 10); applyReadingZoom(); });
$("#zoomOut").addEventListener("click", () => { readingZoom = Math.max(80, readingZoom - 10); applyReadingZoom(); });
$("#zoomReset").addEventListener("click", () => { readingZoom = 100; applyReadingZoom(); });
$("#adminLink").addEventListener("click", () => { window.location.href = "./admin.html"; });
$("#todayButton").addEventListener("click", openToday);
$("#todayDate").textContent = formatDate(new Date());
renderWeek();
applyReadingZoom();
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js").catch(() => {}));
}
