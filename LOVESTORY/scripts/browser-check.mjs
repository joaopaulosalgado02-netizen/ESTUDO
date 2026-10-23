import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import {existsSync,mkdirSync,writeFileSync} from 'node:fs';
import {mockSpotify} from './spotify-fixture.mjs';

const executablePath=process.env.BROWSER_PATH||['C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
assert.ok(executablePath,'Defina BROWSER_PATH com um navegador Chromium.');
const base=process.env.ALBUM_URL||'http://127.0.0.1:5177/';
const storageKey='lovestory.jemima-joao.v1';
mkdirSync('.qa',{recursive:true});
const browser=await chromium.launch({executablePath,headless:true});
const issues=[];const checks=[];
const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce',hasTouch:true});
await mockSpotify(context);
context.setDefaultTimeout(10000);
const page=await context.newPage();
page.on('pageerror',error=>issues.push(error.message));
page.on('console',message=>{if(message.type()==='error')issues.push(message.text());});
page.on('response',response=>{if(response.status()>=400)issues.push(`${response.status()} ${response.url()}`);});
function check(name){checks.push(name);console.log(`OK ${name}`);}
async function go(number){
  await page.getByRole('button',{name:'Abrir sumário',exact:true}).click();
  await page.locator('dialog .chapter-pages button').nth(number-1).click();
  await page.locator(`[data-page="${number}"]`).waitFor();
}
async function assertNoOverflow(){
  const dimensions=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,book:[...document.querySelectorAll('.book-page')].map(element=>({page:element.dataset.page,client:element.clientWidth,scroll:element.querySelector('.page-scroll').scrollWidth}))}));
  assert.ok(dimensions.scrollWidth<=dimensions.width+1,`overflow de tela ${JSON.stringify(dimensions)}`);
  for(const book of dimensions.book)assert.ok(book.scroll<=book.client+2,`overflow na página ${JSON.stringify(book)}`);
}
try{
  await page.goto(base);
  await page.getByRole('button',{name:'Abra o nosso livro',exact:true}).waitFor();
  await page.screenshot({path:'.qa/cover-390.png',fullPage:true});
  await page.getByRole('button',{name:'Abra o nosso livro',exact:true}).click();
  await page.locator('[data-page="1"]').waitFor();
  check('capa abre pelo toque');
  for(const [width,height] of (process.argv.includes('--flows-only') ? [] : [[360,800],[390,844],[768,1024],[1440,900],[360,640]])){
    await page.setViewportSize({width,height});
    for(let number=1;number<=30;number++){
      await go(number);await assertNoOverflow();
      if([1,4,8,9,10,12,17,18,20,21,22,27,29,30].includes(number)&&[390,1440].includes(width)){
        await page.locator(`[data-page="${number}"]`).evaluate(async element=>{await Promise.all([...element.querySelectorAll('img')].map(image=>image.complete?Promise.resolve():new Promise(resolve=>{image.onload=resolve;image.onerror=resolve;})));});
        await page.screenshot({path:`.qa/page-${String(number).padStart(2,'0')}-${width}.png`,fullPage:true});
      }
    }
    check(`30 páginas acessíveis, sem overflow em ${width}×${height}`);
  }
  await page.setViewportSize({width:390,height:844});
  await go(4);
  await page.getByRole('button',{name:'Abrir a carta de João para Mima'}).click();
  await page.getByRole('heading',{name:'Uma carta para Mima'}).waitFor();
  assert.match(await page.locator('dialog').innerText(),/Mima/);
  await page.keyboard.press('Escape');
  await page.locator('dialog').waitFor({state:'detached'});
  assert.equal(await page.evaluate(()=>document.activeElement.getAttribute('aria-label')),'Abrir a carta de João para Mima');
  check('carta abre, Escape fecha e foco volta ao selo');
  await go(8);
  for(let i=0;i<3;i++)for(let plant=0;plant<3;plant++)await page.locator('.plant').nth(plant).click();
  assert.equal(await page.locator('.plant.level-3').count(),3);
  await page.reload();await page.locator('.plant.level-3').first().waitFor();
  assert.equal(await page.locator('.plant.level-3').count(),3);
  check('jardim floresce e persiste após recarregar');
  await go(9);
  assert.ok(await page.locator('[data-page="9"] img').getAttribute('src').then(src=>src.includes('1000554942.jpg')));
  await page.getByRole('button',{name:'Desdobrar a notícia'}).click();
  await page.locator('.news-extra').waitFor();
  await go(10);
  assert.ok(await page.locator('[data-page="10"] img').first().getAttribute('src').then(src=>src.includes('1000554931.jpg')));
  await page.getByRole('button',{name:'Virar lembrança: primeiro beijo'}).click();
  await page.locator('.memory-flip.flipped').waitFor();
  check('marcos usam as fotos corretas e o jornal/fotos respondem ao toque');
  await go(11);
  await page.getByRole('button',{name:'Ver nossas 18 fotografias'}).click();
  for(let i=0;i<18;i++){
    await page.waitForFunction(label=>document.querySelector('.gallery-current')?.getAttribute('data-photo')===label,`F${String(i+1).padStart(2,'0')}`);
    const image=page.locator('dialog .gallery-stage .gallery-current img');
    await image.evaluate(async img=>{if(!img.complete)await new Promise(resolve=>{img.onload=resolve;img.onerror=resolve;});});
    assert.ok(await image.evaluate(img=>img.complete&&img.naturalWidth>0));
    if(i===2){assert.ok(await image.getAttribute('class').then(value=>value.includes('rotated-photo')));await page.screenshot({path:'.qa/sideways-photo-corrected.png',fullPage:true});}
    await page.getByRole('button',{name:'Próxima foto',exact:true}).click();
  }
  await page.getByRole('button',{name:'Fechar',exact:true}).click();
  check('galeria percorre todas as 18 fotos, incluindo a orientação corrigida');
  await go(12);await page.getByRole('button',{name:'Preparar nossas fotos'}).click();
  await page.getByRole('button',{name:'Imprimir de novo'}).waitFor();
  assert.equal(await page.locator('.photo-strip img').count(),3);
  await go(15);await page.getByRole('button',{name:'Girar a roda'}).click();
  await page.getByRole('button',{name:'Girar a roda'}).waitFor({state:'visible'});await page.waitForTimeout(2350);
  assert.match(await page.locator('.wheel-scene .handwritten').innerText(),/filme|lanche|passeio|Cozinhar|fotos|piquenique/i);
  await go(16);for(let i=1;i<=8;i++)await page.getByRole('button',{name:`Acender lanterna ${i}`,exact:true}).click();
  assert.equal(await page.locator('.lantern.lit').count(),8);
  await go(17);const notes=new Set();for(let i=0;i<10;i++){await page.getByRole('button',{name:i?'Mais um bilhete':'Tirar um bilhete',exact:true}).click();notes.add(await page.locator('.jar-note').innerText());}assert.equal(notes.size,10);
  await go(18);await page.getByRole('button',{name:'Girar a manivela e abrir a caixinha'}).click();await page.locator('.music-box-open').waitFor();await page.locator('.music-dock').waitFor();await page.getByRole('button',{name:'Guardar a música'}).click();assert.equal(await page.locator('audio').count(),0);
  await go(19);for(let i=0;i<6;i++){await page.locator('.mini-envelope').nth(i).click();await page.getByRole('button',{name:'Fechar',exact:true}).click();}assert.equal(await page.locator('.mini-envelope.read').count(),6);
  check('cabine, roda, lanternas, 10 bilhetes, caixa e seis cartas funcionam');
  await go(20);
  const initialPuzzle=await page.locator('.puzzle-board').innerText();
  await page.locator('.puzzle-board button').nth(0).click();await page.locator('.puzzle-board button').nth(1).click();
  assert.notEqual(await page.locator('.puzzle-board').innerText(),initialPuzzle);
  await page.getByRole('button',{name:'Completar para mim'}).click();await page.locator('.puzzle-board.completed').waitFor();
  await page.getByRole('button',{name:'Misturar de novo'}).click();
  const piece=await page.locator('.puzzle-board button').nth(0).boundingBox(),destination=await page.locator('.puzzle-board button').nth(2).boundingBox();
  await page.mouse.move(piece.x+piece.width/2,piece.y+piece.height/2);await page.mouse.down();await page.mouse.move(destination.x+destination.width/2,destination.y+destination.height/2,{steps:15});await page.mouse.up();
  assert.ok(await page.locator('[data-page="20"]').isVisible());
  await go(21);assert.equal(await page.locator('.scratch-area canvas').count(),1);await page.getByRole('button',{name:'Revelar o carinho'}).click();await page.waitForFunction(()=>getComputedStyle(document.querySelector('.scratch-area canvas')).opacity==='0');await page.getByRole('button',{name:'Esconder de novo'}).click();
  const scratch=await page.locator('.scratch-area canvas').boundingBox();
  await page.mouse.move(scratch.x+20,scratch.y+20);await page.mouse.down();for(let y=20;y<scratch.height;y+=20){for(let x=20;x<scratch.width;x+=20)await page.mouse.move(scratch.x+x,scratch.y+y);}
  await page.mouse.up();await page.waitForTimeout(100);
  await page.waitForFunction(()=>getComputedStyle(document.querySelector('.scratch-area canvas')).opacity==='0');
  assert.ok(await page.locator('[data-page="21"]').isVisible());
  check('quebra-cabeça por toque/arraste e raspadinha por gesto/alternativa não viram a página');
  await go(22);
  for(let index=0;index<2;index++){
    await page.locator('.cinema-ticket').nth(index).click();
    const video=page.locator('dialog video');
    await video.evaluate(async element=>{await Promise.race([element.play(),new Promise((_,reject)=>setTimeout(()=>reject(new Error('Vídeo não iniciou em 8 segundos')),8000))]);});
    await page.waitForTimeout(350);
    const state=await video.evaluate(element=>({playing:!element.paused,time:element.currentTime,duration:element.duration,width:element.videoWidth,height:element.videoHeight,inline:element.playsInline,controls:element.controls}));
    assert.ok(state.playing&&state.time>0&&state.duration>(index?20:15)&&state.width===576&&state.height===1024&&state.inline&&state.controls,JSON.stringify(state));
    await video.evaluate(element=>{element.pause();window.__closedVideo=element;});
    await page.getByRole('button',{name:'Fechar',exact:true}).click();
    assert.equal(await page.evaluate(()=>window.__closedVideo.paused),true);assert.equal(await page.locator('video').count(),0);
  }
  check('dois vídeos completos reproduzem, pausam e desmontam com áudio interrompido');
  await go(23);await page.getByRole('button',{name:'Acender a cena inteira'}).click();await page.locator('.flashlight-board.all-lit').waitFor();
  await go(24);await page.getByRole('button',{name:'Revelar uma lembrança'}).click();await page.locator('.instant-print').waitFor();
  await go(26);await page.locator('.plan-note').first().click();assert.equal(await page.locator('.plan-done').count(),1);
  await go(27);await page.getByRole('button',{name:'Vamos jogar',exact:true}).click();
  for(let i=0;i<5;i++)await page.locator('.heart-target').click();
  await page.waitForTimeout(12300);assert.equal(Number(await page.locator('.game-score').innerText()),5);
  await go(28);await page.locator('.voucher').first().click();assert.equal(await page.locator('.voucher.redeemed').count(),1);assert.match(await page.locator('.voucher-balance').innerText(),/2/);
  await page.reload();await page.locator('.voucher.redeemed').waitFor();
  check('jogo termina, credita pontos e vale desconta saldo com persistência');
  await go(27);await page.getByRole('button',{name:'No ponto certo',exact:true}).click();await page.getByRole('button',{name:'Vamos jogar',exact:true}).click();await page.getByRole('button',{name:'Parar agora',exact:true}).click();await page.locator('.game-score').waitFor();assert.ok(Number(await page.locator('.game-score').innerText())>=0);await page.getByRole('button',{name:'Jogar de novo',exact:true}).click();await page.getByRole('button',{name:'Parar agora',exact:true}).click();await page.locator('.game-score').waitFor();
  check('segundo jogo tem início, resultado e repetição');
  await go(29);await page.getByRole('textbox',{name:'Ou deixe seu nome'}).fill('Mima');
  const signature=await page.locator('.signature-area canvas').boundingBox();await page.mouse.move(signature.x+20,signature.y+30);await page.mouse.down();await page.mouse.move(signature.x+120,signature.y+60,{steps:20});await page.mouse.up();
  assert.ok(await page.locator('[data-page="29"]').isVisible());
  await page.reload();assert.equal(await page.getByRole('textbox',{name:'Ou deixe seu nome'}).inputValue(),'Mima');
  assert.ok(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).scenes.signatureImage.startsWith('data:image/png'),storageKey));
  await go(30);await page.getByRole('button',{name:'Fechar o cadeado de lembranças'}).click();await page.locator('.ending-locked').waitFor();await page.getByRole('button',{name:'Ver os vídeos',exact:true}).click();await page.locator('[data-page="22"]').waitFor();
  check('assinatura persiste e encerramento permite rever os vídeos');
  await page.locator('body').click({position:{x:4,y:400}});await page.keyboard.press('ArrowRight');await page.locator('[data-page="23"]').waitFor();
  await page.getByRole('button',{name:'Abrir sumário',exact:true}).click();for(let i=0;i<45;i++){await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.closest('dialog')!==null),true);}await page.keyboard.press('Escape');
  check('teclado navega e foco permanece dentro do modal');
  await go(3);const heading=await page.locator('.page-heading h2').boundingBox();const touch=await context.newCDPSession(page);await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:heading.x+heading.width-10,y:heading.y+12}]});for(let step=1;step<=10;step++)await touch.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:heading.x+heading.width-10-step*20,y:heading.y+12}]});await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.locator('[data-page="4"]').waitFor();await touch.detach();await go(23);
  check('gesto horizontal de toque vira a página fora dos objetos');
  await page.getByRole('button',{name:'Reiniciar o progresso do álbum'}).click();await page.getByRole('button',{name:'Continuar de onde parei'}).click();assert.ok(await page.locator('[data-page="23"]').isVisible());
  await page.getByRole('button',{name:'Reiniciar o progresso do álbum'}).click();await page.getByRole('button',{name:'Recomeçar o álbum'}).click();await page.locator('.book-cover').waitFor();
  await page.waitForFunction(key=>JSON.parse(localStorage.getItem(key)).points===0,storageKey);
  check('reinício exige confirmação e limpa o progresso');
  await page.evaluate(key=>localStorage.setItem(key,'{bad JSON'),storageKey);await page.reload();await page.locator('.book-cover').waitFor();
  check('dados locais inválidos não quebram a abertura');
  const normal=await browser.newContext({viewport:{width:390,height:844}});const motionPage=await normal.newPage();await motionPage.goto(base);await motionPage.getByRole('button',{name:'Abra o nosso livro',exact:true}).click();await motionPage.locator('[data-page="1"]').waitFor();await motionPage.getByRole('button',{name:'Próxima página',exact:true}).click();await motionPage.locator('.turn-leaf').waitFor();await motionPage.locator('.turn-leaf').waitFor({state:'detached'});await motionPage.locator('[data-page="2"]').waitFor();await normal.close();
  check('abertura e virada de folha animadas funcionam fora do modo reduzido');
  assert.deepEqual(issues,[],'Erros de console ou carregamento');
  writeFileSync('.qa/browser-report.json',JSON.stringify({base,checks,issues},null,2));
  console.log(`PASS ${checks.length} verificações de fluxo. Sem erros de console ou carregamento.`);
}catch(error){await page.screenshot({path:'.qa/failure.png',fullPage:true});console.error('Últimos erros:',issues);throw error;}finally{await browser.close();}
