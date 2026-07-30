'use client'
import { useEffect,useState } from 'react'
export function AdminInstallButton(){
 const [prompt,setPrompt]=useState<any>(null);const [ios,setIos]=useState(false);const [installed,setInstalled]=useState(false)
 useEffect(()=>{setIos(/iphone|ipad|ipod/i.test(navigator.userAgent));setInstalled(window.matchMedia('(display-mode: standalone)').matches);const h=(e:any)=>{e.preventDefault();setPrompt(e)};window.addEventListener('beforeinstallprompt',h);return()=>window.removeEventListener('beforeinstallprompt',h)},[])
 if(installed)return <p className="admin-app-installed">✓ Administration LBDC est installée.</p>
 return <div className="admin-install-card"><h2>Administration LBDC</h2><p>Ajoute un accès direct à cette administration sur ton écran d’accueil.</p>{prompt?<button className="button" onClick={async()=>{await prompt.prompt();setPrompt(null)}}>Installer Administration LBDC</button>:ios?<p><strong>Sur iPhone :</strong> touche Partager, puis « Sur l’écran d’accueil ».</p>:<p>Ouvre le menu du navigateur puis choisis « Installer l’application ».</p>}</div>
}
