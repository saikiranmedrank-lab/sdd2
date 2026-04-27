import fs from "node:fs";

const inputPath = "C:/Users/saiki/Downloads/vocab.json";
const outputPath = process.argv[2] || "fixed-vocab.json";

const duplicateWords = `
Comprehensive
Contiguous
Delectable
Deplore
Destitute
Deter
Detrimental
Devout
Diminutive
Discerning
Discord
Discreet
Disdain
Disgruntled
Dishearten
Dismantle
Disparage
Dispatch
Dispel
Disseminate
Distort
Dubious
Elucidate
Emaciate
Entreat
Erroneous
Exaggerate
Exquisite
Extol
Exult
Fiasco
Fickle
Fierce
Filthy
Finicky
Flaunt
Flaw
Imminent
Impede
Impel
Imperative
Imperceptible
Impetuous
Implicit
Incorrigible
Indigenous
Misdemeanour
Miserly
Misgiving
Misnomer
Misogynist
Mitigate
Mnemonic
Mock
Moderate
Mollify
Momentous
Monotonous
Moratorium
Morbid
Morose
Mortify
Motley
Obdurate
Obeisance
Obese
Obfuscate
Obligatory
Oblique
Oblivion
Oblivious
Obnoxious
Obscene
Obscure
Obsequious
Obsolete
Obstinate
Obstreperous
Officious
Ogle
Ominous
Omnipotent
Omnipresent
Onerous
Onslaught
Optional
Overrun
Scanty
Stoic
Surveillance
Turbid
Venial
`;

