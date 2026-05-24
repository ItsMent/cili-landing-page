import { test } from 'node:test';
import assert from 'node:assert/strict';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadSentences } from '../load-sentences.mjs';

function fixtureFile(contents) {
  const dir = mkdtempSync(join(tmpdir(), 'pack-load-'));
  const path = join(dir, 'sentencesData.ts');
  writeFileSync(path, contents, 'utf8');
  return path;
}

test('loadSentences parses TS-style records into objects', async () => {
  const ts = `
export const sentences: SentenceData[] = [
{
    "id": 1,
    "simplified": "我们试试看！",
    "traditional": "我們試試看！",
    "pinyin": "wǒmen shìshìkàn ！",
    "english": "Let's give it a try!",
    "lao": "ໃຫ້ມັນລອງ!"
  },
  {
    "id": 2,
    "simplified": "我该去睡觉了。",
    "traditional": "我該去睡覺瞭。",
    "pinyin": "wǒ gāi qù shuìjiào le 。",
    "english": "It's time for me to go to bed"
  }
];
`;
  const records = await loadSentences(fixtureFile(ts));
  assert.equal(records.length, 2);
  assert.deepEqual(records[0], {
    id: 1,
    simplified: '我们试试看！',
    pinyin: 'wǒmen shìshìkàn ！',
    english: "Let's give it a try!"
  });
  assert.equal(records[1].id, 2);
  assert.equal(records[1].english, "It's time for me to go to bed");
});

test('loadSentences handles escaped quotes in English field', async () => {
  const ts = `
export const sentences: SentenceData[] = [
{
    "id": 5,
    "simplified": "密码是\\"Muiriel\\"。",
    "traditional": "密碼是\\"Muiriel\\"。",
    "pinyin": "mìmǎ shì \\"muiriel\\" 。",
    "english": "The password is \\"Muiriel\\"."
  }
];
`;
  const records = await loadSentences(fixtureFile(ts));
  assert.equal(records.length, 1);
  assert.equal(records[0].english, 'The password is "Muiriel".');
});

test('loadSentences throws if file is missing', async () => {
  await assert.rejects(() => loadSentences('/nonexistent/path/sentencesData.ts'), /ENOENT/);
});
