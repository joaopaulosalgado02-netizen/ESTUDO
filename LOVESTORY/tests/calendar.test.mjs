import test from 'node:test';
import assert from 'node:assert/strict';
import {calendarElapsed,saoPauloDate} from '../src/lib/calendar.mjs';

test('counter preserves the meeting date in São Paulo around UTC midnight',()=>{
  assert.equal(saoPauloDate(new Date('2026-08-29T01:30:00Z')),'2026-08-28');
  assert.deepEqual(calendarElapsed('2026-08-28','2026-10-22'),{years:0,months:1,days:24});
});
test('calendar anniversaries handle month lengths and leap years',()=>{
  assert.deepEqual(calendarElapsed('2026-01-31','2026-02-28'),{years:0,months:1,days:0});
  assert.deepEqual(calendarElapsed('2024-02-29','2025-02-28'),{years:1,months:0,days:0});
  assert.deepEqual(calendarElapsed('2026-08-28','2027-08-28'),{years:1,months:0,days:0});
});
test('future and unavailable dates do not produce negative counters or NaN',()=>{
  for(const value of ['2028-01-01','','unknown','2026-02-31',null])assert.deepEqual(calendarElapsed(value,'2026-10-22'),{years:0,months:0,days:0});
});
