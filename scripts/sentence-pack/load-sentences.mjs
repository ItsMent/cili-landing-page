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
