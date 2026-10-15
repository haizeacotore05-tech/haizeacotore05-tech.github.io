// Guarda la app para usarla sin conexión. Sube VERSION cuando cambies la app.
const VERSION="teorica-b-v3";
const FILES=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./icon-512-maskable.png","./icon-180.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==VERSION).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener("fetch",e=>{
  const r=e.request; if(r.method!=="GET")return;
  // Página: primero red (para recibir actualizaciones), si no hay conexión, la guardada
  if(r.mode==="navigate"){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(VERSION).then(c=>c.put("./index.html",cp));return res}).catch(()=>caches.match("./index.html")));return}
  // Resto (iconos, fuentes): primero la copia guardada
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok||res.type==="opaque"){const cp=res.clone();caches.open(VERSION).then(c=>c.put(r,cp))}return res})));
});
