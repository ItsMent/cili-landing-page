// Generates HSK 1-6 vocabulary packs (Standard + Extended variants).
// Source: HSK_QUIZDATA_PLUS_MANYEXAMPLESENTENCES/HSK{1-6}/HSK{n}_vocabulary.json
// Each source file: 150/150/300/600/1300/2500 words with 8 example sentences each.
// Standard variant takes the first 2 examples per word; Extended takes the first 4.
// Each pack ships PDF + TSV + JSON + README.txt + LICENSE.txt.
//
// Run: npm run gen-hsk-packs

import { mkdir, writeFile, access, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const OUT_DIR = join(REPO_ROOT, 'dist', 'hsk-packs');
const DEFAULT_SOURCE_DIR = 'C:/Users/kitme/Desktop/CILI - Datas/HSK_QUIZDATA_PLUS_MANYEXAMPLESENTENCES';

const LEVELS = [1, 2, 3, 4, 5, 6];
const VARIANTS = [
  { name: 'standard', label: 'Standard', examplesPerWord: 2 },
  { name: 'extended', label: 'Extended', examplesPerWord: 4 }
];

const ATTRIBUTION = `Vocabulary and example sentences curated by CILI for HSK study. Lao and Thai translations included in the source database; this pack delivers English translations alongside Pinyin.`;

function cleanTsvField(value) {
  return String(value ?? '').replace(/[\t\n\r]/g, ' ');
}

async function loadLevel(sourceDir, level) {
  const path = join(sourceDir, `HSK${level}`, `HSK${level}_vocabulary.json`);
  const text = await readFile(path, 'utf8');
  return JSON.parse(text);
}

function buildRecord(word, examplesPerWord) {
  const ex = [];
  const zh = word.examples_chinese || [];
  const py = word.examples_pinyin || [];
  const en = word.examples_english || [];
  const n = Math.min(examplesPerWord, zh.length, py.length, en.length);
  for (let i = 0; i < n; i++) {
    ex.push({ chinese: zh[i], pinyin: py[i], english: en[i] });
  }
  return {
    chinese: word.chinese,
    pinyin: word.pinyin,
    english: word.meaning,
    examples: ex
  };
}

function formatExamplesForTsv(examples) {
  return examples
    .map((e, i) => `${i + 1}. ${e.chinese} (${e.pinyin}) — ${e.english}`)
    .join(' | ');
}

async function writeTsv(path, records) {
  const BOM = '﻿';
  const header = ['Chinese', 'Pinyin', 'English', 'Examples'].join('\t');
  const lines = records.map(r => [
    cleanTsvField(r.chinese),
    cleanTsvField(r.pinyin),
    cleanTsvField(r.english),
    cleanTsvField(formatExamplesForTsv(r.examples))
  ].join('\t'));
  await writeFile(path, BOM + header + '\n' + lines.join('\n') + '\n', 'utf8');
}

async function writeJson(path, records) {
  await writeFile(path, JSON.stringify(records, null, 2) + '\n', 'utf8');
}

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderHtml({ tierName, tagline, wordCount, sentenceCount, records }) {
  const rows = records.map((r, i) => `
    <div class="word">
      <div class="num">${i + 1}</div>
      <div class="content">
        <div class="head">
          <span class="zh">${escapeHtml(r.chinese)}</span>
          <span class="py">${escapeHtml(r.pinyin)}</span>
        </div>
        <div class="meaning">${escapeHtml(r.english)}</div>
        <ul class="examples">
          ${r.examples.map(ex => `
            <li>
              <div class="ex-zh">${escapeHtml(ex.chinese)}</div>
              <div class="ex-py">${escapeHtml(ex.pinyin)}</div>
              <div class="ex-en">${escapeHtml(ex.english)}</div>
            </li>`).join('')}
        </ul>
      </div>
    </div>`).join('');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${escapeHtml(tierName)}</title>
<style>
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  html, body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a1a; margin: 0; }
  .zh, .ex-zh { font-family: 'Microsoft YaHei', 'PingFang SC', 'SimSun', 'Noto Sans SC', sans-serif; }
  .cover { page-break-after: always; padding: 60mm 0 0; text-align: center; }
  .cover h1 { font-size: 36pt; margin: 0 0 8mm; }
  .cover .sub { font-size: 14pt; color: #555; }
  .cover .count { font-size: 16pt; margin-top: 20mm; color: #333; }
  .cover .brand { margin-top: 30mm; font-size: 11pt; color: #777; }
  .word { display: flex; gap: 6mm; padding: 5mm 0; border-bottom: 1px solid #eee; page-break-inside: avoid; }
  .num { flex: 0 0 12mm; color: #aaa; font-size: 9pt; padding-top: 2mm; }
  .content { flex: 1; }
  .head { display: flex; align-items: baseline; gap: 6mm; }
  .head .zh { font-size: 20pt; line-height: 1.2; }
  .head .py { font-size: 11pt; color: #666; }
  .meaning { font-size: 11pt; color: #333; margin-top: 1mm; }
  ul.examples { list-style: none; padding: 0; margin: 3mm 0 0; }
  ul.examples li { padding: 2mm 0; padding-left: 4mm; border-left: 2px solid #f0f0f0; margin-bottom: 2mm; }
  .ex-zh { font-size: 12pt; }
  .ex-py { font-size: 9pt; color: #666; margin-top: 0.5mm; }
  .ex-en { font-size: 9pt; color: #333; margin-top: 0.5mm; }
  .colophon { page-break-before: always; padding-top: 60mm; text-align: center; font-size: 10pt; color: #555; }
  .colophon a { color: #555; }
</style>
</head>
<body>
  <section class="cover">
    <h1>${escapeHtml(tierName)}</h1>
    <div class="sub">${wordCount.toLocaleString()} ${escapeHtml(tagline)} HSK vocabulary words</div>
    <div class="sub">with ${sentenceCount.toLocaleString()} example sentences, Pinyin, and English translations</div>
    <div class="count">CILI · Learn Chinese</div>
    <div class="brand">shop.cililearnchinese.com</div>
  </section>
  <main>${rows}</main>
  <section class="colophon">
    <p>Vocabulary and example sentences curated by CILI for HSK study.</p>
    <p>&copy; CILI · <a href="https://shop.cililearnchinese.com">shop.cililearnchinese.com</a></p>
  </section>
</body>
</html>`;
}

async function writePdf(browser, path, opts) {
  const page = await browser.newPage();
  try {
    await page.setContent(renderHtml(opts), { waitUntil: 'load', timeout: 0 });
    await page.evaluate(() => document.fonts.ready).catch(() => {});
    await page.pdf({
      path,
      format: 'A4',
      printBackground: true,
      margin: { top: '18mm', bottom: '18mm', left: '16mm', right: '16mm' },
      timeout: 0
    });
  } finally {
    await page.close();
  }
}

function readmeText({ tierName, wordCount, sentenceCount, level, variant }) {
  return `${tierName} — ${wordCount.toLocaleString()} HSK ${level} words with ${sentenceCount.toLocaleString()} example sentences

WHAT'S IN THIS DOWNLOAD
- *.pdf   Print-ready reading copy
- *.tsv   Tab-separated, import into any flashcard app
- *.json  Same data plus structured examples, for developers
- README.txt    You are here
- LICENSE.txt   Attribution and usage notes

THE TSV COLUMNS
1. Chinese    — the HSK word in simplified Chinese
2. Pinyin     — Hanyu Pinyin with tone marks
3. English    — meaning
4. Examples   — ${variant === 'standard' ? '2' : '4'} example sentences joined with " | "

IMPORT INTO ANKI
1. Open Anki desktop.
2. File -> Import, select the .tsv file.
3. In the import dialog: Allow HTML in fields = OFF, First row is header = ON,
   Fields separated by "Tab". Map columns:
   Chinese -> Front, Pinyin -> Back1, English -> Back2, Examples -> Back3
   (or use a single-back note type with everything combined).
4. Click Import.

IMPORT INTO OTHER APPS
- Quizlet:   "Import from Word, Excel, Google Docs" -> paste TSV contents.
- Mochi:     Settings -> Import -> CSV (set delimiter to Tab).
- RemNote:   Spreadsheet import; map columns to fields.
- Pleco:     Pleco Flashcards -> Import -> tab-delimited text.

THE JSON
The JSON preserves the example sentences as structured objects so you can
render them however you like:
  [
    {
      "chinese": "...",
      "pinyin": "...",
      "english": "...",
      "examples": [
        { "chinese": "...", "pinyin": "...", "english": "..." }
      ]
    }
  ]

QUESTIONS
Reach us at https://shop.cililearnchinese.com
`;
}

async function buildPack({ level, variant, browser, sourceDir }) {
  const slug = `hsk${level}-${variant.name}`;
  const tierName = `HSK ${level} Vocabulary (${variant.label})`;
  const tagline = variant.label.toLowerCase();
  const base = `cili-hsk${level}-vocabulary-${variant.name}`;
  const tierDir = join(OUT_DIR, slug);
  await mkdir(tierDir, { recursive: true });

  const words = await loadLevel(sourceDir, level);
  const records = words.map(w => buildRecord(w, variant.examplesPerWord));
  const wordCount = records.length;
  const sentenceCount = records.reduce((s, r) => s + r.examples.length, 0);

  console.log(`\nBuilding ${tierName} — ${wordCount.toLocaleString()} words / ${sentenceCount.toLocaleString()} sentences`);
  await writeTsv(join(tierDir, `${base}.tsv`), records);
  console.log('  TSV done');
  await writeJson(join(tierDir, `${base}.json`), records);
  console.log('  JSON done');
  await writeFile(
    join(tierDir, 'README.txt'),
    readmeText({ tierName, wordCount, sentenceCount, level, variant: variant.name }),
    'utf8'
  );
  await writeFile(join(tierDir, 'LICENSE.txt'), ATTRIBUTION + '\n', 'utf8');
  console.log('  README + LICENSE done');

  const pdfPath = join(tierDir, `${base}.pdf`);
  const exists = await access(pdfPath).then(() => true, () => false);
  if (exists && !process.env.FORCE_PDF) {
    console.log('  PDF already exists, skipping (set FORCE_PDF=1 to regenerate)');
    return;
  }
  await writePdf(browser, pdfPath, { tierName, tagline, wordCount, sentenceCount, records });
  console.log('  PDF done');
}

async function main() {
  const sourceDir = process.env.HSK_SOURCE_DIR || DEFAULT_SOURCE_DIR;
  console.log(`Loading HSK vocabulary from: ${sourceDir}`);

  const browser = await puppeteer.launch({ protocolTimeout: 0 });
  try {
    for (const level of LEVELS) {
      for (const variant of VARIANTS) {
        await buildPack({ level, variant, browser, sourceDir });
      }
    }
  } finally {
    await browser.close();
  }

  console.log(`\nDone. Output in ${OUT_DIR}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
