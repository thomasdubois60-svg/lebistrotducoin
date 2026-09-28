export function siteImage(src:string,width=960):string {
 try {const u=new URL(src);const parts=u.pathname.split('/');
  if(u.hostname==='raw.githubusercontent.com'&&parts[1]==='thomasdubois60-svg'&&parts[2]==='lebistrotducoin'&&/^[a-f0-9]{40}$/.test(parts[3])&&parts[4]==='public'&&parts[5]==='photos'&&parts.length===7&&/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,200}\.(?:jpe?g|png|webp)$/i.test(parts[6]))return '/api/site-image?v='+parts[3]+'&file='+encodeURIComponent(parts[6])+'&w='+width;
 }catch{}
 return src;
}
