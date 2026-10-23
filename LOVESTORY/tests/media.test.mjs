import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';

const manifest=JSON.parse(readFileSync(new URL('../src/content/media.json',import.meta.url),'utf8').replace(/^\uFEFF/,''));
test('all 18 photographs and two complete videos preserve the received bytes',()=>{
  assert.equal(manifest.filter(item=>item.type==='image').length,18);
  assert.equal(manifest.filter(item=>item.type==='video').length,2);
  for(const media of manifest){
    const file=readFileSync(new URL(`../public/${media.webFile||media.file}`,import.meta.url));
    assert.equal(createHash('sha256').update(file).digest('hex'),media.sha256,media.id);
  }
});
