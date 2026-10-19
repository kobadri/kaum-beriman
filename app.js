(() => {
"use strict";
const DAYS=["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"], START=new Date(2026,9,5), WEEKS=12;
const $=s=>document.querySelector(s), weekSelect=$("#weekSelect"), dayGrid=$("#dayGrid"), homeView=$("#homeView"), listView=$("#listView"), readingView=$("#readingView"), articleContent=$("#articleContent");
let currentWeek=1, readingZoom=100;
const midnight=d=>new Date(d.getFullYear(),d.getMonth(),d.getDate());
const diff=(a,b)=>Math.round((midnight(a)-midnight(b))/86400000);
const formatDate=d=>new Intl.DateTimeFormat("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(d);
function todayTarget(now=new Date()){
 const offset=diff(now,START); if(offset<0)return{status:"before"};
 const wi=Math.floor(offset/7), di=offset%7; if(wi>=WEEKS)return{status:"after"};
 if(di===6)return wi+1<WEEKS?{status:"outline",week:wi+2}:{status:"after"};
 return{status:"day",week:wi+1,day:di};
}
function updateToday(){
 const now=new Date(), target=todayTarget(now); $("#todayDate").textContent=formatDate(now);
 const msg=$("#todayMessage");
 if(target.status==="before")msg.textContent="Program dimulai Senin, 5 Oktober 2026.";
 else if(target.status==="after")msg.textContent="Program 12 pekan telah selesai. Pilih pekan bacaan di bawah untuk membuka materi.";
 else if(target.status==="outline")msg.textContent=`Hari ini persiapan untuk Pekan Bacaan ${target.week}. Pilih Garis Besar pada pekan tersebut di bawah.`;
 else msg.textContent=`Bacaan hari ini: ${DAYS[target.day]}, Pekan Bacaan ${target.week}. Pilih ${DAYS[target.day]} pada daftar di bawah.`;
}
function renderWeek(week){
 currentWeek=Number(week); weekSelect.value=String(currentWeek); $("#weekHeading").textContent=`Pekan Bacaan ${currentWeek}`; $("#weekPill").textContent=`${String(currentWeek).padStart(2,"0")} / ${WEEKS}`;
 $("#garisButton").dataset.week=String(currentWeek); dayGrid.replaceChildren();
 DAYS.forEach((day,i)=>{const b=document.createElement("button"); b.type="button"; b.className="day-card"; b.dataset.day=String(i); b.innerHTML=`<span class="day-number">${String(i+1).padStart(2,"0")}</span><strong>${day}</strong><small>Bacaan harian</small>`; dayGrid.appendChild(b);});
}
function applyZoom(){articleContent.style.fontSize=`${16*readingZoom/100}px`;articleContent.style.lineHeight=readingZoom>=140?"1.95":"1.75";$("#zoomPercent").textContent=`${readingZoom}%`;$("#zoomOut").disabled=readingZoom<=80;$("#zoomIn").disabled=readingZoom>=180;}
function openReading(kind,week,day=null){
 const n=Number(week), title=kind==="outline"?"Garis Besar":DAYS[Number(day)];
 $("#readingWeekLabel").textContent=`Pekan ${n}`;$("#readingKicker").textContent=`PEKAN BACAAN ${n}`;$("#readingTitle").textContent=title;
 articleContent.innerHTML=`<div class="notice-panel"><strong>Materi belum tersedia</strong><p>Bagian ini disiapkan untuk Pekan Bacaan ${n} — ${title}.</p><p>Naskah dan audio asli belum dimasukkan. Isi buku tidak dikarang agar tetap sesuai sumber.</p></div>`;
 $("#mediaArea").replaceChildren();readingZoom=100;applyZoom();homeView.hidden=true;listView.hidden=true;readingView.hidden=false;document.title=`${title} — Pekan ${n} | Penyegaran Pagi - FKKP`;window.scrollTo(0,0);
}
function back(){readingView.hidden=true;homeView.hidden=false;listView.hidden=false;document.title="Penyegaran Pagi - FKKP";window.scrollTo(0,0);}
for(let i=1;i<=WEEKS;i++){const o=document.createElement("option");o.value=String(i);o.textContent=`Pekan Bacaan ${i}`;weekSelect.appendChild(o);}
renderWeek(1);updateToday();weekSelect.addEventListener("change",()=>renderWeek(weekSelect.value));
$("#garisButton").addEventListener("click",()=>openReading("outline",currentWeek));
dayGrid.addEventListener("click",e=>{const b=e.target.closest("button.day-card");if(b)openReading("day",currentWeek,b.dataset.day);});
$("#backButton").addEventListener("click",back);
$("#zoomOut").addEventListener("click",()=>{readingZoom=Math.max(80,readingZoom-10);applyZoom();});
$("#zoomIn").addEventListener("click",()=>{readingZoom=Math.min(180,readingZoom+10);applyZoom();});
$("#zoomReset").addEventListener("click",()=>{readingZoom=100;applyZoom();});
$("#downloadPdf").addEventListener("click",()=>window.print());
window.addEventListener("afterprint",()=>{document.title="Penyegaran Pagi - FKKP";});
const t=todayTarget();if(t.week&&t.week<=WEEKS)renderWeek(t.week);
if("serviceWorker" in navigator && location.protocol!=="file:"){window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(err=>console.warn("PWA offline belum aktif:",err)));}
})();