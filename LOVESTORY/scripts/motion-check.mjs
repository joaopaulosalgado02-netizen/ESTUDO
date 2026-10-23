import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';

const executablePath = process.env.BROWSER_PATH || ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
assert.ok(executablePath, 'Defina BROWSER_PATH com um navegador Chromium.');
const base = process.env.ALBUM_URL || 'http://127.0.0.1:5177/';
const browser = await chromium.launch({ executablePath, headless: true });
const checks = [], issues = [], samples = [];
mkdirSync('.qa', { recursive: true });

function check(name) { checks.push(name); console.log(`OK ${name}`); }

// Measure rendered positions and opacity every frame. An animation class alone
// cannot pass these checks: at least two different painted states must exist.
async function record(page, selectors, action, duration = 1050) {
  await page.evaluate(({ selectors, duration }) => {
    window.__motion = { frames: [], done: false };
    const start = performance.now();
    function frame(now) {
      const elements = {};
      for (const selector of selectors) {
        const node = document.querySelector(selector);
        if (!node) continue;
        const box = node.getBoundingClientRect(), style = getComputedStyle(node);
        elements[selector] = { x: box.x, y: box.y, width: box.width, height: box.height, opacity: Number(style.opacity), transform: style.transform };
      }
      const stage = document.querySelector('.gallery-stage');
      const visiblePhotos = stage ? [...stage.querySelectorAll('img')].filter(img => {
        if (!img.complete || !img.naturalWidth) return false;
        let opacity = 1;
        for (let parent = img; parent && parent !== stage; parent = parent.parentElement) opacity *= Number(getComputedStyle(parent).opacity);
        return opacity > .015;
      }).length : null;
      window.__motion.frames.push({ time: now - start, elements, dialog: !!document.querySelector('dialog[open]'), turn: !!document.querySelector('.turn-leaf'), visiblePhotos });
      if (now - start < duration) requestAnimationFrame(frame);
      else window.__motion.done = true;
    }
    requestAnimationFrame(frame);
  }, { selectors, duration });
  await action();
  await page.waitForFunction(() => window.__motion.done);
  const frames = await page.evaluate(() => window.__motion.frames);
  samples.push({ selectors, frames });
  return frames;
}

function moved(frames, selector) {
  const states = frames.map(frame => frame.elements[selector]).filter(Boolean);
  return states.length > 2 && ['x', 'y', 'width', 'height', 'opacity'].some(key => Math.max(...states.map(state => state[key])) - Math.min(...states.map(state => state[key])) > (key === 'opacity' ? .08 : 2));
}

async function settled(page) {
  await page.locator('.turn-layer').waitFor({ state: 'detached' });
  await page.waitForTimeout(100);
}

async function go(page, number, wide) {
  await page.getByRole('button', { name: 'Abrir sumário', exact: true }).click();
  await page.locator('dialog .chapter-pages button').nth(number - 1).click();
  await page.locator('dialog').waitFor({ state: 'detached' });
  const first = wide ? Math.floor((number - 1) / 2) * 2 + 1 : number;
  await page.locator(`[data-page="${first}"]`).waitFor();
  await settled(page);
}

async function fit(page) {
  const dimensions = await page.evaluate(() => ({
    screen: innerWidth, width: document.documentElement.scrollWidth,
    pages: [...document.querySelectorAll('.book-spread > .book-page')].map(node => ({ page: node.dataset.page, width: node.clientWidth, scroll: node.querySelector('.page-scroll').scrollWidth })),
    dialogs: [...document.querySelectorAll('dialog[open]')].map(node => ({ top: node.getBoundingClientRect().top, bottom: node.getBoundingClientRect().bottom, height: innerHeight, width: node.clientWidth, scroll: node.scrollWidth })),
  }));
  assert.ok(dimensions.width <= dimensions.screen + 1, `Overflow horizontal: ${JSON.stringify(dimensions)}`);
  for (const item of dimensions.pages) assert.ok(item.scroll <= item.width + 2, `Página larga: ${JSON.stringify(item)}`);
  for (const item of dimensions.dialogs) {
    assert.ok(item.top >= -1 && item.bottom <= item.height + 1, `Modal fora da tela: ${JSON.stringify(item)}`);
    assert.ok(item.scroll <= item.width + 2, `Modal largo: ${JSON.stringify(item)}`);
  }
}

