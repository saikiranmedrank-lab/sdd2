import fs from "node:fs";

const jsonPath = "C:/Users/saiki/Downloads/vocab.json";
const modulePath = "src/vocabData.js";
const fixedPath = "fixed-vocab.json";

const visuals = {
  Conspire: "🤫🕵️",
  Chide: "☝️😟",
  Console: "🤝😢",
  Converge: "🔀📍",
  Diffidence: "😶‍🌫️🙇",
  Deplete: "🔋⬇️",
  Disaster: "🌪️💥",
  Disburse: "💸📤",
  Discard: "🗑️❌",
  Disclaim: "🙅📝",
  Detriment: "⚠️💔",
  Dormant: "💤🌋",
  Hegemony: "👑🌍",
  Henchman: "🕴️🔫",
  Hooligan: "😠🧱",
  Handy: "🛠️👍",
  Hospitable: "🏠🤗",
  Humane: "❤️🤲",
  Harmony: "🎶🤝",
  Harrow: "😨💔",
  Humbug: "🎭❌",
  Haste: "🏃💨",
  Hypothetical: "🤔💭",
  Harness: "🐴⚙️",
  Hideous: "👹😖",
  Hype: "📣🔥",
  Hospitality: "🏨🤝",
  Habitant: "🏡👤",
  Holistic: "🌐🧩",
  Harsh: "🪨😠",
  Ignominy: "😳🏳️",
  Illusion: "🪄👁️",
  Imbecile: "🤪❌",
  Imbibe: "🥤🧠",
  Imbroglio: "🧶😵",
  Intimidate: "😨👊",
  Inclination: "↘️❤️",
  Intuition: "💡🧠",
  Inundate: "🌊📥",
  Insane: "🤯🌀",
  Infidelity: "💔🤥",
  Insinuate: "🗣️👀",
  Irreparable: "🛠️❌",
  Iniquitous: "⚖️❌",
  Innate: "👶✨",
  Invincible: "🛡️🏆",
  Invulnerable: "🛡️💪",
  Irascible: "😡⚡",
  Irreverence: "🙄🙏",
  Incense: "😡🔥",
  Impromptu: "🎤⚡",
  Impotent: "🔋❌",
  Indebted: "💳🙏",
  Incorporate: "➕🧩",
  Incredible: "😲✨",
  Intractable: "🧱🤝❌",
  Intrigue: "🕵️❓",
  Inference: "🧠➡️",
  Invariably: "🔁✅",
  Inflate: "🎈📈",
  Invoke: "📣🙏",
  Insolvent: "💸🚫",
  Iota: "🔬⚫",
  Infirm: "🩼😷",
  Insurgent: "🏴✊",
  Isolated: "🏝️🚶",
  Imitate: "🪞👤",
  Ignoble: "👑❌",
  Jocund: "😄🎶",
  Jiffy: "⏱️⚡",
  Jaunty: "🎩🚶",
  Juggernaut: "🚜💥",
  Jinx: "🧿⚠️",
  Junket: "✈️🎉",
  Jolt: "⚡😲",
  Juvenile: "🧒📚",
  Jostle: "👥💢",
  Juxtaposition: "↔️🖼️",
  Jar: "🥛⚡",
  Jejune: "😴🧒",
  Joyous: "😄🎉",
  Jolly: "😃🎈",
  Jeopardy: "⚠️🎲",
  Knotty: "🪢🤔",
  Knave: "🦹💰",
  Myth: "📜🐉",
  Manacle: "⛓️✋",
  Mayhem: "💥😵",
  Meddlesome: "👃🗣️",
  Motif: "🎨🔁",
  Massive: "🏔️💪",
  Demolish: "🏚️💥",
  Iconoclastic: "🗿🔨",
};

const vocab = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

let filled = 0;
const missingMapEntries = [];
for (const entry of vocab) {
  if (!String(entry.visual || "").trim()) {
    const visual = visuals[entry.word];
    if (!visual) {
      missingMapEntries.push(entry.word);
      continue;
    }
    entry.visual = visual;
    filled += 1;
  }
}

if (missingMapEntries.length) {
  throw new Error(`No visual mapping for: ${missingMapEntries.join(", ")}`);
}

const emptyAfter = vocab.filter((entry) => !String(entry.visual || "").trim());
if (emptyAfter.length) {
  throw new Error(`Still empty visual entries: ${emptyAfter.map((entry) => entry.word).join(", ")}`);
}

fs.writeFileSync(jsonPath, `${JSON.stringify(vocab, null, 2)}\n`);
fs.writeFileSync(fixedPath, `${JSON.stringify(vocab, null, 2)}\n`);
fs.writeFileSync(modulePath, `const vocab = ${JSON.stringify(vocab, null, 2)};\n\nexport default vocab;\n`);

console.log(JSON.stringify({
  total: vocab.length,
  filled,
  emptyAfter: emptyAfter.length,
  jsonPath,
  modulePath,
  fixedPath,
}, null, 2));
