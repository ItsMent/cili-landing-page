# Sentence Pack Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build one Node script that consumes the existing 62,712-sentence master dataset and emits ready-to-upload PDF, TSV, and JSON deliverables for all six sentence-pack tiers (Starter → Master).

**Architecture:** Single entry point (`scripts/generate-sentence-packs.mjs`) orchestrates a pure-function pipeline: load → filter → sort → slice → write. Helpers live in `scripts/sentence-pack/`. Pure transformation logic is unit-tested with Node's built-in `node:test`. PDF generation uses Puppeteer (already a devDependency, already used by `scripts/prerender.mjs`) — render an HTML template to PDF for correct Chinese font handling.

**Tech Stack:** Node ≥18 ESM (.mjs), Puppeteer 24, `node:test` for unit tests. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-05-24-sentence-pack-generator-design.md`

---

## File Structure

Files this plan creates or modifies:

| Path | Responsibility |
|---|---|
| `scripts/sentence-pack/load-sentences.mjs` | Parse `sentencesData.ts` and return an array of `{id, simplified, pinyin, english}` records |
| `scripts/sentence-pack/selection.mjs` | Pure functions: `filterUsable`, `sortByLength`, `sliceForTier` |
| `scripts/sentence-pack/tiers.mjs` | Tier definitions (name, count, permalink) — single source of truth |
| `scripts/sentence-pack/writers/tsv.mjs` | Write tab-delimited UTF-8-with-BOM file |
| `scripts/sentence-pack/writers/json.mjs` | Write pretty-printed JSON array |
| `scripts/sentence-pack/writers/sidecars.mjs` | Write `README.txt` and `LICENSE.txt` per pack |
| `scripts/sentence-pack/writers/pdf.mjs` | Puppeteer-based PDF writer (calls `renderTemplate`) |
| `scripts/sentence-pack/pdf-template.mjs` | Build the HTML string the PDF is rendered from |
| `scripts/sentence-pack/__tests__/load-sentences.test.mjs` | Tests for source loader |
| `scripts/sentence-pack/__tests__/selection.test.mjs` | Tests for filter/sort/slice |
| `scripts/sentence-pack/__tests__/writers.test.mjs` | Tests for TSV and JSON writers (PDF is integration-only) |
| `scripts/generate-sentence-packs.mjs` | Entry point — orchestrates all of the above |
| `package.json` | Add `gen-packs` and `gen-packs:test` npm scripts |
| `.gitignore` | (Already covers `dist/` — no change needed; verify in Task 1) |

`dist/sentence-packs/<tier>/` is the output directory — never committed, regenerable.

The source file `C:\Users\kitme\Desktop\CILI - Datas\data\sentencesData.ts` is read directly from outside the repo. Path is overridable via the `SENTENCES_SOURCE` env var.

---

## Task 1: Scaffolding

**Files:**
- Create: `scripts/sentence-pack/` (empty folder for now)
- Create: `scripts/sentence-pack/writers/` (empty folder for now)
- Create: `scripts/sentence-pack/__tests__/` (empty folder for now)
- Modify: `package.json` — add two npm scripts
- Verify: `.gitignore` already ignores `dist/`

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p "scripts/sentence-pack/writers" "scripts/sentence-pack/__tests__"
```

