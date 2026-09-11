import { mkdir, writeFile } from 'node:fs/promises';
const BASE = 'https://naano.com';
const IMG = 'public/naano/images';
const FONT = 'public/naano/fonts';
const SEO = 'public/naano/seo';
const CSS = '.playwright-mcp/naano-css';
await Promise.all([IMG,FONT,SEO,CSS].map(d=>mkdir(d,{recursive:true})));

const images = ['avatar-a','avatar-b','avatar-c','avatar-d','avatar-e','avatar-f','avatar-g','avatar-h']
  .map(n=>`/lp/${n}.png`)
  .concat(['/lp/blogseo-vincent-video-poster.png','/lp/cloud-layer-bottom-v1.png','/lp/hero-clouds-cotton-blue-v7.png','/lp/journey-cloud-current-v1.png','/lp/marketplace-atmosphere-v1.png','/lp/marketplace-screenshot-clean-v2.png','/lp/naano-logo-nav.png','/lp/results-metrics-clouds-v2.png'])
  .concat(['abyssale','blogseo','chatseo','folk','gojiberry','lagrowthmachine','leadbay','lemlist','ringover','zmirov'].map(n=>`/lp/logo-${n}.png`))
  .concat(['/lp/logo-attio.jpg'])
  .concat(['photo-book-call','photo-calendar','photo-claude-mcp-leadbay','photo-david-zmirov','photo-leadbay-app','photo-marina-laptop'].map(n=>`/lp/${n}.png`));
const fonts = ['/_next/static/immutable/media/0fabae9f11ea0e84-s.p.30l3t3tv_uztz.woff2','/_next/static/immutable/media/83afe278b6a6bb3c-s.p.45535valc9rzk.woff2','/_next/static/immutable/media/fba5a26ea33df6a3-s.p.08ssgmy_tb90r.woff2'];
const cssFiles = ['/_next/static/immutable/chunks/0ftqgv_a12bxx.css','/_next/static/immutable/chunks/1fxt04qdho09-.css','/_next/static/immutable/chunks/2wc8g3f3t8hbj.css','/_next/static/immutable/chunks/3miz_m3gojkn7.css'];
const seo = ['/favicon.ico?favicon.1g-vhk4rlweyo.ico','/apple-icon.png?apple-icon.0oy3cq687eyaj.png'];
const video = 'https://api.naano.xyz/storage/v1/object/public/marketing-assets/case-studies/blogseo-vincent-josse.mp4';

async function dl(url, outDir, name){
  try {
    const full = url.startsWith('http') ? url : BASE+url;
    const r = await fetch(full);
    if(!r.ok){ console.log('FAIL',r.status,url); return; }
    const buf = Buffer.from(await r.arrayBuffer());
    await writeFile(`${outDir}/${name}`, buf);
    console.log('OK', name, buf.length);
  } catch(e){ console.log('ERR',url,e.message); }
}
function base(u){ return u.split('?')[0].split('/').pop(); }
async function batch(list, mapFn){ for(let i=0;i<list.length;i+=4){ await Promise.all(list.slice(i,i+4).map(mapFn)); } }

await batch(images, u=>dl(u, IMG, base(u)));
await batch(fonts, u=>dl(u, FONT, base(u)));
await batch(cssFiles, u=>dl(u, CSS, base(u)));
await batch(seo, u=>dl(u, SEO, base(u)));
await dl(video, IMG, 'blogseo-vincent-josse.mp4');
console.log('DONE');
