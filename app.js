const DAYS = ["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
const weekSelect = document.querySelector("#weekSelect");
const dayGrid = document.querySelector("#dayGrid");
const weekHeading = document.querySelector("#weekHeading");
const weekPill = document.querySelector("#weekPill");
const readingView = document.querySelector("#readingView");
const readingTitle = document.querySelector("#readingTitle");
const readingKicker = document.querySelector("#readingKicker");
const readingWeekLabel = document.querySelector("#readingWeekLabel");
const articleContent = document.querySelector("#articleContent");
const mediaArea = document.querySelector("#mediaArea");
let currentWeek = 1;
let readingZoom = 100;
const PROGRAM_START = new Date(2026, 9, 5); // Senin, 5 Oktober 2026
const PROGRAM_DAYS = 12 * 7;

function applyReadingZoom(){
  articleContent.style.fontSize = `${16 * readingZoom / 100}px`;
  articleContent.style.lineHeight = readingZoom >= 140 ? "1.95" : "1.8";
  document.querySelector("#zoomPercent").textContent = `${readingZoom}%`;
  document.querySelector("#zoomOut").disabled = readingZoom <= 80;
  document.querySelector("#zoomIn").disabled = readingZoom >= 180;
}

for(let n=1;n<=12;n++){
  const option=document.createElement("option");
  option.value=String(n);
  option.textContent=`Pekan Bacaan ${n}`;
  weekSelect.append(option);
}

function getWeek(){return Number(weekSelect.value)||1}
function dateAtLocalMidnight(date){return new Date(date.getFullYear(),date.getMonth(),date.getDate())}
function formatDateId(date){return new Intl.DateTimeFormat("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(date)}
function updateTodayButton(){
  const now=dateAtLocalMidnight(new Date());
  document.querySelector("#todayDate").textContent=formatDateId(now);
  const daysSinceStart=Math.round((now-PROGRAM_START)/86400000);
  const dayIndex=(now.getDay()+6)%7; // Senin=0 ... Minggu=6
  const hint=document.querySelector("#todayHint");
  if(daysSinceStart<0){hint.textContent="Buka Garis Besar Pekan Bacaan 1";return}
  if(daysSinceStart>=PROGRAM_DAYS){hint.textContent="Program 12 pekan telah selesai";return}
  const week=Math.floor(daysSinceStart/7)+1;
  if(dayIndex===6){
    hint.textContent=week<12?`Persiapan untuk Pekan Bacaan ${week+1} · Garis Besar`:`Garis Besar Pekan Bacaan ${week}`;
  }else{
    hint.textContent=`Bacaan ${DAYS[dayIndex]} · Pekan Bacaan ${week}`;
  }
}
function openToday(){
  const now=dateAtLocalMidnight(new Date());
  const daysSinceStart=Math.round((now-PROGRAM_START)/86400000);
  const dayIndex=(now.getDay()+6)%7; // Senin=0 ... Minggu=6
  if(daysSinceStart<0){weekSelect.value="1";renderWeek();openReading("Garis Besar",1);return}
  if(daysSinceStart>=PROGRAM_DAYS){
    alert("Program bacaan 12 pekan telah selesai. Materi berakhir pada Sabtu, 26 Desember 2026.");
    return;
  }
  let week=Math.floor(daysSinceStart/7)+1;
  let label;
  if(dayIndex===6){
    if(week<12)week+=1;
    label="Garis Besar";
  }else{
    label=DAYS[dayIndex];
  }
  weekSelect.value=String(week);
  renderWeek();
  openReading(label,week);
}
function renderWeek(){
  currentWeek=getWeek();
  weekHeading.textContent=`Pekan Bacaan ${currentWeek}`;
  weekPill.textContent=`${String(currentWeek).padStart(2,"0")} / 12`;
  dayGrid.replaceChildren();
  DAYS.forEach((day,index)=>{
    const button=document.createElement("button");
    button.className="day-card";
    button.type="button";
    button.innerHTML=`<span class="day-number">${String(index+1).padStart(2,"0")}</span><span><strong>${day}</strong><br><small>Bacaan harian</small></span>`;
    button.addEventListener("click",()=>openReading(day));
    dayGrid.append(button);
  });
}
function openReading(label, weekOverride){
  const week=weekOverride||getWeek();
  weekSelect.value=String(week);
  readingZoom = 100;
  applyReadingZoom();
  readingView.hidden=false;
  document.querySelector(".reading-section").hidden=true;
  document.querySelector(".welcome").hidden=true;
  readingTitle.textContent=label;
  readingKicker.textContent=`PEKAN BACAAN ${week}`;
  readingWeekLabel.textContent=`Pekan ${week}`;
  mediaArea.replaceChildren();
  // Materi nyata akan dimuat dari data yang diterbitkan setelah backend terhubung.
  articleContent.innerHTML=`<p><strong>Materi belum diterbitkan.</strong></p><p>Bacaan ${label==="Garis Besar"?"Garis Besar":label} untuk Pekan Bacaan ${week} akan tampil di sini setelah materi dimasukkan melalui Admin Editor dan diterbitkan.</p>`;
  const mediaNotice=document.createElement("p");
  mediaNotice.className="eyebrow";
  mediaNotice.textContent="PDF, audio, atau video akan muncul jika tersedia.";
  mediaArea.append(mediaNotice);
  window.scrollTo({top:0,behavior:"smooth"});
}
function backToList(){
  readingView.hidden=true;
  document.querySelector(".reading-section").hidden=false;
  document.querySelector(".welcome").hidden=false;
  window.scrollTo({top:0,behavior:"smooth"});
}
weekSelect.addEventListener("change",renderWeek);
document.querySelector("#todayButton").addEventListener("click",openToday);
document.querySelector("#garisButton").addEventListener("click",()=>openReading("Garis Besar"));
document.querySelector("#backButton").addEventListener("click",backToList);
document.querySelector("#zoomIn").addEventListener("click",()=>{readingZoom=Math.min(180,readingZoom+10);applyReadingZoom()});
document.querySelector("#zoomOut").addEventListener("click",()=>{readingZoom=Math.max(80,readingZoom-10);applyReadingZoom()});
document.querySelector("#zoomReset").addEventListener("click",()=>{readingZoom=100;applyReadingZoom()});
document.querySelector("#adminLink").addEventListener("click",()=>{window.location.href="./admin.html"});
renderWeek();
updateTodayButton();
applyReadingZoom();
if("serviceWorker" in navigator && location.protocol!=="file:"){window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));}
