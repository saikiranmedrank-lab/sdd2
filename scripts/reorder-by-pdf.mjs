import fs from "node:fs";

const jsonPath = "C:/Users/saiki/Downloads/vocab.json";
const fixedPath = "fixed-vocab.json";
const modulePath = "src/vocabData.js";

const normalize = (value) => String(value || "")
  .toUpperCase()
  .replace(/&/g, "AND")
  .replace(/[^A-Z0-9]+/g, "");

const vocab = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const wordToEntry = new Map(vocab.map((entry) => [normalize(entry.word), entry]));

const pdfNoByWord = new Map();

const manualPdfNumbers = {
  Conspire: 450,
  Chide: 470,
  Console: 471,
  Converge: 472,
  Diffidence: 497,
  Deplete: 500,
  Disaster: 501,
  Disburse: 502,
  Discard: 503,
  Disclaim: 505,
  Detriment: 510,
  Dormant: 528,
  Hegemony: 974,
  Henchman: 975,
  Hooligan: 976,
  Handy: 977,
  Hospitable: 983,
  Humane: 984,
  Harmony: 985,
  Harrow: 987,
  Humbug: 989,
  Haste: 990,
  Hypothetical: 991,
  Harness: 995,
  Hideous: 986,
  Hype: 996,
  Hospitality: 997,
  Habitant: 988,
  Holistic: 993,
  Harsh: 994,
  Ignominy: 1001,
  Illusion: 1004,
  Imbecile: 1005,
  Imbibe: 1007,
  Imbroglio: 1008,
  Intimidate: 1010,
  Inclination: 1011,
  Intuition: 1012,
  Inundate: 1013,
  Insane: 1014,
  Infidelity: 1015,
  Insinuate: 1016,
  Irreparable: 1017,
  Iniquitous: 1018,
  Innate: 1022,
  Invincible: 1026,
  Invulnerable: 1027,
  Irascible: 1028,
  Irreverence: 1029,
  Incense: 1030,
  Impromptu: 1031,
  Impotent: 1032,
  Indebted: 1033,
  Incorporate: 1034,
  Incredible: 1035,
  Intractable: 1036,
  Intrigue: 1038,
  Inference: 1040,
  Invariably: 1041,
  Inflate: 1042,
  Invoke: 1043,
  Insolvent: 1044,
  Iota: 1045,
  Infirm: 1046,
  Insurgent: 1047,
  Isolated: 1048,
  Imitate: 1049,
  Ignoble: 1052,
  Jocund: 1163,
  Jiffy: 1164,
  Jaunty: 1165,
  Juggernaut: 1166,
  Jinx: 1167,
  Junket: 1168,
  Jolt: 1170,
  Juvenile: 1171,
  Jostle: 1172,
  Juxtaposition: 1173,
  Jar: 1174,
  Jejune: 1175,
  Joyous: 1176,
  Jolly: 1177,
  Jeopardy: 1178,
  Knotty: 1185,
  Knave: 1186,
  Myth: 1312,
  Manacle: 1319,
  Mayhem: 1324,
  Meddlesome: 1325,
  Motif: 1339,
  Massive: 1340,
  Demolish: 509,
  Iconoclastic: 998,
};

for (const [word, no] of Object.entries(manualPdfNumbers)) {
  const key = normalize(word);
  if (wordToEntry.has(key)) {
    pdfNoByWord.set(key, no);
  }
}

// Most original entries already have the PDF number as bookNo. Use it when OCR
// did not confidently identify the heading. Do not require uniqueness here:
// some earlier repaired items have duplicated bookNo values, but they still
// locate the word in the right PDF neighborhood and preserve useful order.
for (const entry of vocab) {
  const key = normalize(entry.word);
  if (pdfNoByWord.has(key)) continue;
  const no = Number(entry.bookNo);
  if (Number.isInteger(no) && no >= 1 && no <= 2436) {
    pdfNoByWord.set(key, no);
  }
}

const missing = vocab.filter((entry) => !pdfNoByWord.has(normalize(entry.word)));
if (missing.length) {
  throw new Error(`Could not infer PDF order for ${missing.length} words: ${missing.map((entry) => entry.word).join(", ")}`);
}

for (const entry of vocab) {
  entry.bookNo = pdfNoByWord.get(normalize(entry.word));
}

vocab.sort((a, b) => a.bookNo - b.bookNo || a.word.localeCompare(b.word));

vocab.forEach((entry, index) => {
  entry.bookNo = index + 1;
});

const seenWords = new Set();
const duplicateWords = [];
for (const entry of vocab) {
  const key = normalize(entry.word);
  if (seenWords.has(key)) duplicateWords.push(entry.word);
  seenWords.add(key);
}

if (duplicateWords.length) {
  throw new Error(`Duplicate word names found: ${duplicateWords.join(", ")}`);
}

fs.writeFileSync(jsonPath, `${JSON.stringify(vocab, null, 2)}\n`);
fs.writeFileSync(fixedPath, `${JSON.stringify(vocab, null, 2)}\n`);
fs.writeFileSync(modulePath, `const vocab = ${JSON.stringify(vocab, null, 2)};\n\nexport default vocab;\n`);

console.log(JSON.stringify({
  total: vocab.length,
  uniqueWords: seenWords.size,
  first: vocab.slice(0, 10).map((entry) => `${entry.bookNo}:${entry.word}`),
  last: vocab.slice(-10).map((entry) => `${entry.bookNo}:${entry.word}`),
  jsonPath,
  fixedPath,
  modulePath,
}, null, 2));