const missingEntries = [
  ["Conspire", "to secretly plan with others to do something wrong", "साज़िश करना", "కుట్ర చేయడం", "con + aspire: a group aspires secretly to a plan", "The officials conspired to hide the evidence."],
  ["Chide", "to scold or rebuke mildly", "डांटना", "మందలించడం", "chide sounds like child being scolded", "The teacher chided the student for being late."],
  ["Console", "to comfort someone in grief or disappointment", "सांत्वना देना", "ఓదార్చడం", "console gives soul comfort", "She tried to console her friend after the loss."],
  ["Converge", "to come together at one point", "मिलना", "కలిసిపోవడం", "con + verge: paths on the same verge meet", "The roads converge near the old market."],
  ["Diffidence", "lack of self-confidence; shyness", "संकोच", "ఆత్మవిశ్వాసం లేకపోవడం", "diffident people feel different and hesitant", "His diffidence kept him silent in the meeting."],
  ["Deplete", "to reduce or use up the supply of something", "खत्म करना", "తగ్గించడం", "deplete makes resources delete", "Long droughts depleted the village wells."],
  ["Disaster", "a sudden event causing great damage", "आपदा", "విపత్తు", "dis + star: bad stars bring calamity", "The flood was a disaster for the town."],
  ["Disburse", "to pay out money from a fund", "भुगतान करना", "చెల్లించడం", "disburse from purse", "The bank will disburse the loan tomorrow."],
  ["Discard", "to throw away or reject as useless", "त्यागना", "విసర్జించడం", "dis + card: throw the card away", "Discard the damaged copies before packing."],
  ["Disclaim", "to deny responsibility or connection", "अस्वीकार करना", "నిరాకరించడం", "dis + claim means no claim", "He disclaimed any role in the decision."],
  ["Detriment", "harm or damage", "हानि", "నష్టం", "detrimental causes detriment", "Skipping sleep is a detriment to health."],
  ["Dormant", "inactive but capable of becoming active", "निष्क्रिय", "నిద్రావస్థలో ఉన్న", "dormant sounds like dorm room sleeping", "The volcano has been dormant for years."],
  ["Hegemony", "dominance of one group over others", "प्रभुत्व", "ఆధిపత్యం", "hegemony means a huge money power ruling", "The empire sought hegemony in the region."],
  ["Henchman", "a loyal follower, often of a powerful or criminal person", "सहयोगी गुंडा", "అనుచరుడు", "henchman hangs around the boss", "The villain sent his henchman to threaten them."],
  ["Hooligan", "a violent or noisy troublemaker", "उपद्रवी", "అల్లరి మూక సభ్యుడు", "hooligan creates hullabaloo", "Hooligans damaged the buses after the match."],
  ["Handy", "useful and convenient", "सुविधाजनक", "సులభమైన", "handy means ready at hand", "Keep a torch handy during the trip."],
  ["Hospitable", "friendly and welcoming to guests", "मेहमाननवाज़", "అతిథి సత్కారమున్న", "hospitality makes people hospitable", "The villagers were hospitable to strangers."],
  ["Humane", "kind and compassionate", "दयालु", "మానవత్వం గల", "humane means human-hearted", "The shelter provides humane care for animals."],
  ["Harmony", "peaceful agreement or pleasing combination", "सामंजस्य", "సామరస్యం", "harmony means hearts in one melody", "The team worked in harmony."],
  ["Harrow", "to distress deeply", "पीड़ा देना", "తీవ్రంగా బాధించడం", "harrow sounds like horror", "The accident harrowed the entire family."],
  ["Humbug", "deceptive or false talk; nonsense", "ढोंग", "మోసం/అర్థంలేని మాట", "humbug is a bug of humbug lies", "He dismissed the claim as humbug."],
  ["Haste", "excessive speed or hurry", "जल्दबाज़ी", "తొందర", "haste makes waste", "In his haste, he forgot the documents."],
  ["Hypothetical", "based on an imagined situation", "काल्पनिक", "ఊహాత్మక", "hypothesis-based idea is hypothetical", "This is only a hypothetical problem."],
  ["Harness", "to control and use something effectively", "उपयोग में लाना", "సద్వినియోగం చేసుకోవడం", "harness a horse to use its power", "We must harness solar energy."],
  ["Hideous", "extremely ugly or unpleasant", "भयानक/कुरूप", "వికారమైన", "hideous is so ugly you hide", "The painting showed a hideous monster."],
  ["Hype", "exaggerated publicity", "प्रचार का शोर", "అతిశయ ప్రచారం", "hype is high publicity", "The product failed despite all the hype."],
  ["Hospitality", "friendly treatment of guests", "आतिथ्य", "అతిథి సత్కారం", "hospitality is host quality", "Their hospitality made us feel at home."],
  ["Habitant", "an inhabitant; a resident", "निवासी", "నివాసి", "habitant has habitat in it", "Every habitant of the island knew the rule."],
  ["Holistic", "considering the whole thing, not just parts", "समग्र", "సమగ్ర", "holistic looks at the whole", "The doctor suggested a holistic approach."],
  ["Harsh", "rough, severe, or unpleasant", "कठोर", "కఠినమైన", "harsh words hurt", "The judge gave a harsh warning."],
  ["Ignominy", "public shame or disgrace", "अपमान", "అవమానం", "ignominy means no dignity", "The scandal ended in ignominy."],
  ["Illusion", "a false idea or deceptive appearance", "भ्रम", "భ్రమ", "illusion is an unreal vision", "The oasis was only an illusion."],
  ["Imbecile", "a foolish or stupid person", "मूर्ख", "మూర్ఖుడు", "imbecile behaves like an immature mind", "Only an imbecile would ignore the warning."],
  ["Imbibe", "to drink or absorb ideas", "पीना/ग्रहण करना", "తాగడం/గ్రహించడం", "imbibe sounds like in-bibe: take in", "Children imbibe values from their parents."],
  ["Imbroglio", "a confusing and complicated situation", "उलझन", "గందరగోళం", "imbroglio sounds like a big broil of confusion", "The policy caused a political imbroglio."],
  ["Intimidate", "to frighten or threaten someone", "डराना", "భయపెట్టడం", "timid becomes intimidated", "The gang tried to intimidate the witness."],
  ["Inclination", "a tendency or liking", "झुकाव", "మొగ్గు", "incline means lean toward", "She has an inclination toward music."],
  ["Intuition", "understanding without conscious reasoning", "अंतर्ज्ञान", "అంతర్దృష్టి", "inner tuition is intuition", "My intuition told me something was wrong."],
  ["Inundate", "to flood or overwhelm", "बाढ़ से भर देना", "ముంచెత్తడం", "inundate sounds like in-undated with water", "The office was inundated with complaints."],
  ["Insane", "mad; extremely foolish", "पागल", "పిచ్చి", "in + sane means not sane", "It was insane to drive in that storm."],
  ["Infidelity", "unfaithfulness", "बेवफाई", "నమ్మకద్రోహం", "in + fidelity means no faithfulness", "Infidelity destroyed their relationship."],
  ["Insinuate", "to suggest indirectly", "इशारा करना", "సూచించడం", "insinuate slips an idea in", "He tried to insinuate that she was lying."],
  ["Irreparable", "impossible to repair", "अपूरणीय", "మరమ్మత్తు చేయలేని", "ir + reparable means not repairable", "The fire caused irreparable damage."],
  ["Iniquitous", "extremely unfair or wicked", "अन्यायपूर्ण", "అన్యాయమైన", "iniquity means injustice", "They protested the iniquitous law."],
  ["Innate", "inborn; natural", "जन्मजात", "సహజమైన", "in + natal: born within", "She has an innate talent for languages."],
  ["Invincible", "too strong to be defeated", "अजेय", "అజేయమైన", "in + vincible means not conquerable", "The champion seemed invincible."],
  ["Invulnerable", "impossible to harm", "अभेद्य", "హాని చేయలేని", "in + vulnerable means not vulnerable", "No system is completely invulnerable."],
  ["Irascible", "easily angered", "चिड़चिड़ा", "త్వరగా కోపం వచ్చే", "irascible rises in anger", "The irascible manager shouted again."],
  ["Irreverence", "lack of respect", "असम्मान", "అగౌరవం", "ir + reverence means no respect", "His irreverence offended the elders."],
  ["Incense", "to make very angry", "क्रोधित करना", "కోపగించటం", "incense can inflame anger like smoke", "The unfair remark incensed the crowd."],
  ["Impromptu", "done without preparation", "तत्काल", "ఆకస్మికంగా", "immediate prompt action is impromptu", "He gave an impromptu speech."],
  ["Impotent", "powerless", "शक्तिहीन", "శక్తిలేని", "im + potent means not powerful", "The committee felt impotent without legal authority."],
  ["Indebted", "owing money or gratitude", "ऋणी", "ఋణపడి ఉన్న", "in debt means indebted", "I am indebted to my teachers."],
  ["Incorporate", "to include or combine into a whole", "शामिल करना", "చేర్చడం", "in + corporate body: bring into one body", "The plan incorporates several suggestions."],
  ["Incredible", "unbelievable; extraordinary", "अविश्वसनीय", "అద్భుతమైన/నమ్మలేని", "in + credible means not believable", "She told an incredible story."],
  ["Intractable", "hard to control or deal with", "जिद्दी/असाध्य", "అణచలేని", "in + tractable means not manageable", "The dispute became intractable."],
  ["Intrigue", "to arouse curiosity; a secret plot", "रुचि जगाना/षड्यंत्र", "ఆసక్తి కలిగించడం/కుట్ర", "intrigue pulls you into a tricky plot", "The mystery intrigued every reader."],
  ["Inference", "a conclusion drawn from evidence", "निष्कर्ष", "అనుమానం/నిర్ణయం", "infer leads to inference", "The inference was based on facts."],
  ["Invariably", "always; without change", "हमेशा", "ఎల్లప్పుడూ", "invariable means not changing", "He invariably arrives early."],
  ["Inflate", "to fill with air or increase excessively", "फुलाना", "ఉబ్బించడం", "inflate fills with air", "Demand inflated the prices."],
  ["Invoke", "to call upon or appeal to", "आह्वान करना", "ఆహ్వానించడం", "invoke uses voice to call in", "The lawyer invoked a constitutional right."],
  ["Insolvent", "unable to pay debts", "दिवालिया", "దివాళా తీసిన", "insolvent cannot solve debts", "The company became insolvent."],
  ["Iota", "a very small amount", "ज़रा सा", "అతి చిన్న భాగం", "iota is a tiny letter", "There is not an iota of truth in it."],
  ["Infirm", "physically weak, especially from age or illness", "कमज़ोर", "బలహీనమైన", "infirm is not firm", "The infirm patient needed support."],
  ["Insurgent", "a rebel against authority", "विद्रोही", "తిరుగుబాటుదారు", "insurgent surges against rule", "Insurgents attacked the outpost."],
  ["Isolated", "separate or alone", "अलग-थलग", "ఒంటరిగా ఉన్న", "island-like is isolated", "The village remained isolated after the storm."],
  ["Imitate", "to copy someone or something", "नकल करना", "అనుకరించడం", "imitate means copy image", "Children often imitate adults."],
  ["Ignoble", "dishonourable; not noble", "नीच", "నీచమైన", "ig + noble means not noble", "He rejected the ignoble offer."],
  ["Jocund", "cheerful and light-hearted", "प्रसन्न", "ఉల్లాసంగా", "jocund sounds like joking", "The jocund crowd sang loudly."],
  ["Jiffy", "a very short time", "पल भर", "క్షణం", "jiffy means just a flash", "I will return in a jiffy."],
  ["Jaunty", "lively and confident", "चुस्त/प्रसन्न", "ఉత్సాహంగా", "jaunty walk is a joyful walk", "He wore a jaunty hat."],
  ["Juggernaut", "a huge unstoppable force", "अपराजेय विशाल शक्ति", "ఆపలేని భారీ శక్తి", "juggernaut just goes on", "The campaign became a political juggernaut."],
  ["Jinx", "a person or thing bringing bad luck", "मनहूस", "దురదృష్టం తెచ్చేది", "jinx links to bad luck", "Fans called the old stadium a jinx."],
  ["Junket", "a pleasure trip, often at public expense", "मौज-मस्ती की यात्रा", "విహార యాత్ర", "junket is a junk trip for fun", "Officials were criticized for the costly junket."],
  ["Jolt", "a sudden shock or jerk", "झटका", "ఝలక్/కుదుపు", "jolt is a sudden jerk", "The bus stopped with a jolt."],
  ["Juvenile", "young; relating to youth", "किशोर", "యువ/బాల్యానికి సంబంధించిన", "juvenile means junior", "The court handled a juvenile case."],
  ["Jostle", "to push roughly in a crowd", "धक्का देना", "తొసుకోవడం", "jostle sounds like hustle in crowd", "People jostled for seats."],
  ["Juxtaposition", "placing things side by side for contrast", "साथ-साथ रखना", "పక్కపక్కన ఉంచడం", "juxta means near; position means placement", "The juxtaposition of wealth and poverty was striking."],
  ["Jar", "to shake or disturb suddenly", "झटका देना", "కుదిపివేయడం", "a jar can jar your hand", "The loud noise jarred the baby awake."],
  ["Jejune", "dull, childish, or lacking substance", "नीरस/बचकाना", "నిస్సారమైన", "jejune sounds like junior and immature", "The essay was jejune and repetitive."],
  ["Joyous", "full of joy", "आनंदित", "ఆనందభరితమైన", "joy + ous means full of joy", "It was a joyous celebration."],
  ["Jolly", "cheerful and happy", "हंसमुख", "ఉల్లాసంగా", "jolly sounds joyful", "He was in a jolly mood."],
  ["Jeopardy", "danger or risk", "खतरा", "ప్రమాదం", "jeopardy puts joy in danger", "The mistake put the project in jeopardy."],
  ["Knotty", "complicated and difficult", "जटिल", "క్లిష్టమైన", "knotty problems are tied in knots", "The lawyer faced a knotty legal issue."],
  ["Knave", "a dishonest man", "धूर्त", "మోసగాడు", "knave is a nasty nave", "The knave cheated the villagers."],
  ["Myth", "a traditional story or a widely believed false idea", "मिथक", "పురాణకథ/అపోహ", "myth sounds like made-up history", "It is a myth that success comes without effort."],
  ["Manacle", "a metal band or chain used to fasten someone's hands or feet", "हथकड़ी", "సంకెళ్లు", "manacle locks a man", "The prisoner broke the manacle and escaped."],
  ["Mayhem", "violent disorder or chaos", "अराजकता", "అల్లకల్లోలం", "mayhem means mad chaos", "The sudden fire caused mayhem in the hall."],
  ["Meddlesome", "interfering in other people's affairs", "दखल देने वाला", "జోక్యం చేసుకునే", "meddlesome people meddle too much", "The meddlesome neighbour asked too many questions."],
  ["Motif", "a repeated idea, theme, or pattern", "मुख्य विषय", "ప్రధాన భావం/నమూనా", "motif is a motive repeated in art", "Alienation is a recurring motif in the novel."],
  ["Massive", "very large, heavy, or solid", "विशाल", "భారీ", "massive means mass is huge", "The fort had massive stone walls."],
  ["Demolish", "to destroy or pull down completely", "ध्वस्त करना", "కూల్చివేయడం", "demolish makes a building disappear", "The old bridge was demolished after the inspection."],
  ["Iconoclastic", "attacking established beliefs, customs, or ideas", "परंपरा-विरोधी", "సంప్రదాయ వ్యతిరేక", "iconoclastic breaks old icons of thought", "His iconoclastic views challenged the committee."],
].map(([word, simple, hindi, telugu, trick, example]) => ({
  chapter: word[0].toUpperCase(),
  bookNo: null,
  word,
  visual: "",
  simple,
  hindi,
  telugu,
  trick,
  example,
  pyqExams: [],
}));