try {
  for (const reducedMotion of (process.argv.includes('--reduced-only') ? ['reduce'] : ['no-preference', 'reduce'])) for (const viewport of [{ width: 390, height: 844 }, { width: 360, height: 640 }, { width: 1440, height: 900 }]) {
    const name = `${viewport.width}×${viewport.height} / ${reducedMotion}`;
    const context = await browser.newContext({ viewport, reducedMotion, hasTouch: viewport.width < 600 });
    const page = await context.newPage();
    page.setDefaultTimeout(12000);
    page.on('pageerror', error => issues.push(`${name}: ${error.message}`));
    page.on('console', message => { if (message.type() === 'error' && !/spotify|ERR_BLOCKED|ERR_CONNECTION|ERR_CERT/i.test(message.text())) issues.push(`${name}: ${message.text()}`); });
    await page.route(/\/media\/(?:photos|optimized)\//, async route => { await new Promise(resolve => setTimeout(resolve, 130)); await route.continue(); });
    await page.goto(base);
    await page.locator('.book-cover img').evaluate(async img => { if (!img.complete) await new Promise(resolve => { img.onload = resolve; img.onerror = resolve; }); });
    const normal = reducedMotion === 'no-preference', wide = viewport.width >= 1050;
    const opening = await record(page, ['.mechanical-cover', '.mechanical-shell', '.reading-room'], () => page.getByRole('button', { name: 'Abra o nosso livro', exact: true }).click(), normal ? 3000 : 1050);
    await page.locator('[data-page="1"]').waitFor();
    await page.locator('.book-mechanism').waitFor({ state: 'detached' });
    if (normal) {
      assert.ok(moved(opening, '.mechanical-cover'), `Capa não girou na abertura: ${name}`);
      assert.ok(moved(opening, '.mechanical-shell'), `Livro não se acomodou na abertura: ${name}`);
      assert.ok(new Set(opening.map(frame => frame.elements['.mechanical-cover']?.transform).filter(Boolean)).size > 5, `Dobradiça sem transformação contínua na abertura: ${name}`);
    }
    await fit(page);
    const closing = await record(page, ['.mechanical-cover', '.mechanical-shell', '.reading-room', '.open-book'], () => page.getByRole('button', { name: 'fechar o livro', exact: true }).click(), normal ? 2800 : 1050);
    await page.locator('.book-mechanism').waitFor({ state: 'detached' });
    await page.locator('.book-cover').waitFor();
    if (normal) {
      assert.ok(moved(closing, '.mechanical-cover'), `Capa não girou no fechamento: ${name}`);
      assert.ok(moved(closing, '.mechanical-shell'), `Livro não se acomodou no fechamento: ${name}`);
      assert.ok(new Set(closing.map(frame => frame.elements['.mechanical-cover']?.transform).filter(Boolean)).size > 5, `Dobradiça sem transformação contínua no fechamento: ${name}`);
    }
    await page.locator('.cover-open').click();
    await page.locator('[data-page="1"]').waitFor();
    await page.locator('.book-mechanism').waitFor({ state: 'detached' });
    await go(page, 4, wide);
    const letter = page.getByRole('button', { name: 'Abrir a carta de João para Mima' });
    await letter.scrollIntoViewIfNeeded();
    const entrance = await record(page, ['dialog', '.modal-shell'], () => letter.click());
    await page.getByRole('heading', { name: 'Uma carta para Mima' }).waitFor();
    if (normal) assert.ok(moved(entrance, 'dialog') || moved(entrance, '.modal-shell'), `Carta sem movimento real: ${name}`);
    if (normal) await page.waitForTimeout(650);
    await fit(page);
    await page.screenshot({ path: `.qa/motion-letter-${viewport.width}-${reducedMotion}.png`, fullPage: true });
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('Tab');
      assert.ok(await page.evaluate(() => !!document.activeElement?.closest('dialog')), `Foco escapou da carta: ${name}`);
    }
    const exit = await record(page, ['dialog', '.modal-shell'], () => page.keyboard.press('Escape'));
    await page.locator('dialog').waitFor({ state: 'detached' });
    if (normal) assert.ok(moved(exit, 'dialog') || moved(exit, '.modal-shell'), `Carta desapareceu sem transição: ${name}`);
    assert.equal(await letter.evaluate(node => node === document.activeElement), true, `Foco não retornou à carta: ${name}`);
    await page.getByRole('button', { name: 'Abrir sumário', exact: true }).click();
    await page.waitForTimeout(650);
    const contents = await record(page, ['dialog', '.turn-leaf'], () => page.locator('dialog .chapter-pages button').nth(10).click());
    if (normal) {
      assert.ok(moved(contents, 'dialog'), `Sumário sem saída animada: ${name}`);
      assert.equal(contents.some(frame => frame.dialog && frame.turn), false, `Sumário sobrepõe virada: ${name}`);
      assert.ok(moved(contents, '.turn-leaf'), `Virada sem movimento real: ${name}`);
    }
    await settled(page);
    await page.getByRole('button', { name: 'Ver nossas 18 fotografias' }).click();
    await page.waitForFunction(() => [...document.querySelectorAll('.gallery-stage img')].some(img => img.complete && img.naturalWidth > 0));
    await page.waitForTimeout(600);
    for (let index = 0; index < 3; index++) {
      const gallery = await record(page, ['.gallery-stage .gallery-current', '.gallery-stage'], () => page.getByRole('button', { name: 'Próxima foto', exact: true }).click(), 900);
      assert.equal(gallery.some(frame => frame.visiblePhotos === 0), false, `Galeria exibiu quadro vazio: ${name}, foto ${index + 2}`);
      if (normal) assert.ok(moved(gallery, '.gallery-stage .gallery-current'), `Troca de foto sem transição: ${name}`);
    }
    await fit(page);
    await page.screenshot({ path: `.qa/motion-gallery-${viewport.width}-${reducedMotion}.png`, fullPage: true });
    const close = page.getByRole('button', { name: 'Fechar', exact: true });
    await close.scrollIntoViewIfNeeded();
    assert.ok(await close.isVisible(), `Fechar galeria não alcançável: ${name}`);
    await close.click();
    await page.locator('dialog').waitFor({ state: 'detached' });
    if (!normal) {
      const long = await page.evaluate(() => document.getAnimations().filter(animation => animation.playState === 'running' && Number(animation.effect?.getTiming().duration) > 100).map(animation => animation.animationName));
      assert.deepEqual(long, [], `Movimento prolongado no modo reduzido: ${name}`);
    }
    await page.screenshot({ path: `.qa/motion-${viewport.width}-${reducedMotion}.png`, fullPage: true });
    check(`abertura, fechamento, carta, foco, sumário, virada e galeria: ${name}`);
    await context.close();
  }
  assert.deepEqual(issues, [], 'Erros na execução');
  writeFileSync('.qa/motion-report.json', JSON.stringify({ base, checks, issues, samples }, null, 2));
  console.log(`PASS ${checks.length} cenários: posições/opacidades renderizadas, galeria sem quadros vazios e foco.`);
} finally {
  writeFileSync('.qa/motion-report.json', JSON.stringify({ base, checks, issues, samples }, null, 2));
  await browser.close();
}

