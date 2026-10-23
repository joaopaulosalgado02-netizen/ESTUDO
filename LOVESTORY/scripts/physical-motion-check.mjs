import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';

const executablePath = process.env.BROWSER_PATH || ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
assert.ok(executablePath, 'Defina BROWSER_PATH para um navegador Chromium.');
const browser = await chromium.launch({ executablePath, headless: true });
const base = process.env.ALBUM_URL || 'http://127.0.0.1:5177/';
const storageKey = 'lovestory.jemima-joao.v1';
const output = '.qa/physical';
mkdirSync(output, { recursive: true });
const results = [], failures = [];
const selectors = ['.book-cover', '.mechanical-shell', '.mechanical-cover', '.mechanical-page-deck', '.mechanical-page-deck .page-scene', '.mechanical-page-deck .photo-image img', '.reading-room', '.open-book', '.book-spread > .book-page', '.booth-printer-slot', '.booth-paper-channel', '.photo-strip', '.physical-jar-stage', '.physical-jar-lid', '.jar-note', '.physical-jar-flight'];

function verify(condition, message) { if (!condition) failures.push(message); }

async function load(page, index = 0, opened = false) {
  // Let the previous screen flush its deferred save before writing a fixture.
  await page.waitForTimeout(250);
  await page.evaluate(({ index, opened }) => sessionStorage.setItem('__physicalFixture', JSON.stringify({ version: 1, page: index, opened, scenes: {}, points: 0, vouchers: [] })), { index, opened });
  await page.reload();
  await page.locator(opened ? '.book-spread > .book-page' : '.book-cover').first().waitFor();
  await page.waitForTimeout(500);
}

// Keep actual rAF samples, including masks and effective opacity. A transform
// declaration alone cannot establish that paper travelled out of an object.
async function sample(page, tag, actionSelector, duration, shotTimes = []) {
  await page.evaluate(({ selectors, actionSelector, duration }) => {
    const ids = new WeakMap(); let nextId = 0;
    const rect = node => { const box = node.getBoundingClientRect(); return { x: box.x, y: box.y, width: box.width, height: box.height, bottom: box.bottom, right: box.right }; };
    const start = performance.now();
    window.__physical = { frames: [], done: false, start };
    const capture = now => {
      const elements = {};
      for (const selector of selectors) {
        const node = document.querySelector(selector); if (!node) continue;
        if (!ids.has(node)) ids.set(node, ++nextId);
        const style = getComputedStyle(node), box = rect(node);
        let opacity = 1, clip = { ...box }; const clips = [];
        for (let parent = node; parent; parent = parent.parentElement) {
          const css = getComputedStyle(parent); opacity *= Number(css.opacity);
          if (css.overflowX !== 'visible' || css.overflowY !== 'visible' || css.clipPath !== 'none') {
            const bounds = rect(parent); clips.push({ class: parent.className.baseVal ?? parent.className, ...bounds, clipPath: css.clipPath, overflow: css.overflow });
            if (css.overflowX !== 'visible') { clip.x = Math.max(clip.x, bounds.x); clip.right = Math.min(clip.right, bounds.right); }
            if (css.overflowY !== 'visible') { clip.y = Math.max(clip.y, bounds.y); clip.bottom = Math.min(clip.bottom, bounds.bottom); }
          }
        }
        elements[selector] = { id: ids.get(node), ...box, opacity, loaded: node instanceof HTMLImageElement ? node.complete && node.naturalWidth > 0 : undefined, transform: style.transform, clipPath: style.clipPath, transformOrigin: style.transformOrigin, transformStyle: style.transformStyle, clips, clippedHeight: Math.max(0, clip.bottom - clip.y), animations: node.getAnimations().map(animation => ({ name: animation.animationName || '', currentTime: animation.currentTime, playState: animation.playState })) };
      }
      window.__physical.frames.push({ time: now - start, elements });
      if (now - start < duration) requestAnimationFrame(capture); else window.__physical.done = true;
    };
    requestAnimationFrame(capture);
    document.querySelector(actionSelector).click();
  }, { selectors, actionSelector, duration });
  for (const time of shotTimes) {
    await page.waitForFunction(time => performance.now() - window.__physical.start >= time, time);
    await page.screenshot({ path: `${output}/${tag}-${time}.png` });
  }
  await page.waitForFunction(() => window.__physical.done);
  const frames = await page.evaluate(() => window.__physical.frames);
  results.push({ tag, frames });
  return frames;
}