const normalize = (word) => String(word || "").trim().toLocaleLowerCase("en-US");
const duplicateSet = new Set(duplicateWords.trim().split(/\s*\n\s*/).map(normalize));
const removeAsNonPdfWord = new Set(["iconoclast"]);

function completenessScore(entry) {
  return ["chapter", "bookNo", "word", "visual", "simple", "hindi", "telugu", "trick", "example"]
    .reduce((score, key) => {
      const value = entry[key];
      if (Array.isArray(value)) return score + value.length;
      return score + (value === null || value === undefined || value === "" ? 0 : String(value).length);
    }, 0) + (Array.isArray(entry.pyqExams) ? entry.pyqExams.length * 10 : 0);
}

function normalizeEntry(entry) {
  return {
    chapter: entry.chapter ?? "",
    bookNo: entry.bookNo ?? null,
    word: entry.word ?? "",
    visual: entry.visual ?? "",
    simple: entry.simple ?? "",
    hindi: entry.hindi ?? "",
    telugu: entry.telugu ?? "",
    trick: entry.trick ?? "",
    example: entry.example ?? "",
    pyqExams: Array.isArray(entry.pyqExams) ? entry.pyqExams : [],
  };
}

const original = JSON.parse(fs.readFileSync(inputPath, "utf8"));
if (!Array.isArray(original)) throw new Error("Expected vocab.json to contain an array");

