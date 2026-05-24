---
date: 2026-05-24
status: draft
owners: ItsMent
---

# Sentence Pack Generator — Design Spec

## Scope note

This started as "help me set up Gumroad for the Master sentence pack." During exploration we discovered no sentence-pack PDFs exist yet, the source data is excellent, and the right move is to build a single generator that produces all six packs (Starter through Master) in PDF, CSV, and JSON together. This spec describes that generator. Gumroad setup walkthroughs are now downstream of having the deliverable files ready.

## Goal

One TypeScript script in the Landing Page repo that, when run, produces every sentence-pack deliverable file ready to upload to Gumroad. Output is deterministic, reproducible, and consistent across formats — buyers of any pack get the same sentences in PDF, CSV, and JSON.

## Source data

- File: `C:\Users\kitme\Desktop\CILI - Datas\data\sentencesData.ts`
- Shape: `SentenceData[]` with fields `id`, `simplified`, `traditional`, `pinyin`, `english`, optional `thai`, optional `lao`
- Volume: 62,712 sentences
- Provenance: derived from Tatoeba via [krmanik/Chinese-Example-Sentences](https://github.com/krmanik/Chinese-Example-Sentences), with cleaner English translations applied (2025-09-04 generation timestamp in file header)

## Pack tiers

| Pack | Sentence count | Price (USD) | Permalink |
|---|---|---|---|
| Starter | 1,000 | 6.99 | `starter-sentences` |
| Practice | 3,000 | 14.99 | `practice-sentences` |
| Immersion | 5,000 | 19.99 | `immersion-sentences` |
| Advanced | 10,000 | 39.99 | `advanced-sentences` |
| Pro Mastery | 20,000 | 79.99 | `pro-sentences` |
| Master | 30,000 | 89.99 | `master-sentences` |

These match `src/data/products.ts` (lines 180–252) exactly. Permalinks must not change — the live site already links to them.

## Selection algorithm

Packs are **nested supersets**. Buying Master gives you every sentence in Pro, which contains every sentence in Advanced, and so on down to Starter. This means a buyer who upgrades is never paying twice for the same sentence.

Define **non-ASCII length** as: count of characters in the `simplified` field that do *not* match `/[\x00-\x7F]/`. This counts CJK ideographs *and* full-width Chinese punctuation (。，！？), which matches the validation we already ran. Simple, deterministic, and exactly what the filter rules below assume.

Pipeline:

1. **Load** `sentencesData.ts` → array of 62,712 records.
2. **Filter step 1 (junk):** drop rows where the `simplified` field has zero non-ASCII characters. Validation showed 5 such rows (English/Malay text in the Chinese column).
3. **Filter step 2 (interjections):** drop rows where the `simplified` field has fewer than 5 non-ASCII characters. Without this, the top-sorted 1,000 are interjections like `啊!` `好` `滚。` — unsellable as "foundational sentences."
4. **Filter step 3 (Latin contamination):** drop rows where the `simplified` field contains any ASCII character (Latin letter, digit, or ASCII punctuation). Catches sentences like `我用Twitter` and Tatoeba date numerals.
5. **Sort:** by non-ASCII length ascending, then by `id` ascending as deterministic tiebreaker.
6. **Slice:**
   - Starter = sorted[0:1000]
   - Practice = sorted[0:3000]
   - Immersion = sorted[0:5000]
   - Advanced = sorted[0:10000]
   - Pro = sorted[0:20000]
   - Master = sorted[0:30000]

The filter is expected to retain roughly 61,500 of the 62,712 sentences — enough headroom for the 30K Master pack.

If the filter ever leaves fewer than 30,000 records, the generator must fail loudly rather than silently producing a short pack.

## Output formats

Each pack produces three files. Buyers receive all three from a single Gumroad product (Gumroad supports multiple files per product).

### PDF

- Purpose: human reading, printing, casual reference
- Layout: one sentence per row, three lines stacked: Simplified Chinese (large), Pinyin (medium, gray), English (medium)
- Font: a Chinese-capable web font (Noto Sans SC or similar) loaded via HTML
- First page: title, subtitle ("N foundational/practice/etc. Chinese sentences"), CILI branding, Tatoeba attribution
- Last page: colophon with full CC-BY 2.0 FR attribution and link back to the CILI shop

### TSV (universal flashcard format)

- Purpose: direct import into **any flashcard app that accepts TSV/CSV** — Anki, Quizlet, Mochi, RemNote, Pleco, Brainscape, Memrise, and similar. TSV is the lowest-common-denominator format across the category.
- Encoding: UTF-8 with BOM (Anki on Windows needs BOM to detect UTF-8 reliably; other apps tolerate BOM)
- Delimiter: tab — full-width Chinese commas would create ambiguous quoting if we used real CSV
- Filename: `.tsv` extension (unambiguous — `.csv` confuses Excel and some apps into trying comma parsing)
- No header row (Anki's default import flow doesn't expect one; most apps treat the first row as data unless told otherwise)
- Columns, in order:
  1. Simplified Chinese (from source `simplified`)
  2. Pinyin (from source `pinyin`)
  3. English (from source `english`)
- Sister file `README.txt` shipped alongside, covering:
  - A three-step Anki import recipe (most popular target)
  - One-line notes for Quizlet, Mochi, RemNote, Pleco
  - A workaround for two-field-only apps: combine columns 2+3 in a spreadsheet so the Back side shows `pinyin — english`

### JSON

- Purpose: programmatic consumption (developers, custom flashcard tools)
- Encoding: UTF-8, no BOM
- Shape: array of objects
- Schema per object — exact field mapping from source:
  ```json
  { "chinese": "<simplified>", "pinyin": "<pinyin>", "english": "<english>" }
  ```
- Source fields `id`, `traditional`, `lao`, `thai` are intentionally omitted to keep the dev deliverable focused and lightweight. (Reconsider if buyers ask for traditional or upstream IDs.)
- Pretty-printed (2-space indent) for human inspection
- Attribution shipped as a sister `LICENSE.txt`, not embedded in the JSON

## Attribution requirements

Tatoeba is **CC-BY 2.0 FR**. Commercial use is allowed; attribution is required. There is no ShareAlike clause, so paid downstream distribution of derivatives is permitted.

The credit block must appear in all three deliverables and on the Gumroad listing.

Block to use verbatim:

> Sentences derived from the Tatoeba Project (https://tatoeba.org/), licensed under CC-BY 2.0 FR. Cleaned and reformatted for CILI. Original sentence contributors retain credit per Tatoeba's terms.

Placement:
- **PDF**: colophon on the last page
- **CSV bundle**: in the sister `README.txt`
- **JSON**: in a leading comment-style key, e.g. `"_attribution": "Sentences..."` as the first array element with `_meta: true`, OR shipped as a sister `LICENSE.txt`. The sister file is cleaner; pick that.
- **Gumroad listing**: one line near the bottom of the product description

## Tooling

- **Language**: TypeScript (ts-node) or plain ESM JavaScript — matches existing `scripts/prerender.mjs` style
- **PDF**: Puppeteer (already in `devDependencies`). Render an HTML template to PDF, the same play `scripts/prerender.mjs` already uses. Handles Chinese fonts, line breaking, and pagination correctly.
- **CSV**: write directly with `fs.writeFileSync` — no library needed for tab-delimited output
- **JSON**: `JSON.stringify(..., null, 2)` and write

Out: pdf-lib. It's for editing existing PDFs, not typesetting from scratch — wrong tool for laying out Chinese text.

## File layout

Source data is read directly from outside the repo at `C:\Users\kitme\Desktop\CILI - Datas\data\sentencesData.ts`. (Long term, mirror it into the repo or a private submodule, but not in scope for v1.)

Generator and outputs live in the Landing Page repo:

```
scripts/
  generate-sentence-packs.mjs       # entry point
  sentence-pack/
    selection.mjs                   # filter + sort + slice logic
    pdf-template.html               # Puppeteer renders this
    formats.mjs                     # writers for CSV, JSON

dist/sentence-packs/                # gitignored; never committed
  starter/
    cili-starter-sentence-pack.pdf
    cili-starter-sentence-pack.tsv
    cili-starter-sentence-pack.json
    README.txt
    LICENSE.txt
  practice/
    ...
  ...
  master/
    ...
```

Add `dist/` to `.gitignore` if not already there. The deliverable files are too large to commit and are regenerable.

Run via a new `package.json` script: `npm run gen-packs`.

## Site updates triggered by pack launches

`src/pages/ProductPage.tsx:69` currently sets `availability` to `https://schema.org/PreOrder` for every `isSentencePack` product. This signals to Google that the packs aren't yet purchasable.

When a pack goes live on Gumroad:
1. Flip availability for that specific pack to `https://schema.org/InStock`. Cleanest implementation: add an `isLive: boolean` field per product in `src/data/products.ts`, and let `ProductPage.tsx` read it.
2. Rebuild and redeploy the site.

This is a small follow-on change, not the generator's job.

## Out of scope

- Cover image design (use existing `src/assets/sentence-pack.png` for v1; commission a Master-specific cover later)
- `.apkg` Anki deck files and other app-specific deck formats (TSV covers Anki and the rest adequately; revisit if a meaningful share of buyers ask for a pre-built deck for a specific app)
- Audio bundles (you have `generated_audio/HSK*` in `CILI - Datas` but pairing audio to sentences is its own project)
- Discount codes, affiliate setup, email automations on Gumroad
- The site's `PreOrder`→`InStock` flip is a follow-on task, not part of the generator

## Acceptance criteria

1. `npm run gen-packs` produces six folders under `dist/sentence-packs/` with PDF, TSV, JSON, README.txt, LICENSE.txt each.
2. For any given pack, the three formats contain the **same sentences in the same order** — PDF row N corresponds to TSV row N corresponds to JSON index N−1.
3. Each pack is a strict subset of every larger pack (`starter` ⊂ `practice` ⊂ `immersion` ⊂ `advanced` ⊂ `pro` ⊂ `master`).
4. The shortest sentence in every pack has ≥5 non-ASCII characters; no sentence contains any ASCII character in the Chinese field; no row has an empty Chinese field.
5. TSV opens cleanly in Anki desktop (the strictest popular target) and produces N cards with three fields each. Spot-check Quizlet's CSV/TSV import path as a second app to confirm the format generalizes.
6. JSON parses with `JSON.parse` and contains exactly N objects with keys `chinese`, `pinyin`, `english`.
7. PDF renders Chinese characters correctly (no tofu boxes), paginates without orphans, and contains the Tatoeba attribution on the colophon page.