- [ ] **Step 2: Verify .gitignore already covers dist/**

Run: `grep -n '^dist$' .gitignore`
Expected: `12:dist` (already present)

If missing, add a line `dist` after the `node_modules` line.

- [ ] **Step 3: Add npm scripts to package.json**

In `package.json`, in the `"scripts"` object, add two entries:

```json
"gen-packs": "node scripts/generate-sentence-packs.mjs",
"gen-packs:test": "node --test scripts/sentence-pack/__tests__"
```

Final `scripts` block should look like:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "postbuild": "node scripts/prerender.mjs",
  "lint": "eslint .",
  "preview": "vite preview",
  "gen-packs": "node scripts/generate-sentence-packs.mjs",
  "gen-packs:test": "node --test scripts/sentence-pack/__tests__"
}
```

- [ ] **Step 4: Verify npm sees the new scripts**

Run: `npm run`
Expected: output lists `gen-packs` and `gen-packs:test`

- [ ] **Step 5: Commit**

```bash
git add package.json
git commit -m "Add scaffolding for sentence pack generator"
```

---

## Task 2: Verify Puppeteer can launch on this machine

**Why this task:** Puppeteer downloaded Chromium when it was installed, but if the install was partial or the cache was cleared, the generator will fail late. Confirm now before writing PDF code.

**Files:**
- Create (temporary): `scripts/sentence-pack/__tests__/puppeteer-smoke.test.mjs`

- [ ] **Step 1: Write a smoke test**

Create `scripts/sentence-pack/__tests__/puppeteer-smoke.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import puppeteer from 'puppeteer';

test('puppeteer launches Chromium and renders a page', async () => {
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    await page.setContent('<h1>hello</h1>');
    const text = await page.$eval('h1', el => el.textContent);
    assert.equal(text, 'hello');
  } finally {
    await browser.close();
  }
});
```

- [ ] **Step 2: Run the smoke test**

Run: `npm run gen-packs:test`
Expected: PASS. If it fails with "Could not find Chromium," run `npx puppeteer browsers install chrome` first, then retry.

- [ ] **Step 3: Commit the smoke test (we keep it — it's a regression guard)**

```bash
git add scripts/sentence-pack/__tests__/puppeteer-smoke.test.mjs
git commit -m "Add Puppeteer smoke test for sentence pack generator"
```

---

## Task 3: Source loader

**Files:**
- Create: `scripts/sentence-pack/load-sentences.mjs`
- Create: `scripts/sentence-pack/__tests__/load-sentences.test.mjs`

**Context:** The source file at `C:\Users\kitme\Desktop\CILI - Datas\data\sentencesData.ts` is 564,425 lines of TypeScript. Each sentence is a JSON-like object literal with fields `id, simplified, traditional, pinyin, english, lao?, thai?`. Parsing the whole TS file requires either a TS compiler or a regex extractor. We use regex — robust enough for this consistent generated file, and zero extra dependencies.

- [ ] **Step 1: Write failing test**

Create `scripts/sentence-pack/__tests__/load-sentences.test.mjs`:

```js
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
```

- [ ] **Step 2: Run tests to see them fail**

Run: `npm run gen-packs:test`
Expected: FAIL — `loadSentences` is not defined.

- [ ] **Step 3: Implement the loader**

Create `scripts/sentence-pack/load-sentences.mjs`:

```js
import { readFile } from 'node:fs/promises';

// Matches one record: "id": N, "simplified": "...", "traditional": "...", "pinyin": "...", "english": "..."
// English may contain escaped quotes (\").
const RECORD_RE = /"id":\s*(\d+),\s*"simplified":\s*"((?:[^"\\]|\\.)*)",\s*"traditional":\s*"(?:[^"\\]|\\.)*",\s*"pinyin":\s*"((?:[^"\\]|\\.)*)",\s*"english":\s*"((?:[^"\\]|\\.)*)"/g;

function unescape(s) {
  return s.replace(/\\(["\\])/g, '$1');
}

export async function loadSentences(path) {
  const text = await readFile(path, 'utf8');
  const records = [];
  let m;
  while ((m = RECORD_RE.exec(text)) !== null) {
    records.push({
      id: Number(m[1]),
      simplified: unescape(m[2]),
      pinyin: unescape(m[3]),
      english: unescape(m[4])
    });
  }
  return records;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run gen-packs:test`
Expected: PASS (all three loader tests, plus puppeteer-smoke).

- [ ] **Step 5: Sanity-check against real source**

Run:
```bash
node -e "import('./scripts/sentence-pack/load-sentences.mjs').then(async m => { const r = await m.loadSentences(process.env.SENTENCES_SOURCE || 'C:/Users/kitme/Desktop/CILI - Datas/data/sentencesData.ts'); console.log('Loaded:', r.length); console.log('First:', r[0]); })"
```

Expected: `Loaded: 62712` and a first-record object printout.

- [ ] **Step 6: Commit**

```bash
git add scripts/sentence-pack/load-sentences.mjs scripts/sentence-pack/__tests__/load-sentences.test.mjs
git commit -m "Add sentence loader for sentence pack generator"
```

---

## Task 4: Filter functions

**Files:**
- Create: `scripts/sentence-pack/selection.mjs`
- Create: `scripts/sentence-pack/__tests__/selection.test.mjs`

- [ ] **Step 1: Write failing tests for filters**

Create `scripts/sentence-pack/__tests__/selection.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nonAsciiLength, filterUsable } from '../selection.mjs';

test('nonAsciiLength counts non-ASCII characters only', () => {
  assert.equal(nonAsciiLength('hello'), 0);
  assert.equal(nonAsciiLength('你好'), 2);
  assert.equal(nonAsciiLength('你好。'), 3); // full-width period counts
  assert.equal(nonAsciiLength('我用Twitter'), 2); // ASCII letters ignored
  assert.equal(nonAsciiLength(''), 0);
});

test('filterUsable drops empty Chinese rows', () => {
  const records = [
    { id: 1, simplified: '你好。', pinyin: 'nǐ hǎo', english: 'Hello.' },
    { id: 2, simplified: 'all english here', pinyin: '', english: 'something' }
  ];
  const out = filterUsable(records);
  assert.equal(out.length, 1);
  assert.equal(out[0].id, 1);
});

test('filterUsable drops sentences with fewer than 5 non-ASCII chars', () => {
  const records = [
    { id: 1, simplified: '好。', pinyin: 'hǎo', english: 'Good.' },
    { id: 2, simplified: '滚！', pinyin: 'gǔn', english: 'Scram!' },
    { id: 3, simplified: '不知道。', pinyin: 'bù zhīdào', english: "Don't know." }, // 4 non-ASCII
    { id: 4, simplified: '我喜欢中文。', pinyin: 'wǒ xǐhuān zhōngwén', english: 'I like Chinese.' } // 6 non-ASCII
  ];
  const out = filterUsable(records);
  assert.equal(out.length, 1);
  assert.equal(out[0].id, 4);
});

test('filterUsable drops sentences containing any Latin character in Chinese field', () => {
  const records = [
    { id: 1, simplified: '我用Twitter上网。', pinyin: '...', english: 'I use Twitter.' },
    { id: 2, simplified: '今天是2026年。', pinyin: '...', english: 'Today is 2026.' },
    { id: 3, simplified: '我喜欢学中文。', pinyin: '...', english: 'I like learning Chinese.' }
  ];
  const out = filterUsable(records);
  assert.equal(out.length, 1);
  assert.equal(out[0].id, 3);
});
```

- [ ] **Step 2: Run tests to see them fail**

Run: `npm run gen-packs:test`
Expected: FAIL — `selection.mjs` doesn't exist.

- [ ] **Step 3: Implement the filters**

Create `scripts/sentence-pack/selection.mjs`:

```js
const ASCII_RE = /[\x00-\x7F]/g;
const ANY_ASCII_RE = /[\x00-\x7F]/;

export function nonAsciiLength(s) {
  return s.replace(ASCII_RE, '').length;
}

export function filterUsable(records) {
  return records.filter(r => {
    const len = nonAsciiLength(r.simplified);
    if (len < 5) return false;
    if (ANY_ASCII_RE.test(r.simplified)) return false;
    return true;
  });
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run gen-packs:test`
Expected: PASS — all filter tests now green.

- [ ] **Step 5: Commit**

```bash
git add scripts/sentence-pack/selection.mjs scripts/sentence-pack/__tests__/selection.test.mjs
git commit -m "Add filter functions for sentence pack selection"
```

---

## Task 5: Sort and slice

**Files:**
- Modify: `scripts/sentence-pack/selection.mjs`
- Modify: `scripts/sentence-pack/__tests__/selection.test.mjs`

- [ ] **Step 1: Add failing tests for sort and slice**

Append to `scripts/sentence-pack/__tests__/selection.test.mjs`:

```js
import { sortByLength, sliceForTier } from '../selection.mjs';

test('sortByLength sorts by non-ASCII length ascending, tiebreaks by id', () => {
  const records = [
    { id: 10, simplified: '我喜欢中文。', pinyin: '', english: '' }, // 6 chars
    { id: 5, simplified: '你好朋友。', pinyin: '', english: '' },   // 5 chars
    { id: 3, simplified: '你好朋友！', pinyin: '', english: '' }    // 5 chars — same length, lower id
  ];
  const out = sortByLength(records);
  assert.deepEqual(out.map(r => r.id), [3, 5, 10]);
});

test('sortByLength does not mutate the input array', () => {
  const records = [
    { id: 2, simplified: '你好朋友们。', pinyin: '', english: '' },
    { id: 1, simplified: '你好。', pinyin: '', english: '' }
  ];
  const originalOrder = records.map(r => r.id);
  sortByLength(records);
  assert.deepEqual(records.map(r => r.id), originalOrder);
});

test('sliceForTier returns the first N records', () => {
  const records = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1, simplified: '十个字符的句子哈哈', pinyin: '', english: ''
  }));
  assert.equal(sliceForTier(records, 10).length, 10);
  assert.equal(sliceForTier(records, 100).length, 100);
});

test('sliceForTier throws if asked for more than available', () => {
  const records = Array.from({ length: 5 }, (_, i) => ({ id: i, simplified: '', pinyin: '', english: '' }));
  assert.throws(() => sliceForTier(records, 10), /not enough sentences/i);
});
```

- [ ] **Step 2: Run tests to see them fail**

Run: `npm run gen-packs:test`
Expected: FAIL — `sortByLength` and `sliceForTier` not defined.

- [ ] **Step 3: Implement sort and slice**

Append to `scripts/sentence-pack/selection.mjs`:

```js
export function sortByLength(records) {
  return [...records].sort((a, b) => {
    const la = nonAsciiLength(a.simplified);
    const lb = nonAsciiLength(b.simplified);
    if (la !== lb) return la - lb;
    return a.id - b.id;
  });
}

export function sliceForTier(records, count) {
  if (records.length < count) {
    throw new Error(`not enough sentences: need ${count}, have ${records.length}`);
  }
  return records.slice(0, count);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run gen-packs:test`
Expected: PASS — sort and slice tests now green.

- [ ] **Step 5: Commit**

```bash
git add scripts/sentence-pack/selection.mjs scripts/sentence-pack/__tests__/selection.test.mjs
git commit -m "Add sort and slice for sentence pack selection"
```

---

## Task 6: Tier definitions

**Files:**
- Create: `scripts/sentence-pack/tiers.mjs`

**Context:** Single source of truth for tier metadata. Must match `src/data/products.ts:180-252`.

- [ ] **Step 1: Create the tier module**

Create `scripts/sentence-pack/tiers.mjs`:

```js
// Pack tiers, in launch order. `slug` matches the Gumroad permalink and the
// site's link in src/data/products.ts. `tagline` is used in the PDF subtitle.
export const TIERS = [
  { slug: 'starter',   name: 'Starter Sentence Pack',     count: 1000,  tagline: 'foundational' },
  { slug: 'practice',  name: 'Practice Sentence Pack',    count: 3000,  tagline: 'practical' },
  { slug: 'immersion', name: 'Immersion Sentence Pack',   count: 5000,  tagline: 'immersive' },
  { slug: 'advanced',  name: 'Advanced Sentence Pack',    count: 10000, tagline: 'comprehensive' },
  { slug: 'pro',       name: 'Pro Mastery Sentence Pack', count: 20000, tagline: 'extensive' },
  { slug: 'master',    name: 'Master Sentence Pack',      count: 30000, tagline: 'ultimate' }
];
```

- [ ] **Step 2: Commit**

```bash
git add scripts/sentence-pack/tiers.mjs
git commit -m "Add tier definitions for sentence pack generator"
```

---

## Task 7: TSV writer

**Files:**
- Create: `scripts/sentence-pack/writers/tsv.mjs`
- Create: `scripts/sentence-pack/__tests__/writers.test.mjs`

- [ ] **Step 1: Write failing tests**

Create `scripts/sentence-pack/__tests__/writers.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { writeTsv } from '../writers/tsv.mjs';

function tmpFile(name = 'out.tsv') {
  const dir = mkdtempSync(join(tmpdir(), 'pack-tsv-'));
  return join(dir, name);
}

test('writeTsv produces UTF-8 with BOM and tab-delimited rows', async () => {
  const path = tmpFile();
  const records = [
    { id: 1, simplified: '你好。', pinyin: 'nǐ hǎo.', english: 'Hello.' },
    { id: 2, simplified: '再见。', pinyin: 'zàijiàn.', english: 'Goodbye.' }
  ];
  await writeTsv(path, records);
  const raw = readFileSync(path);
  // BOM is bytes EF BB BF
  assert.equal(raw[0], 0xEF);
  assert.equal(raw[1], 0xBB);
  assert.equal(raw[2], 0xBF);
  const text = raw.slice(3).toString('utf8');
  const lines = text.split('\n').filter(Boolean);
  assert.equal(lines.length, 2);
  assert.equal(lines[0], '你好。\tnǐ hǎo.\tHello.');
  assert.equal(lines[1], '再见。\tzàijiàn.\tGoodbye.');
});

test('writeTsv strips tabs and newlines from field values to keep the format clean', async () => {
  const path = tmpFile();
  const records = [
    { id: 1, simplified: '你\t好。', pinyin: 'a\nb', english: 'c' }
  ];
  await writeTsv(path, records);
  const text = readFileSync(path, 'utf8').replace(/^﻿/, '');
  // Tabs and newlines inside fields would break import. Replace with single space.
  assert.equal(text.trim(), '你 好。\ta b\tc');
});
```

- [ ] **Step 2: Run tests to see them fail**

Run: `npm run gen-packs:test`
Expected: FAIL — `writeTsv` not defined.

- [ ] **Step 3: Implement writeTsv**

Create `scripts/sentence-pack/writers/tsv.mjs`:

```js
import { writeFile } from 'node:fs/promises';

const BOM = '﻿';

function cleanField(value) {
  return String(value).replace(/[\t\n\r]/g, ' ');
}

export async function writeTsv(path, records) {
  const lines = records.map(r =>
    [cleanField(r.simplified), cleanField(r.pinyin), cleanField(r.english)].join('\t')
  );
  await writeFile(path, BOM + lines.join('\n') + '\n', 'utf8');
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run gen-packs:test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/sentence-pack/writers/tsv.mjs scripts/sentence-pack/__tests__/writers.test.mjs
git commit -m "Add TSV writer for sentence pack generator"
```

---

## Task 8: JSON writer

**Files:**
- Create: `scripts/sentence-pack/writers/json.mjs`
- Modify: `scripts/sentence-pack/__tests__/writers.test.mjs`

- [ ] **Step 1: Add failing tests**

Append to `scripts/sentence-pack/__tests__/writers.test.mjs`:

```js
import { writeJson } from '../writers/json.mjs';

test('writeJson produces an array of objects with chinese/pinyin/english keys only', async () => {
  const path = tmpFile('out.json');
  const records = [
    { id: 1, simplified: '你好。', pinyin: 'nǐ hǎo.', english: 'Hello.' },
    { id: 2, simplified: '再见。', pinyin: 'zàijiàn.', english: 'Goodbye.' }
  ];
  await writeJson(path, records);
  const parsed = JSON.parse(readFileSync(path, 'utf8'));
  assert.equal(parsed.length, 2);
  assert.deepEqual(parsed[0], {
    chinese: '你好。',
    pinyin: 'nǐ hǎo.',
    english: 'Hello.'
  });
  // No leaked source fields (id, traditional, lao, thai)
  assert.deepEqual(Object.keys(parsed[0]).sort(), ['chinese', 'english', 'pinyin']);
});

test('writeJson is pretty-printed with 2-space indent', async () => {
  const path = tmpFile('out.json');
  await writeJson(path, [{ id: 1, simplified: '你', pinyin: 'n', english: 'h' }]);
  const text = readFileSync(path, 'utf8');
  assert.ok(text.includes('  "chinese"'), 'expected 2-space indent');
});
```

- [ ] **Step 2: Run tests to see them fail**

Run: `npm run gen-packs:test`
Expected: FAIL — `writeJson` not defined.

- [ ] **Step 3: Implement writeJson**

Create `scripts/sentence-pack/writers/json.mjs`:

```js
import { writeFile } from 'node:fs/promises';

export async function writeJson(path, records) {
  const out = records.map(r => ({
    chinese: r.simplified,
    pinyin: r.pinyin,
    english: r.english
  }));
  await writeFile(path, JSON.stringify(out, null, 2) + '\n', 'utf8');
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run gen-packs:test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/sentence-pack/writers/json.mjs scripts/sentence-pack/__tests__/writers.test.mjs
git commit -m "Add JSON writer for sentence pack generator"
```

---

## Task 9: Sidecar writers (README.txt and LICENSE.txt)

**Files:**
- Create: `scripts/sentence-pack/writers/sidecars.mjs`

**Why no test:** The text is static template output — testing it would just re-spell the strings. A spot-check in the integration run (Task 13) confirms the files appear and contain the right anchor text.

- [ ] **Step 1: Implement sidecar writers**

Create `scripts/sentence-pack/writers/sidecars.mjs`:

```js
import { writeFile } from 'node:fs/promises';

const ATTRIBUTION = `Sentences derived from the Tatoeba Project (https://tatoeba.org/), licensed under CC-BY 2.0 FR. Cleaned and reformatted for CILI. Original sentence contributors retain credit per Tatoeba's terms.`;

export async function writeReadme(path, { tierName, count }) {
  const body = `${tierName} — ${count.toLocaleString()} Chinese sentences with Pinyin and English

WHAT'S IN THIS DOWNLOAD
- cili-<tier>-sentence-pack.pdf   Print-ready reading copy
- cili-<tier>-sentence-pack.tsv   Tab-separated, import into any flashcard app
- cili-<tier>-sentence-pack.json  Same data as JSON for developers
- README.txt                      You are here
- LICENSE.txt                     Attribution for the source sentences

IMPORT INTO ANKI (most common path)
1. Open Anki desktop.
2. File -> Import, select the .tsv file.
3. In the import dialog: Type "Basic", Fields separated by "Tab",
   Field 1 -> Front, Field 2 -> Back (Pinyin), Field 3 -> Back (English).
   Or use a "Cloze" / custom note type with three fields.
4. Click Import.

IMPORT INTO OTHER APPS
- Quizlet:   "Import from Word, Excel, Google Docs" -> paste TSV contents.
- Mochi:     Settings -> Import -> CSV (set delimiter to Tab).
- RemNote:   Use the Spreadsheet import; map columns to Front / Back / Extra.
- Pleco:     Pleco Flashcards -> Import -> tab-delimited text.

TWO-FIELD-ONLY APPS
If your app supports only Front/Back (no third field), open the TSV in a
spreadsheet, create a new column with =C2&" - "&B2 to combine Pinyin and
English into one Back side, and import that.

QUESTIONS
Reach us at https://shop.cililearnchinese.com
`;
  await writeFile(path, body, 'utf8');
}

export async function writeLicense(path) {
  await writeFile(path, ATTRIBUTION + '\n', 'utf8');
}
```

- [ ] **Step 2: Commit**

```bash
git add scripts/sentence-pack/writers/sidecars.mjs
git commit -m "Add README and LICENSE sidecar writers"
```

---

## Task 10: PDF HTML template

**Files:**
- Create: `scripts/sentence-pack/pdf-template.mjs`

**Context:** Pure function that returns an HTML string. The Puppeteer writer (Task 11) renders this to PDF. Separating template from rendering means the template is inspectable in a browser for design tweaks.

- [ ] **Step 1: Implement the template**

Create `scripts/sentence-pack/pdf-template.mjs`:

```js
const ATTRIBUTION_HTML = `Sentences derived from the <a href="https://tatoeba.org/">Tatoeba Project</a>, licensed under CC-BY 2.0 FR. Cleaned and reformatted for CILI.`;

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderTemplate({ tierName, tagline, count, records }) {
  const sentenceRows = records.map((r, i) => `
    <div class="sentence">
      <div class="num">${i + 1}</div>
      <div class="content">
        <div class="zh">${escapeHtml(r.simplified)}</div>
        <div class="py">${escapeHtml(r.pinyin)}</div>
        <div class="en">${escapeHtml(r.english)}</div>
      </div>
    </div>`).join('');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${escapeHtml(tierName)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&family=Inter:wght@400;600&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  html, body { font-family: 'Inter', sans-serif; color: #1a1a1a; }
  body { margin: 0; }
  .zh { font-family: 'Noto Sans SC', sans-serif; }
  .cover { page-break-after: always; padding: 60mm 0 0; text-align: center; }
  .cover h1 { font-size: 36pt; margin: 0 0 8mm; }
  .cover .sub { font-size: 14pt; color: #555; }
  .cover .count { font-size: 18pt; margin-top: 20mm; color: #333; }
  .cover .brand { margin-top: 30mm; font-size: 11pt; color: #777; }
  .sentence { display: flex; gap: 6mm; padding: 4mm 0; border-bottom: 1px solid #eee; page-break-inside: avoid; }
  .num { flex: 0 0 12mm; color: #aaa; font-size: 9pt; padding-top: 2mm; }
  .content { flex: 1; }
  .zh { font-size: 16pt; line-height: 1.4; }
  .py { font-size: 10pt; color: #666; margin-top: 1mm; }
  .en { font-size: 10pt; color: #333; margin-top: 1mm; }
  .colophon { page-break-before: always; padding-top: 60mm; text-align: center; font-size: 10pt; color: #555; }
  .colophon a { color: #555; }
</style>
</head>
<body>
  <section class="cover">
    <h1>${escapeHtml(tierName)}</h1>
    <div class="sub">${count.toLocaleString()} ${escapeHtml(tagline)} Chinese sentences</div>
    <div class="sub">with Pinyin and English translations</div>
    <div class="count">CILI · Learn Chinese</div>
    <div class="brand">shop.cililearnchinese.com</div>
  </section>
  <main>${sentenceRows}</main>
  <section class="colophon">
    <p>${ATTRIBUTION_HTML}</p>
    <p>&copy; CILI · <a href="https://shop.cililearnchinese.com">shop.cililearnchinese.com</a></p>
  </section>
</body>
</html>`;
}
```

- [ ] **Step 2: Visual sanity check (write HTML to disk and open in a browser)**

Run:
```bash
node -e "import('./scripts/sentence-pack/pdf-template.mjs').then(m => { const html = m.renderTemplate({ tierName: 'Starter Sentence Pack', tagline: 'foundational', count: 3, records: [{ simplified: '你好。', pinyin: 'nǐ hǎo.', english: 'Hello.' }, { simplified: '我喜欢学中文。', pinyin: 'wǒ xǐhuān xué zhōngwén.', english: 'I like learning Chinese.' }, { simplified: '今天天气很好。', pinyin: 'jīntiān tiānqì hěn hǎo.', english: 'The weather is nice today.' }] }); require('fs').writeFileSync('tmp-preview.html', html); console.log('Wrote tmp-preview.html'); })"
```

Open `tmp-preview.html` in a browser. Verify:
- Cover page shows title, count, brand
- Three sentences render with Chinese + Pinyin + English
- Colophon page shows Tatoeba attribution

Then delete: `rm tmp-preview.html`

- [ ] **Step 3: Commit**

```bash
git add scripts/sentence-pack/pdf-template.mjs
git commit -m "Add PDF HTML template for sentence packs"
```

---

## Task 11: Puppeteer PDF writer

**Files:**
- Create: `scripts/sentence-pack/writers/pdf.mjs`

**Context:** Launches a headless Chromium, sets the HTML content, waits for fonts to load, exports as PDF. No unit test — this is integration and is verified end-to-end in Task 13.

- [ ] **Step 1: Implement writePdf**

Create `scripts/sentence-pack/writers/pdf.mjs`:

```js
import puppeteer from 'puppeteer';
import { renderTemplate } from '../pdf-template.mjs';

let cachedBrowser = null;

async function getBrowser() {
  if (!cachedBrowser) {
    cachedBrowser = await puppeteer.launch();
  }
  return cachedBrowser;
}

export async function closeBrowser() {
  if (cachedBrowser) {
    await cachedBrowser.close();
    cachedBrowser = null;
  }
}

export async function writePdf(path, { tierName, tagline, count, records }) {
  const html = renderTemplate({ tierName, tagline, count, records });
  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.evaluateHandle('document.fonts.ready');
    await page.pdf({
      path,
      format: 'A4',
      printBackground: true,
      margin: { top: '18mm', bottom: '18mm', left: '16mm', right: '16mm' }
    });
  } finally {
    await page.close();
  }
}
```

- [ ] **Step 2: Smoke-test the PDF writer with three sentences**

Run:
```bash
node -e "import('./scripts/sentence-pack/writers/pdf.mjs').then(async m => { await m.writePdf('tmp-test.pdf', { tierName: 'Test Pack', tagline: 'test', count: 3, records: [{ simplified: '你好。', pinyin: 'nǐ hǎo.', english: 'Hello.' }, { simplified: '我喜欢学中文。', pinyin: 'wǒ xǐhuān xué zhōngwén.', english: 'I like learning Chinese.' }, { simplified: '今天天气很好。', pinyin: 'jīntiān tiānqì hěn hǎo.', english: 'The weather is nice today.' }] }); await m.closeBrowser(); console.log('Wrote tmp-test.pdf'); })"
```

Open `tmp-test.pdf`. Verify:
- Chinese characters render (no tofu boxes)
- 3 sentences appear in order
- Colophon page has Tatoeba attribution
- File size is reasonable (under 200 KB for 3 sentences)

Delete: `rm tmp-test.pdf`

- [ ] **Step 3: Commit**

```bash
git add scripts/sentence-pack/writers/pdf.mjs
git commit -m "Add Puppeteer PDF writer for sentence packs"
```

---

## Task 12: Orchestrator (entry point)

**Files:**
- Create: `scripts/generate-sentence-packs.mjs`

- [ ] **Step 1: Implement the orchestrator**

Create `scripts/generate-sentence-packs.mjs`:

```js
import { mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadSentences } from './sentence-pack/load-sentences.mjs';
import { filterUsable, sortByLength, sliceForTier } from './sentence-pack/selection.mjs';
import { TIERS } from './sentence-pack/tiers.mjs';
import { writeTsv } from './sentence-pack/writers/tsv.mjs';
import { writeJson } from './sentence-pack/writers/json.mjs';
import { writeReadme, writeLicense } from './sentence-pack/writers/sidecars.mjs';
import { writePdf, closeBrowser } from './sentence-pack/writers/pdf.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const OUT_DIR = join(REPO_ROOT, 'dist', 'sentence-packs');
const DEFAULT_SOURCE = 'C:/Users/kitme/Desktop/CILI - Datas/data/sentencesData.ts';

async function main() {
  const source = process.env.SENTENCES_SOURCE || DEFAULT_SOURCE;
  console.log(`Loading sentences from: ${source}`);
  const raw = await loadSentences(source);
  console.log(`  loaded ${raw.length.toLocaleString()} records`);

  const usable = filterUsable(raw);
  console.log(`Filtered to ${usable.length.toLocaleString()} usable sentences`);

  const largestTier = TIERS[TIERS.length - 1];
  if (usable.length < largestTier.count) {
    throw new Error(
      `Filter retained only ${usable.length} sentences, but ${largestTier.name} requires ${largestTier.count}. ` +
      `Loosen the filters or expand the source data.`
    );
  }

  const sorted = sortByLength(usable);

  for (const tier of TIERS) {
    const tierDir = join(OUT_DIR, tier.slug);
    await mkdir(tierDir, { recursive: true });
    const slice = sliceForTier(sorted, tier.count);
    const base = `cili-${tier.slug}-sentence-pack`;

    console.log(`\nBuilding ${tier.name} (${tier.count.toLocaleString()} sentences)`);
    await writeTsv(join(tierDir, `${base}.tsv`), slice);
    console.log('  ✓ TSV');
    await writeJson(join(tierDir, `${base}.json`), slice);
    console.log('  ✓ JSON');
    await writeReadme(join(tierDir, 'README.txt'), { tierName: tier.name, count: tier.count });
    await writeLicense(join(tierDir, 'LICENSE.txt'));
    console.log('  ✓ README, LICENSE');
    await writePdf(join(tierDir, `${base}.pdf`), {
      tierName: tier.name,
      tagline: tier.tagline,
      count: tier.count,
      records: slice
    });
    console.log('  ✓ PDF');
  }

  await closeBrowser();
  console.log(`\nDone. Output in ${OUT_DIR}`);
}

main().catch(err => {
  console.error(err);
  closeBrowser().finally(() => process.exit(1));
});
```

- [ ] **Step 2: Commit**

```bash
git add scripts/generate-sentence-packs.mjs
git commit -m "Add sentence pack generator orchestrator"
```

---

## Task 13: End-to-end run and acceptance checks

**Files:**
- Create (temporary): `scripts/sentence-pack/__tests__/acceptance.test.mjs`

- [ ] **Step 1: Run the full generator**

Run: `npm run gen-packs`

Expected: progress logs for each of the 6 tiers, finishing with `Done. Output in .../dist/sentence-packs`. Total runtime ~2–8 minutes depending on machine (Master tier PDF is 30K rows).

If it fails with "Filter retained only N sentences," confirm the source path is correct. If it fails with Puppeteer errors, re-run Task 2.

- [ ] **Step 2: Write acceptance test**

Create `scripts/sentence-pack/__tests__/acceptance.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TIERS } from '../tiers.mjs';
import { nonAsciiLength } from '../selection.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', '..', '..', 'dist', 'sentence-packs');

test('each tier produced all 5 deliverable files', () => {
  for (const tier of TIERS) {
    const base = `cili-${tier.slug}-sentence-pack`;
    const dir = join(OUT_DIR, tier.slug);
    for (const f of [`${base}.pdf`, `${base}.tsv`, `${base}.json`, 'README.txt', 'LICENSE.txt']) {
      const p = join(dir, f);
      assert.ok(existsSync(p), `missing ${p}`);
      assert.ok(statSync(p).size > 0, `${p} is empty`);
    }
  }
});

test('each tier JSON has exactly the right count of records', () => {
  for (const tier of TIERS) {
    const p = join(OUT_DIR, tier.slug, `cili-${tier.slug}-sentence-pack.json`);
    const data = JSON.parse(readFileSync(p, 'utf8'));
    assert.equal(data.length, tier.count, `${tier.slug}: expected ${tier.count}, got ${data.length}`);
  }
});

test('JSON records have only the expected keys', () => {
  const sample = JSON.parse(readFileSync(join(OUT_DIR, 'starter', 'cili-starter-sentence-pack.json'), 'utf8'));
  assert.deepEqual(Object.keys(sample[0]).sort(), ['chinese', 'english', 'pinyin']);
});

test('each pack is a strict prefix of the next larger pack', () => {
  const jsons = TIERS.map(t =>
    JSON.parse(readFileSync(join(OUT_DIR, t.slug, `cili-${t.slug}-sentence-pack.json`), 'utf8'))
  );
  for (let i = 0; i < jsons.length - 1; i++) {
    const smaller = jsons[i];
    const larger = jsons[i + 1];
    for (let j = 0; j < smaller.length; j++) {
      assert.deepEqual(smaller[j], larger[j],
        `${TIERS[i].slug}[${j}] should equal ${TIERS[i + 1].slug}[${j}]`);
    }
  }
});

test('every sentence has at least 5 non-ASCII chars and no Latin chars in Chinese field', () => {
  const data = JSON.parse(readFileSync(join(OUT_DIR, 'master', 'cili-master-sentence-pack.json'), 'utf8'));
  for (let i = 0; i < data.length; i++) {
    assert.ok(nonAsciiLength(data[i].chinese) >= 5, `row ${i} too short: "${data[i].chinese}"`);
    assert.ok(!/[\x00-\x7F]/.test(data[i].chinese), `row ${i} has ASCII: "${data[i].chinese}"`);
  }
});

test('TSV row count matches JSON record count for every tier', () => {
  for (const tier of TIERS) {
    const tsv = readFileSync(join(OUT_DIR, tier.slug, `cili-${tier.slug}-sentence-pack.tsv`), 'utf8')
      .replace(/^﻿/, '');
    const lines = tsv.split('\n').filter(Boolean);
    assert.equal(lines.length, tier.count, `${tier.slug}: TSV has ${lines.length} rows, expected ${tier.count}`);
  }
});

test('TSV row N matches JSON record N for the starter pack', () => {
  const tsv = readFileSync(join(OUT_DIR, 'starter', 'cili-starter-sentence-pack.tsv'), 'utf8')
    .replace(/^﻿/, '')
    .split('\n').filter(Boolean);
  const json = JSON.parse(readFileSync(join(OUT_DIR, 'starter', 'cili-starter-sentence-pack.json'), 'utf8'));
  for (let i = 0; i < 50; i++) { // spot-check first 50
    const [zh, py, en] = tsv[i].split('\t');
    assert.equal(zh, json[i].chinese);
    assert.equal(py, json[i].pinyin);
    assert.equal(en, json[i].english);
  }
});

test('LICENSE.txt contains Tatoeba attribution', () => {
  const license = readFileSync(join(OUT_DIR, 'starter', 'LICENSE.txt'), 'utf8');
  assert.ok(license.includes('Tatoeba'), 'LICENSE.txt missing Tatoeba attribution');
  assert.ok(license.includes('CC-BY 2.0 FR'), 'LICENSE.txt missing CC-BY 2.0 FR mention');
});
```

- [ ] **Step 3: Run the acceptance test**

Run: `npm run gen-packs:test`
Expected: PASS — all acceptance tests green (in addition to existing unit and smoke tests).

- [ ] **Step 4: Spot-check one PDF manually**

Open `dist/sentence-packs/starter/cili-starter-sentence-pack.pdf`:
- Verify cover page reads "Starter Sentence Pack" / "1,000 foundational Chinese sentences"
- Verify Chinese characters render (no boxes)
- Verify pagination flows naturally (no orphaned single rows)
- Verify last page shows Tatoeba attribution

- [ ] **Step 5: Commit the acceptance tests**

```bash
git add scripts/sentence-pack/__tests__/acceptance.test.mjs
git commit -m "Add acceptance tests for sentence pack generator outputs"
```

---

## Task 14: Anki import spot-check (manual, no commit)

**Files:** none

**Why no code:** Verifies the deliverable is actually usable. Run once, by hand. If it fails, file a bug and revisit the TSV writer.

- [ ] **Step 1: Open Anki desktop**

If not installed, skip — this task can wait until the buyer-facing flow needs a known-good demo.

- [ ] **Step 2: Import the starter TSV**

In Anki: File → Import → select `dist/sentence-packs/starter/cili-starter-sentence-pack.tsv`.

In the import dialog: Type "Basic", Fields separated by "Tab", Allow HTML in fields OFF, click Import.

- [ ] **Step 3: Verify**

- 1,000 notes added
- First card front shows a Chinese sentence; back shows pinyin + English
- No mojibake (UTF-8 issues)

If anything is wrong, capture details and open an issue — do not silently patch.

---

## Self-Review Notes

**Spec coverage check:** Selection algorithm ✓ (Task 4–5), Pack tiers ✓ (Task 6), PDF format ✓ (Task 10–11), TSV ✓ (Task 7), JSON ✓ (Task 8), Attribution ✓ (Task 9–10), File layout ✓ (Task 12), Acceptance criteria 1–7 ✓ (Task 13). Site `PreOrder`→`InStock` flip is explicitly out of scope per the spec — separate follow-on task, not included here.

**Type consistency:** Source loader returns `{id, simplified, pinyin, english}`. Filters and sort operate on this same shape. Writers take this same shape and re-key to output schemas (TSV uses positional columns, JSON uses `chinese/pinyin/english`). Tier objects use `{slug, name, count, tagline}` consistently.

**No placeholders:** All code blocks contain complete, runnable code. Commands have exact paths and expected output.