const byWord = new Map();
for (const raw of original) {
  const entry = normalizeEntry(raw);
  const key = normalize(entry.word);
  const current = byWord.get(key);
  if (!current || completenessScore(entry) > completenessScore(current)) {
    byWord.set(key, entry);
  }
}

const afterDedupe = [];
const emitted = new Set();
for (const raw of original) {
  const key = normalize(raw.word);
  if (emitted.has(key)) continue;
  const entry = byWord.get(key);
  if (!removeAsNonPdfWord.has(normalize(entry.word))) {
    afterDedupe.push(entry);
  }
  emitted.add(key);
}

const existingAfterDedupe = new Set(afterDedupe.map((entry) => normalize(entry.word)));
const added = [];
for (const entry of missingEntries) {
  const key = normalize(entry.word);
  if (!existingAfterDedupe.has(key)) {
    afterDedupe.push(entry);
    existingAfterDedupe.add(key);
    added.push(entry.word);
  }
}

let nextBookNo = Math.max(...afterDedupe.map((entry) => Number(entry.bookNo) || 0)) + 1;
for (const entry of afterDedupe) {
  if (entry.bookNo === null || entry.bookNo === undefined || entry.bookNo === "") {
    entry.bookNo = nextBookNo++;
  }
}

const finalDuplicates = new Map();
for (const entry of afterDedupe) {
  const key = normalize(entry.word);
  finalDuplicates.set(key, (finalDuplicates.get(key) || 0) + 1);
}