const states = (frames, selector) => frames.map(frame => ({ time: frame.time, ...frame.elements[selector] })).filter(state => state.id);
const range = (items, key) => Math.max(...items.map(item => item[key])) - Math.min(...items.map(item => item[key]));

try {
  for (const reducedMotion of (process.argv.includes('--normal-only') ? ['no-preference'] : ['no-preference', 'reduce'])) for (const viewport of (process.argv.includes('--390-only') ? [{ width: 390, height: 844 }] : [{ width: 390, height: 844 }, { width: 360, height: 640 }, { width: 1440, height: 900 }])) {
    const tag = `${viewport.width}-${reducedMotion}`;
    const normal = reducedMotion === 'no-preference';
    const context = await browser.newContext({ viewport, reducedMotion, hasTouch: viewport.width < 600 });
    const page = await context.newPage();
    await page.addInitScript(storageKey => { const fixture = sessionStorage.getItem('__physicalFixture'); if (fixture) localStorage.setItem(storageKey, fixture); }, storageKey);
    page.on('pageerror', error => failures.push(`${tag}: ${error.message}`));
    await page.goto(base);
    if (!process.argv.includes('--objects-only')) {
    await load(page);
    const opening = await sample(page, `${tag}-book`, '.cover-open', 2300, normal ? [300, 700, 900, 1200, 1900] : [200]);
    const covers = states(opening, '.mechanical-cover');
    const pages = states(opening, '.book-spread > .book-page');
    if (normal) {
      verify(covers.some(state => state.transform.startsWith('matrix3d')), `${tag}: cover never rotates in 3D`);
      verify(opening.filter(frame => frame.elements['.mechanical-cover'] && frame.elements['.book-spread > .book-page']).length > 8, `${tag}: cover and real inner page do not coexist during opening`);
      verify(pages.length && new Set(pages.map(state => state.id)).size === 1, `${tag}: inner page replaced during opening`);
      const deck = states(opening, '.mechanical-page-deck').at(-1), room = states(opening, '.open-book').at(-1);
      verify(deck && room && Math.abs(deck.x - room.x) < 8 && Math.abs(deck.y - room.y) < 8 && Math.abs(deck.width - room.width) < 8 && Math.abs(deck.height - room.height) < 8, `${tag}: physical page does not match reader geometry at handoff`);
      const scene = states(opening, '.mechanical-page-deck .page-scene').at(-1), image = states(opening, '.mechanical-page-deck .photo-image img').at(-1);
      verify(scene?.opacity > .98, `${tag}: frozen scene is faded during book opening`);
      verify(image?.loaded && image.opacity > .98, `${tag}: frozen photo is blank during book opening`);
    }
    verify(await page.locator('.book-spread > .book-page').count() > 0, `${tag}: book failed to open`);
    const closing = await sample(page, `${tag}-closing`, '.book-topline .small-link', 2300, normal ? [350, 1000, 1900] : [200]);
    if (normal) verify(closing.some(frame => frame.elements['.mechanical-cover']?.transform.startsWith('matrix3d') && frame.elements['.book-spread > .book-page']), `${tag}: closing lacks a rotating cover over the real inner page`);
    }
    if (process.argv.includes('--book-only')) { console.log(`Sampled book ${tag}`); await context.close(); continue; }
    const inner = viewport.width >= 1050 ? 10 : 11;
    await load(page, inner, true);
    await page.locator('.photo-booth').waitFor();
    await page.locator('.booth-curtain').evaluate(node => { const scroller = node.closest('.page-scroll'); scroller.scrollTop += node.getBoundingClientRect().top - scroller.getBoundingClientRect().top - 8; });
    const booth = await sample(page, `${tag}-booth`, '.photo-booth .brass-button', 3200, normal ? [350, 1000, 1800, 2700] : [200]);
    const strips = states(booth, '.photo-strip');
    verify(strips.length > 0, `${tag}: no printed strip`);
    if (normal && strips.length) {
      const heights = strips.map(state => state.clippedHeight);
      verify(range(strips, 'y') > 100, `${tag}: strip has no meaningful travel`);
      verify(strips.every(state => state.opacity > .98), `${tag}: strip fades instead of being physically revealed`);
      verify(heights.every((height, i) => i === 0 || height >= heights[i - 1] - 2), `${tag}: exposed paper retracts/jumps during print`);
      verify(heights.some(height => height > 5 && height < Math.max(...heights) * .6), `${tag}: strip lacks partially printed states`);
    }
    if (normal && viewport.width === 390) {
      const replay = states(await sample(page, `${tag}-booth-replay`, '.photo-booth .brass-button', 4000, [400, 900, 1800, 3500]), '.photo-strip');
      verify(new Set(replay.map(state => state.id)).size === 1, `${tag}: replay replaces paper DOM`);
      verify(Math.min(...replay.map(state => state.clippedHeight)) < 5 && replay.at(-1).clippedHeight > replay[0].clippedHeight * .9, `${tag}: replay does not retract fully before reprinting`);
    }
    await load(page, 16, true);
    await page.locator('.physical-jar').waitFor();
    await page.locator('.physical-jar-stage').evaluate(node => { const scroller = node.closest('.page-scroll'); scroller.scrollTop += node.getBoundingClientRect().top - scroller.getBoundingClientRect().top - 75; });
    const jar = await sample(page, `${tag}-jar`, '.physical-jar-touch', 3300, normal ? [250, 650, 1150, 1900, 2900] : [200]);
    const notes = states(jar, '.jar-note');
    const corks = states(jar, '.physical-jar-lid');
    if (normal) {
      verify(range(corks, 'y') > 10, `${tag}: cork does not open`);
      verify(range(notes, 'y') > 80, `${tag}: paper does not leave jar`);
      const top = Math.min(...notes.map(state => state.y));
      verify(notes.at(-1).y > top + 60, `${tag}: note does not descend after extraction`);
      const extraction = notes.find(state => state.y < notes[0].y - 5);
      const lid = corks.find(state => state.time >= (extraction?.time || 0));
      verify(lid && lid.y < corks[0].y - 10, `${tag}: paper moves before lid opens`);
      const stage = states(jar, '.physical-jar-stage')[0];
      verify(notes.some(state => state.bottom < stage.y + 82), `${tag}: folded note never clears jar mouth`);
    }
    if (normal && viewport.width === 390) {
      const before = await page.locator('.physical-jar-ink').innerText();
      await sample(page, `${tag}-jar-repeat`, '.physical-jar > .text-button', 3000, [200, 850, 1700, 2750]);
      verify(await page.locator('.physical-jar-ink').innerText() !== before, `${tag}: repeat shows the same note`);
      verify(await page.locator('.physical-jar').getAttribute('data-phase') === 'rest', `${tag}: repeated note remains locked`);
      // Snapshot geometry must preserve a folded note halfway through its trip.
      // Observe insertion in the same rendering task, before the original can
      // advance another animation frame and invalidate the comparison.
      await page.evaluate(() => {
        window.__jarSnapshot = null;
        const observer = new MutationObserver(() => {
          const original = document.querySelector('.reading-room .physical-jar-paper');
          const copy = document.querySelector('.mechanical-page-deck .physical-jar-paper');
          if (!original || !copy) return;
          const read = node => {
            const style = getComputedStyle(node);
            return { top: parseFloat(style.top), width: parseFloat(style.width), height: parseFloat(style.height), paddingTop: parseFloat(style.paddingTop), ink: Number(getComputedStyle(node.querySelector('.physical-jar-ink')).opacity) };
          };
          window.__jarSnapshot = { original: read(original), copy: read(copy) };
          observer.disconnect();
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
      });
      await page.locator('.physical-jar > .text-button').evaluate(node => node.click());
      await page.waitForTimeout(980); // Includes the old note's 380ms return.
      await page.locator('.book-topline .small-link').evaluate(node => node.click());
      await page.waitForFunction(() => window.__jarSnapshot);
      const frozen = await page.evaluate(() => window.__jarSnapshot);
      results.push({ tag: `${tag}-jar-close-snapshot`, ...frozen });
      for (const property of ['top', 'width', 'height', 'paddingTop']) verify(Math.abs(frozen.original[property] - frozen.copy[property]) < .5, `${tag}: mid-flight snapshot changes paper ${property}`);
      verify(frozen.copy.ink === 0, `${tag}: snapshot reveals ink before unfolding`);
      await page.waitForTimeout(1800);
    }
    const dimensions = await page.evaluate(() => ({ screen: innerWidth, content: document.documentElement.scrollWidth }));
    verify(dimensions.content <= dimensions.screen + 1, `${tag}: horizontal overflow`);
    console.log(`Sampled ${tag}`);
    await context.close();
  }
} finally {
  const report = process.argv.includes('--book-only') ? 'frames-book.json' : process.argv.includes('--objects-only') ? 'frames-objects.json' : 'frames.json';
  writeFileSync(`${output}/${report}`, JSON.stringify({ failures, results }));
  await browser.close();
}
assert.deepEqual(failures, [], failures.join('\n'));
console.log('Physical motion checks passed.');
