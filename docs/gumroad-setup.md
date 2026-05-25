# Gumroad Setup Guide — CILI Shop

Your products and their matching bonus files all live in
**`C:\Users\kitme\Desktop\CILI DIGITAL PRODUCTS`** (the source of truth). Each
product now has, side by side:

- the branded **`.pdf`** (the reading copy you already had)
- a **`.tsv`** + **`.json`** with the *same content* (the "Bonus: TSV + JSON for
  Anki & flashcard apps" the site promises)

HSK files are at the **top level** of that folder; sentence-pack files are in the
**`SentencesPack\`** subfolder. The bonus files were rebuilt from the exact data
behind each PDF, so they match (HSK bonus is in pinyin order, which may differ
from the PDF's page order — same words, same example sentences).

---

## ⚠️ 3 rules that keep the site and Gumroad in sync

1. **Permalink must match `src/data/products.ts` exactly.** Every Buy button
   links to `cililearnchinese.gumroad.com/l/<permalink>`. Set each product's
   custom URL to the exact permalink in the tables below. **Never rename an
   existing permalink** — it instantly 404s the Buy button.
2. **Price must match.** The site shows the price from `products.ts`, not from
   Gumroad. Use the prices below; if you change one, change both.
3. **Sentence packs are "Coming Soon" on the site** (`ProductPage.tsx`). Creating
   them in Gumroad won't make them buyable until I flip that switch — tell me when
   they're live on Gumroad and it's a small code change.

---

## Part A — HSK products: add the bonus files

For each existing HSK product on Gumroad: **Products → open it → Content →
Upload files →** add the matching `.tsv` and `.json` next to the PDF already
there. Don't touch the permalink.

### Individual levels (permalink → file basename, top level of the folder)

| Gumroad permalink | Price | File basename (`.pdf` + `.tsv` + `.json`) |
|-------------------|-------|-------------------------------------------|
| `hsk1-chinese-vocabulary-standard` | $2.99 | HSK_1_Vocabulary 150 Words 300 Example Sentences |
| `hsk1-chinese-vocabulary-extended` | $4.99 | HSK_1_Vocabulary 150 Words 600 Example Sentences |
| `hsk2-chinese-vocabulary-standard` | $4.99 | HSK_2_Vocabulary 150 Words 300 Example Sentences |
| `hsk2-chinese-vocabulary-extended` | $7.99 | HSK_2_Vocabulary 150 Words 600 Example Sentences |
| `hsk3-chinese-vocabulary-standard` | $7.99 | HSK_3_Vocabulary 300 Words 600 Example Sentences |
| `hsk3-chinese-vocabulary-extended` | $11.99 | HSK_3_Vocabulary 300 Words 1200 Example Sentences |
| `hsk4-chinese-vocabulary-standard` | $11.99 | HSK_4_Vocabulary 600 Words 1200 Example Sentences |
| `hsk4-chinese-vocabulary-extended` | $16.99 | HSK_4_Vocabulary 600 Words 2400 Example Sentences |
| `hsk5-chinese-vocabulary-standard` | $16.99 | HSK_5_Vocabulary 1300 Words 2600 Example Sentences |
| `hsk5-chinese-vocabulary-extended` | $21.99 | HSK_5_Vocabulary 1300 Words 5200 Example Sentences |
| `hsk6-chinese-vocabulary-standard` | $21.99 | HSK_6_Vocabulary 2500 Words 5000 Example Sentences |
| `hsk6-chinese-vocabulary-extended` | $26.99 | HSK_6_Vocabulary 2500 Words 10000 Example Sentences |

### Bundles — upload the included levels' files (PDF + TSV + JSON each)

| Gumroad permalink | Price | Include (match Standard/Extended) |
|-------------------|-------|-----------------------------------|
| `hsk1-3-chinese-vocabulary-bundle-standard` | $9.99 | HSK 1, 2, 3 — the "Words 300/300/600" files |
| `hsk1-3-chinese-vocabulary-bundle-extended` | $14.99 | HSK 1, 2, 3 — the "600/600/1200" files |
| `hsk4-6-chinese-vocabulary-bundle-standard` | $29.99 | HSK 4, 5, 6 — the "1200/2600/5000" files |
| `hsk4-6-chinese-vocabulary-bundle-extended` | $39.99 | HSK 4, 5, 6 — the "2400/5200/10000" files |
| `hsk1-6-complete-chinese-vocabulary-bundle-standard` | $39.99 | all 6 Standard files |
| `hsk1-6-complete-chinese-vocabulary-bundle-extended` | $54.99 | all 6 Extended files |

> Bundles repeat no filenames, so you can upload the PDFs/TSVs/JSONs directly, or
> zip per level to keep the buyer's download tidy.

---

## Part B — Sentence packs: create the products

These don't exist on Gumroad yet. Files are in `SentencesPack\`. For each:
**New product → Digital product → set name, price, and the exact permalink →
upload the `.pdf` + `.tsv` + `.json`.**

| Name | Price | Permalink | File basename (in `SentencesPack\`) | Sentences |
|------|-------|-----------|--------------------------------------|-----------|
| Starter Sentence Pack     | $6.99  | `starter-sentences`    | CILI Sentence Mastery - FOUNDATION 1K       | 1,000 |
| Practice Sentence Pack    | $14.99 | `practice-sentences`   | CILI Sentence Mastery - BEGINNER CORE 3K    | 3,000 |
| Immersion Sentence Pack   | $19.99 | `immersion-sentences`  | CILI Sentence Mastery - DAILY FLUENCY 5K    | 5,000 |
| Advanced Sentence Pack    | $39.99 | `advanced-sentences`   | CILI Sentence Mastery - INTERMEDIATE FLOW 10K | 10,000 |
| Pro Mastery Sentence Pack | $79.99 | `pro-sentences`        | CILI Sentence Mastery - ADVANCED IMMERSION 20K | **17,500** ⚠️ |
| Master Sentence Pack      | $89.99 | `master-sentences`     | CILI Sentence Mastery - MASTER 30K          | 30,000 |

> ⚠️ **The "20K" pack PDF actually contains 17,500 sentences**, not 20,000.
> Decision: accepted 17,500. The site copy (name, description, tag "17.5K", SEO)
> has been updated to say 17,500, and the bonus files match. The PDF filename
> still reads "20K" — rename it on Gumroad's display name if you want it to read
> "17,500" there too (the permalink `pro-sentences` must not change).

Ready-to-paste descriptions are below the checklist.

---

## Final checklist

- [ ] TSV + JSON added to all 12 individual HSK products
- [ ] TSV + JSON added to the 6 HSK bundle products (relevant levels)
- [ ] 6 sentence-pack products created with the **exact** permalinks above
- [ ] Every Gumroad price matches `src/data/products.ts`
- [ ] No existing permalink renamed
- [x] 20K → 17,500 mismatch: accepted 17,500, site copy updated
- [ ] Ask me to flip sentence packs from "Coming Soon" to live once they're up

---

## Ready-to-paste sentence-pack descriptions

**Starter Sentence Pack** — 1,000 foundational Chinese sentences with Pinyin and
English translations. Perfect for building your first sentence-mining database.
Instant download — PDF for reading plus TSV and JSON for Anki and any flashcard app.

**Practice Sentence Pack** — 3,000 practical Chinese sentences to expand your
vocabulary and master daily usage patterns. Pinyin and English throughout. PDF +
TSV + JSON.

**Immersion Sentence Pack** — 5,000 immersive Chinese sentences for rapid
comprehension and natural context. Our most popular pack. PDF + TSV + JSON for
one-click import into Anki, Quizlet, Pleco, and more.

**Advanced Sentence Pack** — 10,000 comprehensive Chinese sentences to master
complex grammar and sophisticated word usage. Pinyin + English on every line.
PDF + TSV + JSON.

**Pro Mastery Sentence Pack** — 17,500 extensive Chinese sentences for deep
linguistic immersion. Pinyin and English included. PDF + TSV + JSON.

**Master Sentence Pack** — 30,000 ultimate Chinese sentences — the complete
linguistic database for native-level fluency. Pinyin and English throughout.
PDF + TSV + JSON.
