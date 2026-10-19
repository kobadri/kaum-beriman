(() => {
"use strict";
const DAYS=["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"], KEYS=["monday","tuesday","wednesday","thursday","friday","saturday"], START=new Date(2026,9,5), WEEKS=12;
const $=s=>document.querySelector(s), weekSelect=$("#weekSelect"), dayGrid=$("#dayGrid"), homeView=$("#homeView"), listView=$("#listView"), readingView=$("#readingView"), articleContent=$("#articleContent");
let currentWeek=1, readingZoom=100, supabaseClient=null, materials=new Map(), assets=new Map();
const midnight=d=>new Date(d.getFullYear(),d.getMonth(),d.getDate());
const diff=(a,b)=>Math.round((midnight(a)-midnight(b))/86400000);
const formatDate=d=>new Intl.DateTimeFormat("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(d);
function key(week,section){return String(week)+":"+section;}
function safeHtml(html){
 const template=document.createElement("template");template.innerHTML=String(html||"");
 template.content.querySelectorAll("script,style,iframe,object,embed,form,svg,math,link,meta").forEach(n=>n.remove());
 template.content.querySelectorAll("*").forEach(el=>{
  [...el.attributes].forEach(a=>{
   const name=a.name.toLowerCase(), value=a.value.trim().toLowerCase();
   if(name.startsWith("on")||name==="srcdoc"||((name==="href"||name==="src")&&(value.startsWith("javascript:")||value.startsWith("data:text/html"))))el.removeAttribute(a.name);
  });
  if(el.tagName==="A"){el.setAttribute("rel","noopener noreferrer");el.setAttribute("target","_blank");}
 });
 return template.innerHTML;
}
function targetToday(now=new Date()){
 const offset=diff(now,START);if(offset<0)return{status:"before"};const wi=Math.floor(offset/7),di=offset%7;if(wi>=WEEKS)return{status:"after"};if(di===6)return wi+1<WEEKS?{status:"outline",week:wi+2}:{status:"after"};return{status:"day",week:wi+1,day:di};
}
function updateToday(){const now=new Date(),t=targetToday(now);$("#todayDate").textContent=formatDate(now);const msg=$("#todayMessage");if(t.status==="before")msg.textContent="Program dimulai Senin, 5 Oktober 2026.";else if(t.status==="after")msg.textContent="Program 12 pekan telah selesai. Pilih pekan bacaan di bawah.";else if(t.status==="outline")msg.textContent=`Hari ini persiapan untuk Pekan Bacaan ${t.week}. Pilih Garis Besar pada pekan tersebut.`;else msg.textContent=`Bacaan hari ini: ${DAYS[t.day]}, Pekan Bacaan ${t.week}. Pilih ${DAYS[t.day]} di bawah.`;}
function renderWeek(week){currentWeek=Number(week);weekSelect.value=String(currentWeek);$("#weekHeading").textContent=`Pekan Bacaan ${currentWeek}`;$("#weekPill").textContent=`${String(currentWeek).padStart(2,"0")} / ${WEEKS}`;$("#garisButton").dataset.week=String(currentWeek);dayGrid.replaceChildren();DAYS.forEach((day,i)=>{const b=document.createElement("button");b.type="button";b.className="day-card";b.dataset.day=String(i);const n=document.createElement("span");n.className="day-number";n.textContent=String(i+1).padStart(2,"0");const strong=document.createElement("strong");strong.textContent=day;const small=document.createElement("small");small.textContent=(materials.has(key(currentWeek,KEYS[i]))||assets.has(key(currentWeek,KEYS[i])))?"Bacaan tersedia":"Bacaan harian";b.append(n,strong,small);dayGrid.appendChild(b);});}
function applyZoom(){articleContent.style.fontSize=`${16*readingZoom/100}px`;articleContent.style.lineHeight=readingZoom>=140?"1.95":"1.75";$("#zoomPercent").textContent=`${readingZoom}%`;$("#zoomOut").disabled=readingZoom<=80;$("#zoomIn").disabled=readingZoom>=180;}
function mediaLink(url,label,kind){if(!url)return;const wrap=document.createElement("div");wrap.className="media-item";if(kind==="audio"||kind==="video"){const el=document.createElement(kind);el.controls=true;el.preload="metadata";el.src=url;el.style.width="100%";wrap.appendChild(el);}else{const a=document.createElement("a");a.href=url;a.target="_blank";a.rel="noopener noreferrer";a.textContent=label;a.className="pdf-button";wrap.appendChild(a);}$("#mediaArea").appendChild(wrap);}
function openReading(kind,week,day=null){
 const section=kind==="outline"?"outline":KEYS[Number(day)],title=kind==="outline"?"Garis Besar":DAYS[Number(day)],n=Number(week),material=materials.get(key(n,section));
 $("#readingWeekLabel").textContent=`Pekan ${n}`;$("#readingKicker").textContent=`PEKAN BACAAN ${n}`;$("#readingTitle").textContent=material?.title||title;
 if(material){articleContent.innerHTML=safeHtml(material.content_html);if(!articleContent.textContent.trim()&&!articleContent.querySelector("img"))articleContent.textContent="Materi ini belum memiliki isi."; }
 else articleContent.innerHTML=`<div class="notice-panel"><strong>Materi belum tersedia</strong><p>Bagian ini disiapkan untuk Pekan Bacaan ${n} — ${title}.</p><p>Naskah asli belum diterbitkan. Isi buku tidak dikarang agar tetap sesuai sumber.</p></div>`;
 $("#mediaArea").replaceChildren();if(material){mediaLink(material.pdf_url,"Buka PDF bacaan","pdf");mediaLink(material.audio_url,"Audio bacaan","audio");mediaLink(material.video_url,"Video bacaan","video");}const publishedAssets=assets.get(key(n,section))||[];publishedAssets.forEach(asset=>{const label=asset.original_name||asset.stored_name||"Buka file";if(asset.asset_type==="audio")mediaLink(asset.public_url,label,"audio");else if(asset.asset_type==="video")mediaLink(asset.public_url,label,"video");else mediaLink(asset.public_url,label,"pdf");});
 readingZoom=100;applyZoom();homeView.hidden=true;listView.hidden=true;readingView.hidden=false;document.title=`${material?.title||title} — Pekan ${n} | Penyegaran Pagi - FKKP`;window.scrollTo(0,0);
}
function back(){readingView.hidden=true;homeView.hidden=false;listView.hidden=false;document.title="Penyegaran Pagi - FKKP";window.scrollTo(0,0);}
async function loadPublished(){const config=window.FKKP_SUPABASE_CONFIG;if(!config||!config.url||config.url.includes("YOUR-PROJECT-REF")||!config.anonKey||config.anonKey.includes("YOUR_SUPABASE"))return;if(!window.supabase?.createClient){$("#backendStatus").textContent="Pustaka koneksi belum termuat. Periksa koneksi internet lalu muat ulang.";return;}
 try{supabaseClient=window.supabase.createClient(config.url,config.anonKey);const {data,error}=await supabaseClient.from("reading_materials").select("week_number,section_key,title,content_html,pdf_url,audio_url,video_url,status").eq("status","published").order("week_number");if(error)throw error;const {data:assetData,error:assetError}=await supabaseClient.from("reading_assets").select("week_number,day_key,day_label,session_date,asset_type,original_name,stored_name,storage_path,public_url,mime_type,size_bytes,status").eq("status","published").order("week_number").order("session_date");if(assetError)throw assetError;materials.clear();assets.clear();(data||[]).forEach(row=>materials.set(key(row.week_number,row.section_key),row));(assetData||[]).forEach(row=>{const k=key(row.week_number,row.day_key);if(!assets.has(k))assets.set(k,[]);assets.get(k).push(row);});$("#backendStatus").textContent=(materials.size+assetData.length)?`Terhubung: ${materials.size} materi dan ${assetData.length} file telah diterbitkan.`:"Backend terhubung. Belum ada materi yang diterbitkan.";renderWeek(currentWeek);
 }catch(e){console.error("Supabase public read failed",e);$("#backendStatus").textContent="Materi online belum dapat dimuat. Periksa konfigurasi Supabase dan kebijakan akses (RLS).";}
}
for(let i=1;i<=WEEKS;i++){const o=document.createElement("option");o.value=String(i);o.textContent=`Pekan Bacaan ${i}`;weekSelect.appendChild(o);}
renderWeek(1);updateToday();weekSelect.addEventListener("change",()=>renderWeek(weekSelect.value));$("#garisButton").addEventListener("click",()=>openReading("outline",currentWeek));dayGrid.addEventListener("click",e=>{const b=e.target.closest("button.day-card");if(b)openReading("day",currentWeek,b.dataset.day);});$("#backButton").addEventListener("click",back);
$("#zoomOut").addEventListener("click",()=>{readingZoom=Math.max(80,readingZoom-10);applyZoom();});$("#zoomIn").addEventListener("click",()=>{readingZoom=Math.min(180,readingZoom+10);applyZoom();});$("#zoomReset").addEventListener("click",()=>{readingZoom=100;applyZoom();});$("#downloadPdf").addEventListener("click",()=>window.print());
const t=targetToday();if(t.week&&t.week<=WEEKS)renderWeek(t.week);loadPublished();
if("serviceWorker" in navigator&&location.protocol!=="file:")window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(err=>console.warn("PWA offline belum aktif:",err)));
})();