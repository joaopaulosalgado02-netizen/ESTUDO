import { chromium } from 'playwright-core';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const executablePath = process.env.BROWSER_PATH || ['C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
if(!executablePath) throw new Error('Defina BROWSER_PATH com o caminho de um navegador Chromium.');
mkdirSync('.qa',{recursive:true});
mkdirSync('public/media/posters',{recursive:true});
const browser=await chromium.launch({executablePath,headless:true});
try{
  const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
  await page.goto('http://127.0.0.1:5177/');
  await page.waitForSelector('.book-cover');
  await page.screenshot({path:'.qa/cover-390.png',fullPage:true});
  for(const [index,file] of ['1000567511.mp4','1000567513.mp4'].entries()){
    const poster=await page.evaluate(async file=>{
      const video=document.createElement('video');video.muted=true;video.preload='auto';video.src=`/media/${file}`;
      await new Promise((resolve,reject)=>{video.addEventListener('loadeddata',resolve,{once:true});video.addEventListener('error',reject,{once:true});});
      video.currentTime=.15;await new Promise(resolve=>video.addEventListener('seeked',resolve,{once:true}));
      const canvas=document.createElement('canvas');canvas.width=video.videoWidth;canvas.height=video.videoHeight;canvas.getContext('2d').drawImage(video,0,0);const data=canvas.toDataURL('image/jpeg',.87);video.removeAttribute('src');video.load();return data;
    },file);
    writeFileSync(resolve(`public/media/posters/${index+1}.jpg`),Buffer.from(poster.split(',')[1],'base64'));
  }
  await page.getByRole('button',{name:'Abra o nosso livro',exact:true}).click();
  await page.waitForSelector('[data-page="1"]');
  await page.screenshot({path:'.qa/page-01-390.png',fullPage:true});
  console.log(JSON.stringify(await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:innerHeight,bodyHeight:document.body.scrollHeight,book:document.querySelector('.open-book').getBoundingClientRect().toJSON()}))));
}finally{await browser.close();}
