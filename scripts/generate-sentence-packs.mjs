// Generates Starter / Practice / Immersion / Advanced / Pro / Master
// sentence packs from sentencesData.ts. Each pack is emitted as
// PDF + TSV + JSON + README.txt + LICENSE.txt under dist/sentence-packs/<tier>/.
//
// Selection rule: drop rows with no Chinese, with <5 non-ASCII chars, or with any
// Latin char in the Chinese field. Sort the rest by non-ASCII length (shortest
// first, tiebreak by id). Each tier is a strict prefix of the next larger tier.
//
// Run: npm run gen-packs

import { mkdir, writeFile, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import { loadSentences } from './sentence-pack/load-sentences.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const OUT_DIR = join(REPO_ROOT, 'dist', 'sentence-packs');
const DEFAULT_SOURCE = 'C:/Users/kitme/Desktop/CILI - Datas/data/sentencesData.ts';

const TIERS = [
  { slug: 'starter',   name: 'Starter Sentence Pack',     count: 1000,  tagline: 'foundational' },
  { slug: 'practice',  name: 'Practice Sentence Pack',    count: 3000,  tagline: 'practical' },
  { slug: 'immersion', name: 'Immersion Sentence Pack',   count: 5000,  tagline: 'immersive' },
  { slug: 'advanced',  name: 'Advanced Sentence Pack',    count: 10000, tagline: 'comprehensive' },
  { slug: 'pro',       name: 'Pro Mastery Sentence Pack', count: 20000, tagline: 'extensive' },
  { slug: 'master',    name: 'Master Sentence Pack',      count: 30000, tagline: 'ultimate' }
];

const ATTRIBUTION = `Sentences derived from the Tatoeba Project (https://tatoeba.org/), licensed under CC-BY 2.0 FR. Cleaned and reformatted for CILI. Original sentence contributors retain credit per Tatoeba's terms.`;

const ASCII_RE = /[\x00-\x7F]/g;
const ANY_ASCII_RE = /[\x00-\x7F]/;

function nonAsciiLength(s) {
  return s.replace(ASCII_RE, '').length;
}

function filterUsable(records) {
  return records.filter(r => {
    if (nonAsciiLength(r.simplified) < 5) return false;
    if (ANY_ASCII_RE.test(r.simplified)) return false;
    return true;
  });
}

function sortByLength(records) {
  return [...records].sort((a, b) => {
    const la = nonAsciiLength(a.simplified);
    const lb = nonAsciiLength(b.simplified);
    return la - lb || a.id - b.id;
  });
}

function cleanTsvField(value) {
  return String(value).replace(/[\t\n\r]/g, ' ');
}

async function writeTsv(path, records) {
  const BOM = '﻿';
  const lines = records.map(r =>
    [cleanTsvField(r.simplified), cleanTsvField(r.pinyin), cleanTsvField(r.english)].join('\t')
  );
  await writeFile(path, BOM + lines.join('\n') + '\n', 'utf8');
}

async function writeJson(path, records) {
  const out = records.map(r => ({
    chinese: r.simplified,
    pinyin: r.pinyin,
    english: r.english
  }));
  await writeFile(path, JSON.stringify(out, null, 2) + '\n', 'utf8');
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderHtml({ tierName, tagline, count, records }) {
  const rows = records.map((r, i) => `
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
<style>
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  html, body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a1a; margin: 0; }
  .zh { font-family: 'Microsoft YaHei', 'PingFang SC', 'SimSun', 'Noto Sans SC', sans-serif; }
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
  <main>${rows}</main>
  <section class="colophon">
    <p>Sentences derived from the <a href="https://tatoeba.org/">Tatoeba Project</a>, licensed under CC-BY 2.0 FR. Cleaned and reformatted for CILI.</p>
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

function readmeText({ tierName, count }) {
  return `${tierName} — ${count.toLocaleString()} Chinese sentences with Pinyin and English

WHAT'S IN THIS DOWNLOAD
- *.pdf   Print-ready reading copy
- *.tsv   Tab-separated, import into any flashcard app
- *.json  Same data as JSON for developers
- README.txt    You are here
- LICENSE.txt   Attribution for the source sentences

IMPORT INTO ANKI
1. Open Anki desktop.
2. File -> Import, select the .tsv file.
3. Type "Basic", Fields separated by "Tab",
   Field 1 -> Front, Field 2 -> Back (Pinyin), Field 3 -> Back (English).
4. Click Import.

IMPORT INTO OTHER APPS
- Quizlet:   "Import from Word, Excel, Google Docs" -> paste TSV contents.
- Mochi:     Settings -> Import -> CSV (set delimiter to Tab).
- RemNote:   Use the Spreadsheet import; map columns to Front / Back / Extra.
- Pleco:     Pleco Flashcards -> Import -> tab-delimited text.

TWO-FIELD-ONLY APPS
If your app supports only Front/Back, open the TSV in a spreadsheet,
create a new column with =C2&" - "&B2 to combine Pinyin and English,
and import that.

QUESTIONS
Reach us at https://shop.cililearnchinese.com
`;
}

async function buildTier({ tier, sorted, browser }) {
  const tierDir = join(OUT_DIR, tier.slug);
  await mkdir(tierDir, { recursive: true });
  const slice = sorted.slice(0, tier.count);
  const base = `cili-${tier.slug}-sentence-pack`;

  console.log(`\nBuilding ${tier.name} (${tier.count.toLocaleString()} sentences)`);
  await writeTsv(join(tierDir, `${base}.tsv`), slice);
  console.log('  TSV done');
  await writeJson(join(tierDir, `${base}.json`), slice);
  console.log('  JSON done');
  await writeFile(join(tierDir, 'README.txt'), readmeText(tier), 'utf8');
  await writeFile(join(tierDir, 'LICENSE.txt'), ATTRIBUTION + '\n', 'utf8');
  console.log('  README + LICENSE done');
  const pdfPath = join(tierDir, `${base}.pdf`);
  const exists = await access(pdfPath).then(() => true, () => false);
  if (exists && !process.env.FORCE_PDF) {
    console.log('  PDF already exists, skipping (set FORCE_PDF=1 to regenerate)');
    return;
  }
  await writePdf(browser, pdfPath, {
    tierName: tier.name,
    tagline: tier.tagline,
    count: tier.count,
    records: slice
  });
  console.log('  PDF done');
}

async function main() {
  const source = process.env.SENTENCES_SOURCE || DEFAULT_SOURCE;
  console.log(`Loading sentences from: ${source}`);
  const raw = await loadSentences(source);
  console.log(`  loaded ${raw.length.toLocaleString()} records`);

  const usable = filterUsable(raw);
  console.log(`Filtered to ${usable.length.toLocaleString()} usable sentences`);

  const largest = TIERS[TIERS.length - 1];
  if (usable.length < largest.count) {
    throw new Error(
      `Filter retained only ${usable.length} sentences, but ${largest.name} requires ${largest.count}.`
    );
  }

  const sorted = sortByLength(usable);

  const browser = await puppeteer.launch({ protocolTimeout: 0 });
  try {
    for (const tier of TIERS) {
      await buildTier({ tier, sorted, browser });
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