const duplicateNames = [...finalDuplicates.entries()].filter(([, count]) => count > 1);
const listedStillDuplicated = duplicateNames.filter(([key]) => duplicateSet.has(key));
const missingStillAbsent = missingEntries
  .map((entry) => entry.word)
  .filter((word) => !finalDuplicates.has(normalize(word)));

fs.writeFileSync(outputPath, `${JSON.stringify(afterDedupe, null, 2)}\n`);

if (afterDedupe.length !== 2436) {
  throw new Error(`Expected final total 2436, got ${afterDedupe.length}`);
}
if (duplicateNames.length) {
  throw new Error(`Expected no duplicate word names, found ${duplicateNames.length}`);
}
if (missingStillAbsent.length) {
  throw new Error(`Missing listed words still absent: ${missingStillAbsent.join(", ")}`);
}

console.log(JSON.stringify({
  inputTotal: original.length,
  inputUniqueWords: byWord.size,
  outputTotal: afterDedupe.length,
  outputUniqueWords: finalDuplicates.size,
  duplicateNames: duplicateNames.map(([key, count]) => ({ word: key, count })),
  listedStillDuplicated: listedStillDuplicated.map(([key]) => key),
  missingAdded: added.length,
  missingStillAbsent,
  outputPath,
}, null, 2));
