const CACHE_NAME="penyegaran-pagi-fkkp-v7";
const ASSETS=["./","./index.html","./admin.html","./styles.css","./app.js","./manifest.webmanifest"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener("fetch",e=>{
 if(e.request.method!=="GET"||new URL(e.request.url).origin!==self.location.origin)return;
 const url=new URL(e.request.url);
 if(url.pathname.endsWith("/supabase-config.js")){e.respondWith(fetch(e.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,copy));}return r;}).catch(()=>caches.match(e.request)));return;}
 e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE_NAME).then(cache=>cache.put(e.request,copy));}return r;}).catch(()=>caches.match("./index.html"))));
});
