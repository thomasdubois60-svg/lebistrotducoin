const CACHE='bistrot-v4';
const ASSETS=['/','/aujourdhui','/carte','/galerie','/contact','/application','/icons/icon-192.png','/icons/icon-512.png'];
const PRIVATE_PREFIXES=['/api/','/club','/administration','/fidelite/','/coupon/','/offre-bienvenue/'];
self.addEventListener('install',event=>{self.skipWaiting();event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).catch(()=>undefined))});
self.addEventListener('activate',event=>event.waitUntil(Promise.all([self.clients.claim(),caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))])));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin||PRIVATE_PREFIXES.some(prefix=>url.pathname.startsWith(prefix))){event.respondWith(fetch(event.request));return;}
  event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy)).catch(()=>undefined)}return response}).catch(()=>caches.match(event.request).then(response=>response||caches.match('/'))));
});
self.addEventListener('push',event=>{let data={};try{data=event.data?event.data.json():{}}catch{data={body:event.data?event.data.text():''}}const title=data.title||'Le Bistrot Du Coin';const options={body:data.body||'Une nouvelle actualité vous attend.',icon:'/icons/icon-192.png',badge:'/icons/icon-192.png',data:{url:data.url||'/club/espace'},tag:data.tag||'lbdc-news',renotify:true};event.waitUntil(self.registration.showNotification(title,options))});
self.addEventListener('notificationclick',event=>{event.notification.close();const url=new URL(event.notification.data?.url||'/club/espace',self.location.origin).href;event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{for(const client of list){if('navigate'in client)client.navigate(url);if('focus'in client)return client.focus()}return clients.openWindow?clients.openWindow(url):undefined}))});
