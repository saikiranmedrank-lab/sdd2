import vocab from "./vocabData";

const REVIEW_CLASSIFICATION = {
  mainGroup: "Needs Review",
  subGroup: "needs-review",
  visualFamily: "review",
  memoryCluster: "review",
};

const NEEDS_SUBGROUP_REVIEW = "needs-subgroup-review";

export const GROUPS = [
  {
    mainGroup: "Brain / Intelligence / Judgement",
    visualFamily: "brain",
    icon: "Mind",
    description: "Thinking, wisdom, confusion, decisions, memory, and judgement.",
    subGroups: ["sharp-mind", "confusion", "judgement", "memory", "learning"],
    keywords: [
      "brain", "mind", "think", "thought", "intelligence", "intelligent", "wise", "wisdom", "clever", "smart",
      "judgement", "judgment", "judge", "decide", "decision", "discern", "logic", "reason", "rational", "idea",
      "knowledge", "learn", "study", "memory", "remember", "forget", "aware", "ignorant", "fool", "stupid",
      "confuse", "confusion", "doubt", "belief", "opinion", "perceive", "understand", "guess", "assume", "infer",
      "shrewd", "sagacious", "prudent", "acumen", "acuity", "astute", "aptitude", "wit", "insight"
    ],
  },
  {
    mainGroup: "Emotion / Feelings / Mind State",
    visualFamily: "emotion",
    icon: "Heart",
    description: "Fear, anger, joy, sadness, calmness, desire, and inner state.",
    subGroups: ["fear", "anger", "sadness", "joy", "calm", "desire"],
    keywords: [
      "emotion", "feeling", "feel", "fear", "afraid", "terror", "panic", "anxiety", "worry", "anger", "angry",
      "rage", "hate", "hatred", "detest", "loathe", "sad", "sorrow", "grief", "mourn", "joy", "happy", "delight",
      "pleasure", "calm", "peace", "serene", "relief", "desire", "wish", "want", "love", "envy", "jealous",
      "shame", "pride", "hope", "hopeless", "mood", "mental state", "dislike", "aversion", "animosity", "abhor"
    ],
  },
  {
    mainGroup: "Speech / Communication / Expression",
    visualFamily: "speech",
    icon: "Talk",
    description: "Speaking, writing, arguing, praising, promising, and expression.",
    subGroups: ["speech", "argument", "praise", "agreement", "writing", "silence"],
    keywords: [
      "speak", "speech", "talk", "tell", "say", "said", "utter", "express", "expression", "communicate",
      "communication", "write", "written", "letter", "message", "announce", "declare", "argue", "argument",
      "debate", "quarrel", "dispute", "praise", "commend", "flatter", "criticize", "accuse", "promise",
      "agree", "agreement", "deny", "refuse", "ask", "answer", "reply", "question", "silent", "whisper",
      "shout", "cry out", "language", "word", "eloquent", "retort", "reprimand"
    ],
  },
  {
    mainGroup: "Movement / Action / Speed / Travel",
    visualFamily: "movement",
    icon: "Move",
    description: "Motion, travel, speed, stopping, carrying, and physical actions.",
    subGroups: ["motion", "speed", "travel", "stop", "carry", "action"],
    keywords: [
      "move", "movement", "motion", "go", "come", "walk", "run", "rush", "speed", "quick", "slow", "travel",
      "journey", "vehicle", "road", "path", "carry", "bring", "take", "send", "throw", "pull", "push", "drag",
      "lift", "drop", "fall", "rise", "arrive", "depart", "leave", "escape", "flee", "wander", "roam", "stop",
      "pause", "halt", "action", "act", "do", "abandon", "descend", "ascend"
    ],
  },
  {
    mainGroup: "Crime / Law / Court / Blame",
    visualFamily: "law",
    icon: "Law",
    description: "Crime, punishment, court, rules, guilt, blame, and justice.",
    subGroups: ["crime", "court", "punishment", "blame", "rule", "justice"],
    keywords: [
      "crime", "criminal", "kidnap", "abduct", "steal", "theft", "rob", "murder", "kill illegally", "fraud",
      "cheat", "bribe", "law", "legal", "illegal", "court", "judge", "trial", "justice", "punish", "punishment",
      "guilt", "guilty", "blame", "accuse", "charge", "arrest", "prison", "jail", "sentence", "rule",
      "regulation", "rights", "evidence", "witness", "verdict", "forbid", "acquit", "culprit", "convict"
    ],
  },
  {
    mainGroup: "Attack / Destruction / Conflict",
    visualFamily: "battle",
    icon: "Fight",
    description: "War, attack, damage, fighting, resistance, and destruction.",
    subGroups: ["attack", "destruction", "conflict", "defence", "violence"],
    keywords: [
      "attack", "fight", "battle", "war", "conflict", "clash", "enemy", "hostile", "violence", "violent",
      "destroy", "destruction", "damage", "harm", "hurt", "injure", "wound", "break", "crush", "smash",
      "burn", "ruin", "kill", "weapon", "defend", "defence", "defense", "resist", "oppose", "threat", "danger",
      "aggressive", "strike", "hit", "annihilate"
    ],
  },
  {
    mainGroup: "Social / Relationship / Behaviour",
    visualFamily: "social",
    icon: "People",
    description: "People, manners, friendship, family, society, habits, and behaviour.",
    subGroups: ["friendship", "family", "behaviour", "society", "help", "insult"],
    keywords: [
      "person", "people", "social", "society", "community", "friend", "friendly", "friendship", "family", "parent",
      "child", "marriage", "relationship", "behaviour", "behavior", "habit", "manner", "polite", "rude",
      "kind", "cruel", "help", "support", "cooperate", "betray", "insult", "respect", "honour", "honor", "shy",
      "lonely", "crowd", "group", "guest", "host", "companion", "neighbour", "neighbor", "affable", "amiable", "amicable"
    ],
  },
  {
    mainGroup: "Power / Rank / Leadership / Status",
    visualFamily: "crown",
    icon: "Crown",
    description: "Authority, leadership, rank, control, fame, and public status.",
    subGroups: ["leadership", "rank", "control", "status", "fame", "freedom"],
    keywords: [
      "power", "authority", "control", "rule", "govern", "leader", "leadership", "king", "queen", "crown",
      "rank", "status", "position", "office", "official", "master", "servant", "superior", "inferior",
      "command", "order", "obey", "dominate", "famous", "fame", "reputation", "honour", "honor", "prestige",
      "liberty", "freedom", "independent", "abdicate", "throne", "sovereign", "supreme"
    ],
  },
  {
    mainGroup: "Money / Quantity / Growth / Wealth",
    visualFamily: "money",
    icon: "Money",
    description: "Money, wealth, poverty, buying, amount, abundance, and scarcity.",
    subGroups: ["money-growth", "poverty", "quantity", "scarcity", "trade", "value"],
    keywords: [
      "money", "wealth", "rich", "poor", "poverty", "price", "cost", "buy", "sell", "trade", "business",
      "profit", "loss", "debt", "pay", "income", "salary", "tax", "value", "valuable", "cheap", "expensive",
      "quantity", "amount", "many", "much", "few", "less", "more", "abundant", "scarce", "scarcity",
      "increase money", "growth", "treasure", "fortune", "bank", "lavish", "meagre", "meager"
    ],
  },
  {
    mainGroup: "Work / Skill / Effort / Ability",
    visualFamily: "skill",
    icon: "Skill",
    description: "Work, effort, ability, success, failure, tools, and performance.",
    subGroups: ["skill", "effort", "work", "ability", "success", "failure"],
    keywords: [
      "work", "job", "task", "labour", "labor", "effort", "try", "attempt", "skill", "skilled", "ability",
      "able", "capable", "talent", "expert", "practice", "perform", "performance", "success", "successful",
      "fail", "failure", "futile", "ineffective", "useful", "useless", "tool", "craft", "profession",
      "hardworking", "lazy", "prepare", "ready", "method", "efficient", "aptitude", "dexterous"
    ],
  },
  {
    mainGroup: "Change / Increase / Decrease / Improvement",
    visualFamily: "change",
    icon: "Change",
    description: "Change, growth, reduction, improvement, damage recovery, and difference.",
    subGroups: ["change", "increase", "reduction", "improvement", "decline", "difference"],
    keywords: [
      "change", "alter", "convert", "transform", "modify", "variation", "deviation", "different", "increase",
      "grow", "growth", "rise", "expand", "decrease", "diminish", "lessen", "reduce", "reduction", "decline",
      "fall", "abate", "improve", "improvement", "better", "worse", "repair", "restore", "develop",
      "progress", "evolve", "adjust", "adapt", "shift", "aberration", "abolish", "abrogate", "repeal", "revoke"
    ],
  },
  {
    mainGroup: "Nature / Place / Time / Atmosphere / Physical World",
    visualFamily: "nature",
    icon: "World",
    description: "Nature, weather, places, time, materials, body, and the physical world.",
    subGroups: ["weather", "time", "place", "body", "object", "nature"],
    keywords: [
      "nature", "natural", "weather", "rain", "storm", "wind", "sun", "moon", "water", "river", "sea",
      "mountain", "forest", "animal", "plant", "tree", "place", "area", "land", "country", "city",
      "house", "home", "room", "time", "day", "night", "year", "old", "new", "ancient", "body", "hand",
      "eye", "face", "physical", "object", "thing", "material", "air", "earth", "fire", "atmosphere"
    ],
  },
];

const GROUP_BY_NAME = Object.fromEntries(GROUPS.map(group => [group.mainGroup, group]));

const GROUP_SPECIFICITY = {
  "Crime / Law / Court / Blame": 0,
  "Power / Rank / Leadership / Status": 1,
  "Brain / Intelligence / Judgement": 2,
  "Emotion / Feelings / Mind State": 3,
  "Change / Increase / Decrease / Improvement": 4,
  "Attack / Destruction / Conflict": 5,
  "Money / Quantity / Growth / Wealth": 6,
  "Social / Relationship / Behaviour": 7,
  "Speech / Communication / Expression": 8,
  "Work / Skill / Effort / Ability": 9,
  "Movement / Action / Speed / Travel": 10,
  "Nature / Place / Time / Atmosphere / Physical World": 11,
};

const GROUP_KEYWORD_EXPANSIONS = {
  "Brain / Intelligence / Judgement": [
    "clear", "clarity", "unclear", "obscure", "ambiguous", "vague", "perplex", "bewilder", "puzzle", "riddle",
    "difficult to understand", "hard to understand", "absurd", "ridiculous", "silly", "illogical", "logical",
    "sensible", "nonsense", "verify", "ascertain", "deduce", "discover", "find out", "predict", "foretell",
    "expect", "anticipate", "seemingly", "apparently", "evidently", "similar", "comparable", "analogous",
    "resemble", "perceptive", "keen", "acute", "critical", "serious", "curious", "inquisitive", "aware",
    "certain", "uncertain", "doubtful", "understanding", "meaning", "interpret", "explain", "proof",
    "prove", "prove wrong", "refute", "confute", "investigate", "search deeply", "scholarly", "learned",
    "knowledgeable", "experiment", "experience", "empirical", "coherent", "sequence", "connection",
    "prejudice", "partiality", "impartial"
  ],
  "Emotion / Feelings / Mind State": [
    "horror", "horrified", "dismay", "appal", "appall", "aghast", "shock", "surprise", "amaze", "astonish",
    "astound", "startle", "alarm", "frighten", "terrify", "nervous", "restless", "jumpy", "agitated",
    "excited", "enthusiastic", "eager", "ardent", "avid", "passionate", "allure", "attraction", "attractive",
    "tempt", "temptation", "entice", "charm", "fascinate", "seductive", "carefree", "cheerful", "blithe",
    "lament", "wail", "bemoan", "cry loudly", "bitter", "sour", "irritate", "annoy", "unpleasant",
    "disappointed", "discontented", "misery", "suffering", "wretchedness", "painful", "agonizing",
    "pain", "obsession", "fascination", "devotion", "laughter", "laugh", "humorous", "amusing",
    "entertaining", "lucky", "good wishes"
  ],
  "Speech / Communication / Expression": [
    "allude", "hint", "indirect reference", "specific mention", "mention", "reference", "statement", "claim",
    "assertion", "assert", "declaration", "declare", "openly declare", "proclaim", "announce publicly",
    "blasphemy", "irreverent words", "impious words", "words about god", "banter", "tease playfully",
    "cry", "bawl", "wail", "shout", "scream", "verbal", "tone", "sarcastic", "acerbic", "comment",
    "remark", "name", "call", "describe", "explain", "blessing", "good wishes", "encouragement",
    "flattery", "adulation", "coaxing", "cajoling", "reveal", "make known", "disclose", "divulge",
    "expository", "descriptive", "illustrative", "information", "record", "delete from record"
  ],
  "Movement / Action / Speed / Travel": [
    "arrival", "coming", "advent", "arriving", "go away", "come in", "enter", "exit", "lost", "astray",
    "right way", "wrong way", "delayed", "late", "belated", "walk slowly", "stroll", "saunter", "wander",
    "roam", "run away", "expel", "exile", "banish", "send away", "throw out", "surround", "encircle",
    "gather together", "assemble", "muster", "collect", "stockpile", "hold back", "restrain", "let down",
    "suspend", "state of suspension", "begin", "start", "commence", "route", "on the way", "enroute",
    "distribute", "give out", "draw out", "extract", "fork", "parting", "separation", "dividing"
  ],
  "Crime / Law / Court / Blame": [
    "free from blame", "free from guilt", "accuse falsely", "false accusation", "charge falsely", "culpable",
    "responsible for wrong", "fault", "atone", "expiate", "make up for", "deficiencies", "sacrilege",
    "irreverence", "forbid", "prohibit", "ban", "lawful", "unlawful", "valid", "invalid", "invalidate",
    "repeal", "revoke", "abolish a law", "cancel a law", "obey rules", "follow rules", "break the law",
    "rights", "fairness", "justice", "witness", "evidence", "verdict", "trial", "forgive", "pardon",
    "sanction", "right to vote", "vote", "spying", "surveillance", "observation", "mercy killing"
  ],
  "Attack / Destruction / Conflict": [
    "besiege", "armed forces", "surround with armed forces", "assault", "aggression", "deadly", "harmful",
    "baleful", "ominous", "menacing", "threatening", "dangerous", "wound", "injure", "violent", "brutal",
    "savage", "cruel", "breakable", "easily broken", "fragile", "brittle", "corrosive", "make impure",
    "contaminate", "pollute", "spoil", "ruin", "wreck", "devastate", "behead", "decapitate",
    "cut the head", "cut off the head", "harass", "trouble", "disaster", "calamity", "adversity",
    "constrict", "compress", "squeeze", "choke", "resistance", "disobedience", "defiance", "mockery",
    "ridicule", "contempt", "bloody", "provoke", "instigate", "stir up"
  ],
  "Social / Relationship / Behaviour": [
    "friendly and pleasant", "pleasant", "cordial", "sociable", "good humour", "playfully", "proper",
    "suitable", "appropriate", "apt", "relevant", "becoming", "manners", "demeanour", "attitude", "conduct",
    "rude", "offensive", "flagrant", "blatant", "disparage", "belittle", "make seem small", "unimportant",
    "deceive", "pretence", "pretend", "bluff", "tolerate", "endure", "brook", "show no interest",
    "indifferent", "apathetic", "ignore", "shame", "humiliate", "respect", "moral", "strictly moral",
    "plain", "without decoration", "secret", "hidden", "concealed", "stealthy", "loyalty", "faithfulness",
    "religious", "church", "pious", "papal", "young unmarried woman", "woman"
  ],
  "Power / Rank / Leadership / Status": [
    "highest point", "highest part", "top", "peak", "pinnacle", "summit", "zenith", "apex", "acme",
    "majestic", "imposing", "grand", "princely", "regal", "royal", "awesome", "dignified", "absolute",
    "complete power", "supreme", "increase in power", "gain power", "authority", "command", "prestigious",
    "reputation", "renowned", "celebrated", "notorious", "public honour", "office", "rank",
    "superiority", "arrogance", "haughtiness", "looking down", "first public appearance", "public appearance"
  ],
  "Money / Quantity / Growth / Wealth": [
    "rich and prosperous", "prosperous", "prosperity", "wealthy", "lavish", "luxury", "fortune", "treasure",
    "income", "profit", "stockpile", "amass", "accumulate", "acquisition", "getting something", "obtaining",
    "procure", "plenty", "abundance", "numerous", "several", "scarce", "shortage", "lack", "meagre",
    "limited", "worth", "precious", "valuable", "worthless", "cheap", "costly", "expenses",
    "spending", "wasteful", "fund", "sponsor", "advantage", "large", "huge", "enormous", "gigantic",
    "colossal", "broad", "wide", "extensive", "measure", "proportionate", "equal in measure"
  ],
  "Work / Skill / Effort / Ability": [
    "equipment", "accoutrements", "tools", "particular activity", "way of life", "beginner", "amateur",
    "non professional", "incompetent", "inept", "proficient", "dexterous", "adept", "expertise", "prepare",
    "ready", "method", "practice", "training", "achieve", "complete successfully", "fulfil", "attain",
    "accomplish", "effective", "ineffective", "fruitful", "abortive", "task", "duty", "purpose",
    "extremely good", "surpass", "excel", "inexperienced", "fledgling", "young and inexperienced",
    "secure", "firm", "finalize", "settle", "confirm", "ready"
  ],
  "Change / Increase / Decrease / Improvement": [
    "to make better", "make better", "better", "improve", "improvement", "repair", "restore", "recover",
    "to reduce pain", "reduce pain", "painkilling", "palliative", "analgesic", "lessen pain", "worsen",
    "intensify", "exacerbate", "aggravate", "become weaker", "weaker", "deteriorate", "decline", "decay",
    "shorten", "curtail", "trim", "abridge", "delay", "postpone", "change into", "deviate", "deviation",
    "abnormal", "anomalous", "unusual", "strange", "officially end", "put an end", "end a system",
    "cancel", "abolish", "abrogate", "repeal", "revoke", "invalidate", "opposite result", "backfire",
    "opposite", "against", "combine", "unite", "merge", "consolidate", "contract", "tighten",
    "no longer", "vanished", "defunct", "extinct", "erase", "delete", "wipe off", "remove",
    "lacking", "empty", "lack", "dry up", "dehydrate", "shrivel", "decorate", "adorn", "embellish",
    "brightly coloured", "decorated"
  ],
  "Nature / Place / Time / Atmosphere / Physical World": [
    "active at night", "night", "nocturnal", "cold", "chilly", "frigid", "algid", "numbing", "smell",
    "pleasant smell", "odour", "odor", "fragrance", "perfume", "aroma", "wide open", "open mouthed",
    "mouth", "body", "physical", "material", "substance", "fragile material", "house", "region", "site",
    "ancient", "temporary", "period", "era", "earthly", "water", "fire", "air", "flower", "flowers",
    "blossom", "flesh eating", "meat", "bay", "building", "texture", "rough", "harsh", "fine texture",
    "light and thin", "colour", "colored", "bird", "chicken", "goose", "pheasant", "dirty", "muddy",
    "murky", "blood", "fine particles", "dust", "sweep", "brush"
  ],
};

const SUBGROUP_RULES = [
  ["sharp-mind", ["clever", "wise", "intelligent", "smart", "sharp", "shrewd", "sagacious", "discerning", "perceptive", "insightful", "acute", "brilliant", "mentally quick", "keen", "acumen", "acuity", "astute", "wit", "mental ability", "quick understanding"]],
  ["confusion", ["confusion", "confuse", "doubt", "uncertain", "perplexed", "perplex", "bewildered", "bewilder", "obscure", "ambiguous", "vague", "unclear", "puzzled", "puzzle", "chaos", "dilemma"]],
  ["judgement", ["judgement", "judgment", "decision", "decide", "discern", "prudent", "sensible", "evaluate", "assess", "judge", "opinion", "discretion", "careful decision"]],
  ["memory", ["memory", "remember", "recall", "retain", "forget", "recollect", "remembrance", "memorise", "memorize"]],
  ["learning", ["learn", "study", "knowledge", "teach", "education", "instruction", "scholar", "lesson", "training"]],
  ["fear", ["fear", "afraid", "terror", "panic", "dread", "anxiety", "worry", "apprehension", "alarm", "horror", "fright", "scare", "daunt"]],
  ["anger", ["anger", "angry", "rage", "hatred", "hate", "detest", "loathe", "abhor", "hostility", "animosity", "resentment", "aversion", "wrath", "irritate", "annoy"]],
  ["sadness", ["sad", "sorrow", "grief", "mourn", "melancholy", "miserable", "despair", "weep", "lament", "dejected", "gloom"]],
  ["joy", ["joy", "happy", "delight", "cheerful", "glad", "pleasure", "bliss", "ecstatic", "ecstasy", "rejoice", "mirth"]],
  ["calm", ["calm", "peaceful", "peace", "serene", "relief", "tranquil", "composed", "placid", "soothed", "quiet", "relieve"]],
  ["desire", ["desire", "wish", "want", "longing", "yearn", "love", "craving", "ambition", "eager", "envy", "hope", "aspire"]],
  ["speech", ["speak", "speech", "say", "tell", "utter", "declare", "announce", "state", "mention", "remark", "talk", "express", "voice", "proclaim", "retort"]],
  ["argument", ["argue", "debate", "dispute", "quarrel", "altercation", "controversy", "verbal fight", "argument", "contention", "wrangle"]],
  ["praise", ["praise", "commend", "applaud", "flatter", "admire", "extol", "acclaim", "tribute", "eulogize", "compliment", "laud"]],
  ["agreement", ["agree", "assent", "consent", "accord", "comply", "accept", "concur", "agreement", "approve", "amenable"]],
  ["writing", ["write", "written", "letter", "record", "document", "note", "script", "compose", "scribe", "inscribe", "draft"]],
  ["silence", ["silence", "silent", "mute", "whisper", "hush", "tacit", "quiet", "wordless"]],
  ["motion", ["move", "go", "come", "walk", "run", "leave", "depart", "flee", "escape", "shift", "motion", "abandon", "advance", "retreat", "fall", "rise"]],
  ["speed", ["quick", "rapid", "fast", "swift", "hurry", "rush", "slow", "speed", "haste", "prompt"]],
  ["travel", ["travel", "journey", "voyage", "path", "road", "wander", "roam", "migrate", "trip", "tour", "pilgrim", "route"]],
  ["stop", ["stop", "halt", "pause", "cease", "still", "suspend", "end", "adjourn", "interrupt"]],
  ["carry", ["carry", "bring", "take", "send", "convey", "transport", "lift", "bear", "deliver", "fetch"]],
  ["action", ["act", "do", "perform", "execute", "action", "deed", "operate", "implement"]],
  ["crime", ["crime", "criminal", "theft", "steal", "rob", "fraud", "abduct", "kidnap", "murder", "culprit", "offence", "offense", "perpetrate"]],
  ["court", ["court", "trial", "judge", "verdict", "witness", "evidence", "acquit", "arraign", "lawsuit", "litigation", "testimony"]],
  ["punishment", ["punish", "punishment", "prison", "jail", "sentence", "arrest", "convict", "penalty", "fine", "imprison"]],
  ["blame", ["blame", "accuse", "guilty", "guilt", "charge", "culpable", "exonerate", "fault", "responsible"]],
  ["rule", ["law", "rule", "legal", "illegal", "regulation", "forbid", "repeal", "revoke", "abolish", "abrogate", "ban", "prohibit", "valid", "invalid"]],
  ["justice", ["justice", "rights", "fairness", "lawful", "equity", "fair", "righteous", "just"]],
  ["attack", ["attack", "assault", "strike", "hit", "aggression", "aggressive", "threat", "raid", "ambush"]],
  ["destruction", ["destroy", "ruin", "break", "crush", "smash", "annihilate", "wipe out", "damage", "burn", "demolish", "ravage"]],
  ["conflict", ["war", "battle", "clash", "enemy", "hostility", "oppose", "conflict", "fight", "rival", "strife"]],
  ["defence", ["defend", "protect", "resist", "shield", "defence", "defense", "guard"]],
  ["violence", ["violence", "wound", "injure", "hurt", "harm", "weapon", "violent", "brutal", "savage"]],
  ["friendship", ["friend", "friendly", "affable", "amiable", "amicable", "companion", "cordial", "pleasant", "kind", "sociable"]],
  ["family", ["family", "parent", "child", "marriage", "kin", "domestic", "relative", "spouse", "household"]],
  ["behaviour", ["manners", "habit", "behavior", "behaviour", "rude", "polite", "courteous", "insolent", "conduct", "demeanour", "demeanor", "attitude"]],
  ["society", ["social", "society", "community", "public", "group", "crowd", "collective", "civil"]],
  ["help", ["help", "aid", "assist", "support", "cooperate", "benefit", "rescue", "serve"]],
  ["insult", ["insult", "shame", "betray", "disrespect", "offend", "humiliate", "dishonour", "dishonor", "mock"]],
  ["leadership", ["king", "queen", "throne", "govern", "ruler", "leadership", "abdicate", "sovereign", "leader", "monarch", "reign"]],
  ["rank", ["rank", "position", "office", "superior", "inferior", "hierarchy", "level", "class"]],
  ["control", ["authority", "command", "power", "dominate", "obey", "control", "rule", "order", "master"]],
  ["status", ["status", "prestige", "honour", "honor", "reputation", "dignity", "respect", "esteem"]],
  ["fame", ["famous", "fame", "renowned", "celebrated", "notorious", "popular"]],
  ["freedom", ["freedom", "liberty", "independent", "autonomous", "free", "release"]],
  ["money-growth", ["money", "wealth", "income", "salary", "profit", "fortune", "rich", "treasure", "prosperity"]],
  ["poverty", ["poor", "poverty", "debt", "destitute", "needy", "bankrupt", "impoverished"]],
  ["quantity", ["quantity", "amount", "many", "much", "more", "less", "few", "abundant", "plenty", "numerous", "several"]],
  ["scarcity", ["scarcity", "scarce", "lack", "meagre", "meager", "limited", "shortage", "insufficient"]],
  ["trade", ["trade", "buy", "sell", "business", "cost", "price", "pay", "tax", "commerce", "market"]],
  ["value", ["value", "worth", "expensive", "cheap", "precious", "valuable", "priceless"]],
  ["skill", ["skill", "skilled", "expert", "dexterous", "proficient", "talented", "talent", "craft", "adept"]],
  ["effort", ["effort", "try", "strive", "attempt", "hardworking", "laborious", "endeavour", "endeavor", "diligent"]],
  ["work", ["work", "job", "task", "labour", "labor", "profession", "duty", "occupation", "employment"]],
  ["ability", ["ability", "able", "capable", "competent", "aptitude", "capacity", "potential"]],
  ["success", ["success", "successful", "fruitful", "effective", "useful", "achieve", "accomplish", "productive"]],
  ["failure", ["fail", "failure", "futile", "abortive", "ineffective", "useless", "vain", "unsuccessful"]],
  ["change", ["change", "alter", "modify", "transform", "shift", "adapt", "convert", "abrogate", "abolish", "repeal", "revoke", "adjust"]],
  ["increase", ["increase", "grow", "rise", "augment", "expand", "enlarge", "amplify", "escalate"]],
  ["reduction", ["reduce", "lessen", "diminish", "abate", "decrease", "wane", "shrink", "curtail", "mitigate"]],
  ["improvement", ["improve", "restore", "repair", "progress", "better", "recover", "enhance", "refine"]],
  ["decline", ["decline", "deteriorate", "worsen", "fall", "decay", "degrade"]],
  ["difference", ["difference", "deviation", "variation", "anomaly", "aberration", "different", "unusual", "irregular"]],
  ["weather", ["rain", "storm", "wind", "sun", "moon", "climate", "atmosphere", "weather", "cloud", "thunder"]],
  ["time", ["time", "day", "night", "year", "temporary", "ancient", "old", "new", "era", "period", "age"]],
  ["place", ["place", "area", "land", "city", "country", "house", "room", "region", "site", "location"]],
  ["body", ["body", "hand", "eye", "face", "head", "heart", "limb", "skin", "blood"]],
  ["object", ["object", "material", "thing", "tool", "substance", "item", "instrument"]],
  ["nature", ["forest", "river", "sea", "mountain", "tree", "plant", "animal", "earth", "fire", "water", "nature", "natural"]],
];

const DEFAULT_SUBGROUP_BY_GROUP = {
  "Brain / Intelligence / Judgement": "judgement",
  "Emotion / Feelings / Mind State": "desire",
  "Speech / Communication / Expression": "speech",
  "Movement / Action / Speed / Travel": "action",
  "Crime / Law / Court / Blame": "rule",
  "Attack / Destruction / Conflict": "conflict",
  "Social / Relationship / Behaviour": "behaviour",
  "Power / Rank / Leadership / Status": "status",
  "Money / Quantity / Growth / Wealth": "quantity",
  "Work / Skill / Effort / Ability": "ability",
  "Change / Increase / Decrease / Improvement": "change",
  "Nature / Place / Time / Atmosphere / Physical World": "object",
};

const WORD_OVERRIDES = {
  abduct: ["Crime / Law / Court / Blame", "crime"],
  acquit: ["Crime / Law / Court / Blame", "court"],
  culprit: ["Crime / Law / Court / Blame", "crime"],
  convict: ["Crime / Law / Court / Blame", "punishment"],
  culpable: ["Crime / Law / Court / Blame", "blame"],
  exonerate: ["Crime / Law / Court / Blame", "blame"],
  illegal: ["Crime / Law / Court / Blame", "rule"],
  litigation: ["Crime / Law / Court / Blame", "court"],
  perjury: ["Crime / Law / Court / Blame", "court"],
  verdict: ["Crime / Law / Court / Blame", "court"],
  witness: ["Crime / Law / Court / Blame", "court"],

  acumen: ["Brain / Intelligence / Judgement", "sharp-mind"],
  acuity: ["Brain / Intelligence / Judgement", "sharp-mind"],
  astute: ["Brain / Intelligence / Judgement", "sharp-mind"],
  aptitude: ["Brain / Intelligence / Judgement", "sharp-mind"],
  sagacious: ["Brain / Intelligence / Judgement", "sharp-mind"],
  shrewd: ["Brain / Intelligence / Judgement", "sharp-mind"],
  prudent: ["Brain / Intelligence / Judgement", "judgement"],

  abhor: ["Emotion / Feelings / Mind State", "anger"],
  animosity: ["Emotion / Feelings / Mind State", "anger"],
  aversion: ["Emotion / Feelings / Mind State", "anger"],
  melancholy: ["Emotion / Feelings / Mind State", "sadness"],
  apprehension: ["Emotion / Feelings / Mind State", "fear"],

  affable: ["Social / Relationship / Behaviour", "friendship"],
  amiable: ["Social / Relationship / Behaviour", "friendship"],
  amicable: ["Social / Relationship / Behaviour", "friendship"],
  courteous: ["Social / Relationship / Behaviour", "behaviour"],
  insolent: ["Social / Relationship / Behaviour", "insult"],

  abdicate: ["Power / Rank / Leadership / Status", "leadership"],
  sovereign: ["Power / Rank / Leadership / Status", "leadership"],
  authority: ["Power / Rank / Leadership / Status", "control"],
  supremacy: ["Power / Rank / Leadership / Status", "rank"],

  abate: ["Change / Increase / Decrease / Improvement", "reduction"],
  aberration: ["Change / Increase / Decrease / Improvement", "difference"],
  abolish: ["Change / Increase / Decrease / Improvement", "change"],
  abrogate: ["Change / Increase / Decrease / Improvement", "change"],
  repeal: ["Crime / Law / Court / Blame", "rule"],
  revoke: ["Crime / Law / Court / Blame", "rule"],
  augment: ["Change / Increase / Decrease / Improvement", "increase"],
  dwindle: ["Change / Increase / Decrease / Improvement", "reduction"],

  acme: ["Power / Rank / Leadership / Status", "status"],
  apex: ["Power / Rank / Leadership / Status", "status"],
  august: ["Power / Rank / Leadership / Status", "status"],
  absolute: ["Power / Rank / Leadership / Status", "status"],
  abysmal: ["Emotion / Feelings / Mind State", "sadness"],
  acerbic: ["Speech / Communication / Expression", "speech"],
  acute: ["Brain / Intelligence / Judgement", "sharp-mind"],
  advent: ["Movement / Action / Speed / Travel", "motion"],
  aggravate: ["Change / Increase / Decrease / Improvement", "decline"],
  aghast: ["Emotion / Feelings / Mind State", "fear"],
  agile: ["Movement / Action / Speed / Travel", "speed"],
  agog: ["Emotion / Feelings / Mind State", "desire"],
  allude: ["Speech / Communication / Expression", "speech"],
  allure: ["Emotion / Feelings / Mind State", "desire"],
  ambiguous: ["Brain / Intelligence / Judgement", "confusion"],
  astray: ["Movement / Action / Speed / Travel", "travel"],
  atone: ["Crime / Law / Court / Blame", "blame"],
  avid: ["Emotion / Feelings / Mind State", "desire"],
  attract: ["Emotion / Feelings / Mind State", "desire"],
  anodyne: ["Change / Increase / Decrease / Improvement", "improvement"],
  aroma: ["Nature / Place / Time / Atmosphere / Physical World", "object"],
  amass: ["Money / Quantity / Growth / Wealth", "quantity"],
  anomalous: ["Change / Increase / Decrease / Improvement", "difference"],
  adhere: ["Social / Relationship / Behaviour", "behaviour"],
  amateur: ["Work / Skill / Effort / Ability", "ability"],
  appal: ["Emotion / Feelings / Mind State", "fear"],
  astound: ["Emotion / Feelings / Mind State", "fear"],
  ascertain: ["Brain / Intelligence / Judgement", "judgement"],
  appropriate: ["Social / Relationship / Behaviour", "behaviour"],
  abridge: ["Change / Increase / Decrease / Improvement", "reduction"],
  anticipate: ["Brain / Intelligence / Judgement", "judgement"],
  accredit: ["Speech / Communication / Expression", "praise"],
  assertion: ["Speech / Communication / Expression", "speech"],
  alluring: ["Emotion / Feelings / Mind State", "desire"],
  absurd: ["Brain / Intelligence / Judgement", "judgement"],
  accomplish: ["Work / Skill / Effort / Ability", "success"],
  analogous: ["Brain / Intelligence / Judgement", "judgement"],
  antsy: ["Emotion / Feelings / Mind State", "fear"],
  algid: ["Nature / Place / Time / Atmosphere / Physical World", "weather"],
  acquisition: ["Money / Quantity / Growth / Wealth", "trade"],
  belated: ["Movement / Action / Speed / Travel", "stop"],
  belittle: ["Social / Relationship / Behaviour", "insult"],
  besiege: ["Attack / Destruction / Conflict", "attack"],
  bizarre: ["Change / Increase / Decrease / Improvement", "difference"],
  blasphemy: ["Speech / Communication / Expression", "speech"],
  blatant: ["Social / Relationship / Behaviour", "behaviour"],
  blithe: ["Emotion / Feelings / Mind State", "joy"],
  bluff: ["Social / Relationship / Behaviour", "behaviour"],
  brittle: ["Nature / Place / Time / Atmosphere / Physical World", "object"],
  brook: ["Social / Relationship / Behaviour", "behaviour"],
  baleful: ["Attack / Destruction / Conflict", "violence"],
  banish: ["Movement / Action / Speed / Travel", "motion"],
  banter: ["Speech / Communication / Expression", "speech"],
  bate: ["Movement / Action / Speed / Travel", "stop"],
  bawl: ["Speech / Communication / Expression", "speech"],
  becoming: ["Social / Relationship / Behaviour", "behaviour"],
  austere: ["Social / Relationship / Behaviour", "behaviour"],
  behead: ["Attack / Destruction / Conflict", "violence"],
  benediction: ["Speech / Communication / Expression", "speech"],
  beset: ["Attack / Destruction / Conflict", "attack"],
  blandishment: ["Speech / Communication / Expression", "praise"],
  boon: ["Social / Relationship / Behaviour", "help"],
  bullheaded: ["Brain / Intelligence / Judgement", "judgement"],
  bias: ["Brain / Intelligence / Judgement", "judgement"],
  blunt: ["Nature / Place / Time / Atmosphere / Physical World", "object"],
  broad: ["Money / Quantity / Growth / Wealth", "quantity"],
  bland: ["Emotion / Feelings / Mind State", "calm"],
  backfire: ["Change / Increase / Decrease / Improvement", "difference"],
  bogus: ["Brain / Intelligence / Judgement", "judgement"],
  bloom: ["Nature / Place / Time / Atmosphere / Physical World", "nature"],
  barrier: ["Movement / Action / Speed / Travel", "stop"],
  clandestine: ["Social / Relationship / Behaviour", "behaviour"],
  colossal: ["Money / Quantity / Growth / Wealth", "quantity"],
  conspicuous: ["Brain / Intelligence / Judgement", "judgement"],
  crux: ["Brain / Intelligence / Judgement", "judgement"],
  contagious: ["Nature / Place / Time / Atmosphere / Physical World", "body"],
  condone: ["Crime / Law / Court / Blame", "justice"],
  confute: ["Brain / Intelligence / Judgement", "judgement"],
  caress: ["Social / Relationship / Behaviour", "family"],
  carnivorous: ["Nature / Place / Time / Atmosphere / Physical World", "nature"],
  catastrophe: ["Attack / Destruction / Conflict", "destruction"],
  conceal: ["Social / Relationship / Behaviour", "behaviour"],
  commensurate: ["Money / Quantity / Growth / Wealth", "quantity"],
  congenital: ["Nature / Place / Time / Atmosphere / Physical World", "body"],
  connive: ["Crime / Law / Court / Blame", "crime"],
  concise: ["Speech / Communication / Expression", "speech"],
  crestfallen: ["Emotion / Feelings / Mind State", "sadness"],
  commence: ["Movement / Action / Speed / Travel", "action"],
  condescension: ["Power / Rank / Leadership / Status", "status"],
  coarse: ["Nature / Place / Time / Atmosphere / Physical World", "object"],
  clinch: ["Work / Skill / Effort / Ability", "success"],
  coveted: ["Emotion / Feelings / Mind State", "desire"],
  contiguous: ["Nature / Place / Time / Atmosphere / Physical World", "place"],
  comic: ["Emotion / Feelings / Mind State", "joy"],
  cove: ["Nature / Place / Time / Atmosphere / Physical World", "place"],
  constrict: ["Attack / Destruction / Conflict", "violence"],
  contempt: ["Social / Relationship / Behaviour", "insult"],
  cagy: ["Brain / Intelligence / Judgement", "judgement"],
  contrary: ["Attack / Destruction / Conflict", "conflict"],
  capitalise: ["Money / Quantity / Growth / Wealth", "trade"],
  consolidate: ["Change / Increase / Decrease / Improvement", "change"],
  debris: ["Attack / Destruction / Conflict", "destruction"],
  debut: ["Power / Rank / Leadership / Status", "status"],
  delve: ["Brain / Intelligence / Judgement", "learning"],
  devoid: ["Money / Quantity / Growth / Wealth", "scarcity"],
  dispense: ["Movement / Action / Speed / Travel", "carry"],
  deride: ["Social / Relationship / Behaviour", "insult"],
  discrepancy: ["Change / Increase / Decrease / Improvement", "difference"],
  disgruntled: ["Emotion / Feelings / Mind State", "anger"],
  disinterested: ["Brain / Intelligence / Judgement", "judgement"],
  disclose: ["Speech / Communication / Expression", "speech"],
  divulge: ["Speech / Communication / Expression", "speech"],
  deadlock: ["Movement / Action / Speed / Travel", "stop"],
  defunct: ["Change / Increase / Decrease / Improvement", "decline"],
  devour: ["Nature / Place / Time / Atmosphere / Physical World", "nature"],
  devout: ["Social / Relationship / Behaviour", "behaviour"],
  discourage: ["Emotion / Feelings / Mind State", "sadness"],
  dishevelled: ["Social / Relationship / Behaviour", "behaviour"],
  disparity: ["Change / Increase / Decrease / Improvement", "difference"],
  distress: ["Emotion / Feelings / Mind State", "sadness"],
  drastic: ["Change / Increase / Decrease / Improvement", "change"],
  disproportionate: ["Change / Increase / Decrease / Improvement", "difference"],
  damsel: ["Social / Relationship / Behaviour", "family"],
  defiance: ["Attack / Destruction / Conflict", "defence"],
  delicate: ["Nature / Place / Time / Atmosphere / Physical World", "object"],
  drab: ["Emotion / Feelings / Mind State", "sadness"],
  disjointed: ["Change / Increase / Decrease / Improvement", "difference"],
  decapitate: ["Attack / Destruction / Conflict", "violence"],
  disillusion: ["Emotion / Feelings / Mind State", "sadness"],
  derision: ["Social / Relationship / Behaviour", "insult"],
  divergence: ["Change / Increase / Decrease / Improvement", "difference"],
  dust: ["Nature / Place / Time / Atmosphere / Physical World", "object"],
  disenfranchise: ["Crime / Law / Court / Blame", "justice"],
  desiccate: ["Nature / Place / Time / Atmosphere / Physical World", "weather"],
  elicit: ["Speech / Communication / Expression", "speech"],
  embellish: ["Change / Increase / Decrease / Improvement", "improvement"],
  enormous: ["Money / Quantity / Growth / Wealth", "quantity"],
  entangle: ["Social / Relationship / Behaviour", "behaviour"],
  enthrall: ["Emotion / Feelings / Mind State", "desire"],
  extravagant: ["Money / Quantity / Growth / Wealth", "trade"],
  exigency: ["Movement / Action / Speed / Travel", "speed"],
  exuberance: ["Emotion / Feelings / Mind State", "joy"],
  edifice: ["Nature / Place / Time / Atmosphere / Physical World", "place"],
  exquisite: ["Nature / Place / Time / Atmosphere / Physical World", "object"],
  embrace: ["Social / Relationship / Behaviour", "friendship"],
  empirical: ["Brain / Intelligence / Judgement", "learning"],
  enroute: ["Movement / Action / Speed / Travel", "travel"],
  erudite: ["Brain / Intelligence / Judgement", "learning"],
  eschew: ["Movement / Action / Speed / Travel", "action"],
  espionage: ["Crime / Law / Court / Blame", "crime"],
  euthanasia: ["Crime / Law / Court / Blame", "justice"],
  expunge: ["Change / Increase / Decrease / Improvement", "reduction"],
  expose: ["Speech / Communication / Expression", "speech"],
  embed: ["Movement / Action / Speed / Travel", "action"],
  excruciating: ["Emotion / Feelings / Mind State", "sadness"],
  extinct: ["Change / Increase / Decrease / Improvement", "decline"],
  ecclesial: ["Social / Relationship / Behaviour", "society"],
  expository: ["Speech / Communication / Expression", "speech"],
  excel: ["Work / Skill / Effort / Ability", "success"],
  exclusion: ["Social / Relationship / Behaviour", "behaviour"],
  fidelity: ["Social / Relationship / Behaviour", "friendship"],
  flamboyant: ["Nature / Place / Time / Atmosphere / Physical World", "object"],
  flimsy: ["Nature / Place / Time / Atmosphere / Physical World", "object"],
  fledgling: ["Work / Skill / Effort / Ability", "ability"],
  furtive: ["Social / Relationship / Behaviour", "behaviour"],
  fluke: ["Emotion / Feelings / Mind State", "joy"],
  forego: ["Movement / Action / Speed / Travel", "stop"],
  fake: ["Brain / Intelligence / Judgement", "judgement"],
  fictitious: ["Brain / Intelligence / Judgement", "judgement"],
  fleck: ["Nature / Place / Time / Atmosphere / Physical World", "object"],
  fetish: ["Emotion / Feelings / Mind State", "desire"],
  firmly: ["Work / Skill / Effort / Ability", "success"],
  fowl: ["Nature / Place / Time / Atmosphere / Physical World", "nature"],
  foment: ["Attack / Destruction / Conflict", "conflict"],
  filthy: ["Nature / Place / Time / Atmosphere / Physical World", "object"],
  gory: ["Attack / Destruction / Conflict", "violence"],
};

const SYNONYM_FAMILY_OVERRIDES = [
  [["affable", "amiable", "amicable"], "Social / Relationship / Behaviour", "friendship"],
  [["acumen", "acuity", "astute", "sagacious", "shrewd"], "Brain / Intelligence / Judgement", "sharp-mind"],
  [["aptitude", "acumen", "acuity", "astute", "sagacious", "shrewd"], "Brain / Intelligence / Judgement", "sharp-mind"],
  [["competence", "dexterity"], "Work / Skill / Effort / Ability", "ability"],
  [["annihilate"], "Attack / Destruction / Conflict", "destruction"],
  [["abolish", "abrogate", "alter", "modify", "repeal", "revoke"], "Change / Increase / Decrease / Improvement", "change"],
  [["animosity", "aversion", "abhor", "detest", "loathe"], "Emotion / Feelings / Mind State", "anger"],
];

for (const [words, mainGroup, subGroup] of SYNONYM_FAMILY_OVERRIDES) {
  for (const word of words) {
    WORD_OVERRIDES[word] ||= [mainGroup, subGroup];
  }
}

const PHRASE_RULES = [
  ["Crime / Law / Court / Blame", "blame", ["free from blame", "free from guilt", "not guilty", "declare innocent", "declared innocent", "clear of blame", "clear of guilt"]],
  ["Crime / Law / Court / Blame", "court", ["in a court", "court of law", "legal proceeding", "give evidence", "under oath", "by law"]],
  ["Crime / Law / Court / Blame", "punishment", ["put in prison", "sentenced to", "punished for", "death penalty"]],
  ["Crime / Law / Court / Blame", "blame", ["accuse falsely", "falsely accuse", "false accusation", "charge falsely", "free from blame", "to free from blame"]],
  ["Crime / Law / Court / Blame", "rule", ["to obey rules", "obey rules", "follow rules", "legal rule", "break a law", "against the law"]],
  ["Brain / Intelligence / Judgement", "sharp-mind", ["sharpness of mind", "quick understanding", "ability to understand", "mental sharpness", "keen insight", "sound judgement", "sound judgment"]],
  ["Brain / Intelligence / Judgement", "confusion", ["unable to understand", "state of confusion", "make confused", "full of doubt", "difficult to understand", "hard to understand", "uncertain in meaning", "unclear in meaning"]],
  ["Brain / Intelligence / Judgement", "judgement", ["find out for certain", "not logical", "not sensible", "as far as one knows", "as far as one can see"]],
  ["Emotion / Feelings / Mind State", "anger", ["strong dislike", "deep hatred", "hate deeply", "intense dislike", "feel hatred", "strong hatred"]],
  ["Emotion / Feelings / Mind State", "fear", ["strong fear", "feeling of fear", "filled with fear", "great fear", "stupefied with horror", "greatly dismay", "greatly surprise", "very nervous"]],
  ["Emotion / Feelings / Mind State", "joy", ["gay joyous", "joyous cheerful", "cheerful or carefree"]],
  ["Emotion / Feelings / Mind State", "desire", ["cause liking", "cause interest", "very enthusiastic", "intensely curious", "very attractive", "very tempting"]],
  ["Social / Relationship / Behaviour", "friendship", ["friendly and pleasant", "friendly manner", "pleasant and friendly", "on friendly terms"]],
  ["Social / Relationship / Behaviour", "behaviour", ["good manners", "bad manners", "social behaviour", "social behavior", "proper attractive", "suitable appropriate", "to show no interest", "show no interest"]],
  ["Social / Relationship / Behaviour", "insult", ["make someone seem small", "make something seem small", "seem small or unimportant"]],
  ["Power / Rank / Leadership / Status", "leadership", ["give up throne", "give up the throne", "give up power", "give up the position", "king steps down", "queen steps down"]],
  ["Power / Rank / Leadership / Status", "control", ["have power over", "take control", "under authority", "give orders", "increase in power"]],
  ["Power / Rank / Leadership / Status", "status", ["highest point", "highest part", "very majestic", "public reputation"]],
  ["Change / Increase / Decrease / Improvement", "reduction", ["decrease or lessen", "diminish or lessen", "reduce in amount", "become less", "goes down", "storm goes down", "to reduce pain", "reduce pain", "to shorten"]],
  ["Change / Increase / Decrease / Improvement", "increase", ["increase in amount", "grow larger", "make greater", "become bigger", "increase in power"]],
  ["Change / Increase / Decrease / Improvement", "improvement", ["to make better", "make better", "restore to health", "reduce pain", "painkilling drug"]],
  ["Change / Increase / Decrease / Improvement", "decline", ["to become weaker", "become weaker", "to make worse", "make worse", "become worse"]],
  ["Change / Increase / Decrease / Improvement", "difference", ["deviation from normal", "variation from normal", "not normal", "abnormal variation"]],
  ["Change / Increase / Decrease / Improvement", "change", ["put an end to a system", "officially end", "do away with a system", "end a system", "bring an end to", "put an end to", "to make impure", "make impure"]],
  ["Crime / Law / Court / Blame", "rule", ["cancel a law", "repeal a law", "invalidate a rule", "abolish a law", "abrogate a law", "revoke a law", "end a law"]],
  ["Attack / Destruction / Conflict", "destruction", ["destroy completely", "wipe out", "physically destroy", "break into pieces"]],
  ["Attack / Destruction / Conflict", "attack", ["surround with armed forces", "under attack", "armed forces"]],
  ["Speech / Communication / Expression", "argument", ["heated argument", "exchange of words", "argue with", "verbal fight"]],
  ["Speech / Communication / Expression", "praise", ["to praise highly", "praise highly", "give credit to", "give credit"]],
  ["Speech / Communication / Expression", "speech", ["to speak indirectly", "speak indirectly", "make indirect reference", "openly declare", "strongly believe is true"]],
  ["Movement / Action / Speed / Travel", "motion", ["go away", "move away", "leave a place", "not intending to return"]],
  ["Movement / Action / Speed / Travel", "speed", ["to walk slowly", "walk slowly", "rapid or speedy"]],
  ["Movement / Action / Speed / Travel", "motion", ["to gather together", "gather together", "coming or arrival", "out of the right way"]],
  ["Movement / Action / Speed / Travel", "stop", ["state of suspension", "hold back", "delayed happening", "arriving late"]],
  ["Money / Quantity / Growth / Wealth", "money-growth", ["rich and prosperous", "very rich", "large amount of money"]],
  ["Money / Quantity / Growth / Wealth", "quantity", ["to gather together", "gather together", "process of getting", "stockpile"]],
  ["Nature / Place / Time / Atmosphere / Physical World", "time", ["active at night", "happening at night"]],
  ["Nature / Place / Time / Atmosphere / Physical World", "object", ["pleasant smell", "wide open", "easily broken"]],
  ["Work / Skill / Effort / Ability", "success", ["complete successfully", "achieve or complete", "to achieve"]],
  ["Work / Skill / Effort / Ability", "ability", ["particular activity", "incompetent or inept", "natural ability"]],
];

const ROOT_FAMILY_RULES = [
  ["Crime / Law / Court / Blame", "law-family", ["jur", "legal", "legis", "crimin", "culp", "accus", "guilt", "blam", "acquit", "exoner", "repeal", "revok", "forbid", "prohibit"]],
  ["Speech / Communication / Expression", "speech-family", ["laud", "eulog", "acclaim", "assert", "declar", "allud", "mention", "retort", "utter", "speak", "verbal", "blasphem", "banter"]],
  ["Emotion / Feelings / Mind State", "emotion-family", ["abhorr", "anim", "avers", "hostil", "resent", "dread", "horror", "aghast", "appal", "astound", "anx", "avid", "allur", "blithe"]],
  ["Brain / Intelligence / Judgement", "thinking-family", ["acu", "astut", "sagac", "prud", "clar", "ambigu", "absurd", "analog", "ascertain", "anticip", "apparent", "deduc", "logic", "sense"]],
  ["Change / Increase / Decrease / Improvement", "change-family", ["abat", "abridg", "aggravat", "worsen", "improv", "deterior", "anom", "aberr", "abol", "abrog", "alter", "modify", "reduce", "lessen", "augment"]],
  ["Movement / Action / Speed / Travel", "movement-family", ["advent", "depart", "wander", "banish", "astray", "belated", "agil", "arriv", "motion", "travel", "saunter", "stroll"]],
  ["Social / Relationship / Behaviour", "social-family", ["affab", "amiab", "amic", "courteous", "insol", "belittle", "bluff", "becoming", "proper", "soci", "cordial", "brook"]],
  ["Power / Rank / Leadership / Status", "status-family", ["abdica", "sovereign", "throne", "regal", "royal", "suprem", "authority", "prestig", "fame", "rank", "apex", "acme", "zenith"]],
  ["Money / Quantity / Growth / Wealth", "money-family", ["amass", "acquis", "wealth", "rich", "poor", "scarce", "value", "worth", "prosper", "profit", "debt", "abundan"]],
  ["Work / Skill / Effort / Ability", "work-family", ["skill", "aptitude", "dexter", "compet", "accompl", "achiev", "amateur", "inept", "equipment", "accout", "task", "labor"]],
  ["Attack / Destruction / Conflict", "battle-family", ["attack", "assault", "besieg", "harm", "baleful", "violent", "destroy", "crush", "smash", "war", "weapon"]],
  ["Nature / Place / Time / Atmosphere / Physical World", "physical-family", ["aroma", "fragrance", "algid", "frigid", "noct", "night", "body", "place", "material", "brittle", "earth", "water"]],
];

const SECOND_PASS_PHRASE_RULES = [
  ["Power / Rank / Leadership / Status", ["highest", "peak", "top", "pinnacle", "summit", "majestic", "regal", "grand"]],
  ["Brain / Intelligence / Judgement", ["unclear", "meaning", "not logical", "sensible", "find out", "predict", "similar", "resembling", "doubtful"]],
  ["Emotion / Feelings / Mind State", ["horror", "shock", "surprise", "nervous", "enthusiastic", "attractive", "tempting", "cheerful", "bad or unpleasant"]],
  ["Speech / Communication / Expression", ["reference", "statement", "claim", "words", "tone", "declare", "tell", "tease", "cry loudly"]],
  ["Movement / Action / Speed / Travel", ["arrival", "arriving", "late", "lost", "rapid", "speedy", "expel", "hold back"]],
  ["Crime / Law / Court / Blame", ["blame", "guilt", "law", "rule", "sacrilege", "accuse", "atone"]],
  ["Attack / Destruction / Conflict", ["armed forces", "harmful", "deadly", "destroy", "break", "dangerous"]],
  ["Social / Relationship / Behaviour", ["suitable", "proper", "pleasant", "deceive", "tolerate", "manners", "unimportant"]],
  ["Money / Quantity / Growth / Wealth", ["accumulate", "getting", "obtaining", "amount", "rich", "poor", "valuable"]],
  ["Work / Skill / Effort / Ability", ["activity", "equipment", "beginner", "incompetent", "achieve", "complete successfully"]],
  ["Change / Increase / Decrease / Improvement", ["worsen", "shorten", "deviation", "abnormal", "reduce pain", "make better", "officially end", "change"]],
  ["Nature / Place / Time / Atmosphere / Physical World", ["cold", "smell", "open mouthed", "night", "material", "physical"]],
];

const G = {
  brain: "Brain / Intelligence / Judgement",
  emotion: "Emotion / Feelings / Mind State",
  speech: "Speech / Communication / Expression",
  movement: "Movement / Action / Speed / Travel",
  law: "Crime / Law / Court / Blame",
  attack: "Attack / Destruction / Conflict",
  social: "Social / Relationship / Behaviour",
  power: "Power / Rank / Leadership / Status",
  money: "Money / Quantity / Growth / Wealth",
  work: "Work / Skill / Effort / Ability",
  change: "Change / Increase / Decrease / Improvement",
  nature: "Nature / Place / Time / Atmosphere / Physical World",
};

const DEFAULT_MEMORY_CLUSTER_BY_SUBGROUP = {
  "sharp-mind": "intelligence-words",
  confusion: "confusion-words",
  judgement: "judgement-words",
  memory: "memory-words",
  learning: "learning-words",
  fear: "fear-words",
  anger: "anger-words",
  sadness: "sadness-words",
  joy: "joy-words",
  calm: "calm-words",
  desire: "desire-words",
  speech: "speech-words",
  argument: "argument-words",
  praise: "praise-words",
  agreement: "agreement-words",
  writing: "writing-words",
  silence: "silence-words",
  motion: "motion-words",
  speed: "speed-words",
  travel: "travel-words",
  stop: "stop-words",
  carry: "carry-words",
  action: "action-words",
  crime: "crime-words",
  court: "court-words",
  punishment: "punishment-words",
  blame: "blame-words",
  rule: "law-words",
  justice: "justice-words",
  attack: "attack-words",
  destruction: "destruction-words",
  conflict: "conflict-words",
  defence: "defence-words",
  violence: "violence-words",
  friendship: "friendly-words",
  family: "family-words",
  behaviour: "behaviour-words",
  society: "society-words",
  help: "help-words",
  insult: "insult-words",
  leadership: "leadership-words",
  rank: "rank-words",
  control: "control-words",
  status: "status-words",
  fame: "fame-words",
  freedom: "freedom-words",
  "money-growth": "wealth-words",
  poverty: "poverty-words",
  quantity: "quantity-words",
  scarcity: "scarcity-words",
  trade: "trade-words",
  value: "value-words",
  skill: "skill-words",
  effort: "effort-words",
  work: "work-words",
  ability: "ability-words",
  success: "success-words",
  failure: "failure-words",
  change: "change-words",
  increase: "increase-words",
  reduction: "reduction-words",
  improvement: "improvement-words",
  decline: "decline-words",
  difference: "difference-words",
  weather: "weather-words",
  time: "time-words",
  place: "place-words",
  body: "body-words",
  object: "object-words",
  nature: "nature-words",
  "needs-review": "review",
};

function p(mainGroup, subGroup, memoryCluster) {
  return {
    mainGroup,
    subGroup,
    visualFamily: GROUP_BY_NAME[mainGroup]?.visualFamily || "review",
    memoryCluster: memoryCluster || DEFAULT_MEMORY_CLUSTER_BY_SUBGROUP[subGroup] || "general-words",
  };
}

export const MANUAL_GROUP_PATCH = {
  adhere: p(G.nature, "object"),
  appropriate: p(G.brain, "judgement"),
  absolute: p(G.work, "success"),
  anodyne: p(G.emotion, "calm"),
  amass: p(G.money, "money-growth"),
  belated: p(G.nature, "time"),
  bland: p(G.emotion, "sadness"),

  droop: p(G.movement, "motion"),
  eternal: p(G.nature, "time"),
  everlasting: p(G.nature, "time"),
  falsity: p(G.brain, "judgement"),
  faddish: p(G.social, "society"),
  ghastly: p(G.emotion, "fear"),
  genesis: p(G.nature, "time"),
  gimmick: p(G.social, "behaviour"),
  grapple: p(G.attack, "conflict"),
  gratify: p(G.emotion, "joy"),
  guile: p(G.social, "behaviour"),
  gobble: p(G.movement, "speed"),
  giddy: p(G.emotion, "joy"),
  genuine: p(G.brain, "judgement"),
  golden: p(G.work, "success"),
  hectic: p(G.movement, "speed"),
  hoax: p(G.social, "behaviour"),
  humility: p(G.social, "behaviour"),
  hasten: p(G.movement, "speed"),
  hurdle: p(G.movement, "stop"),
  hygiene: p(G.nature, "body"),
  habitant: p(G.nature, "place"),
  hype: p(G.speech, "praise"),
  implausible: p(G.brain, "judgement"),
  inadvertent: p(G.brain, "judgement"),
  insane: p(G.brain, "confusion"),
  iniquitous: p(G.law, "justice"),
  incorrigible: p(G.social, "behaviour"),
  indefatigable: p(G.work, "effort"),
  invincible: p(G.attack, "defence"),
  inebriated: p(G.nature, "body"),
  incredible: p(G.brain, "judgement"),
  inexhaustible: p(G.work, "effort"),
  implore: p(G.speech, "speech"),
  imitate: p(G.work, "skill"),
  ignoble: p(G.social, "insult"),
  incredulous: p(G.brain, "judgement"),
  ineffectual: p(G.work, "failure"),
  infallible: p(G.work, "success"),
  insatiable: p(G.emotion, "desire"),
  intangible: p(G.nature, "object"),
  introspect: p(G.brain, "judgement"),
  irremediable: p(G.change, "decline"),
  lax: p(G.law, "rule"),
  legacy: p(G.nature, "time"),
  juvenile: p(G.nature, "time"),
  lopsided: p(G.nature, "object"),
  luminous: p(G.nature, "object"),
  knotty: p(G.brain, "confusion"),
  knave: p(G.law, "crime"),
  lustre: p(G.nature, "object"),
  mellow: p(G.emotion, "calm"),
  meticulous: p(G.work, "skill"),
  mettle: p(G.work, "effort"),
  mundane: p(G.nature, "time"),
  nadir: p(G.power, "rank"),
  manacle: p(G.law, "punishment"),
  opalescent: p(G.nature, "object"),
  obscene: p(G.social, "behaviour"),
  opportune: p(G.nature, "time"),
  opaque: p(G.nature, "object"),
  obligatory: p(G.law, "rule"),
  occlude: p(G.movement, "stop"),
  optimal: p(G.work, "success"),
  optimistic: p(G.emotion, "joy"),
  optional: p(G.power, "freedom"),
  pageant: p(G.social, "society"),
  panacea: p(G.change, "improvement"),
  paragon: p(G.work, "success"),
  parched: p(G.nature, "weather"),
  parity: p(G.law, "justice"),
  pastoral: p(G.nature, "place"),
  patron: p(G.social, "help"),
  pecuniary: p(G.money, "trade"),
  peevish: p(G.emotion, "anger"),
  penchant: p(G.emotion, "desire"),
  perpetual: p(G.nature, "time"),
  "pipe dream": p(G.brain, "confusion"),
  plausible: p(G.brain, "judgement"),
  posthumous: p(G.nature, "time"),
  pounce: p(G.movement, "speed"),
  precise: p(G.brain, "judgement"),
  predicament: p(G.brain, "confusion"),
  predilection: p(G.emotion, "desire"),
  prerogative: p(G.power, "status"),
  protagonist: p(G.power, "status"),
  prototype: p(G.work, "skill"),
  punctilious: p(G.work, "skill"),
  paradigm: p(G.work, "success"),
  penultimate: p(G.nature, "time"),
  peripheral: p(G.nature, "place"),
  peruse: p(G.brain, "learning"),
  pervasive: p(G.movement, "motion"),
  perversion: p(G.social, "behaviour"),
  pliable: p(G.change, "change"),
  preclude: p(G.movement, "stop"),
  premeditation: p(G.brain, "judgement"),
  pretext: p(G.speech, "speech"),
  progeny: p(G.social, "family"),
  prolific: p(G.work, "success"),
  propagate: p(G.change, "increase"),
  pseudo: p(G.brain, "judgement"),
  primary: p(G.power, "rank"),
  perseverance: p(G.work, "effort"),
  protest: p(G.speech, "argument"),
  populous: p(G.money, "quantity"),
  partisan: p(G.brain, "judgement"),
  pudgy: p(G.nature, "body"),
  quest: p(G.movement, "travel"),
  querulous: p(G.speech, "argument"),
  quintessence: p(G.work, "success"),
  quixotic: p(G.brain, "judgement"),
  recurrent: p(G.nature, "time"),
  redress: p(G.change, "improvement"),
  redundant: p(G.money, "quantity"),
  reiterate: p(G.speech, "speech"),
  rejuvenate: p(G.change, "improvement"),
  relinquish: p(G.power, "control"),
  remnant: p(G.money, "quantity"),
  remonstrate: p(G.speech, "argument"),
  replenish: p(G.change, "increase"),
  replica: p(G.work, "skill"),
  retrospective: p(G.nature, "time"),
  rigid: p(G.social, "behaviour"),
  rudimentary: p(G.brain, "learning"),
  reckless: p(G.brain, "judgement"),
  rectify: p(G.change, "improvement"),
  renunciation: p(G.power, "freedom"),
  requisite: p(G.work, "work"),
  residue: p(G.money, "quantity"),
  resplendent: p(G.nature, "object"),
  resumption: p(G.movement, "action"),
  retain: p(G.brain, "memory"),
  riveting: p(G.emotion, "desire"),
  regime: p(G.law, "rule"),
  rind: p(G.nature, "nature"),
  remedy: p(G.change, "improvement"),
  radiance: p(G.nature, "object"),
  rear: p(G.nature, "place"),
  reproduce: p(G.nature, "nature"),
  radiant: p(G.nature, "object"),
  salient: p(G.power, "status"),
  sanctity: p(G.social, "behaviour"),
  satiate: p(G.emotion, "desire"),
  saturate: p(G.nature, "object"),
  servile: p(G.power, "rank"),
  shackle: p(G.law, "punishment"),
  shun: p(G.social, "behaviour"),
  sinuous: p(G.movement, "motion"),
  solicit: p(G.speech, "speech"),
  soliloquy: p(G.speech, "speech"),
  sonorous: p(G.speech, "speech"),
  somnolent: p(G.nature, "body"),
  soporific: p(G.emotion, "calm"),
  sporadic: p(G.nature, "time"),
  squander: p(G.money, "trade"),
  stringent: p(G.law, "rule"),
  substantial: p(G.money, "quantity"),
  supercilious: p(G.power, "status"),
  surrogate: p(G.social, "family"),
  surmount: p(G.movement, "action"),
  spill: p(G.movement, "motion"),
  shimmer: p(G.nature, "object"),
  stretch: p(G.change, "increase"),
  slender: p(G.nature, "body"),
  scrap: p(G.nature, "object"),
  sustenance: p(G.nature, "body"),
  shallow: p(G.nature, "place"),
  soggy: p(G.nature, "weather"),
  sunder: p(G.attack, "destruction"),
  savour: p(G.emotion, "joy"),
  subterranean: p(G.nature, "place"),
  slick: p(G.nature, "object"),
  sparkling: p(G.nature, "object"),
  symptomatic: p(G.nature, "body"),
  sly: p(G.brain, "sharp-mind"),
  sleek: p(G.nature, "object"),
  sorcery: p(G.nature, "object"),
  suppress: p(G.attack, "attack"),
  tangential: p(G.brain, "judgement"),
  tantalize: p(G.emotion, "desire"),
  taut: p(G.nature, "object"),
  temperate: p(G.emotion, "calm"),
  tender: p(G.social, "help"),
  tenuous: p(G.change, "decline"),
  terminal: p(G.nature, "time"),
  theoretical: p(G.brain, "judgement"),
  tiresome: p(G.emotion, "sadness"),
  toady: p(G.power, "rank"),
  torrid: p(G.emotion, "desire"),
  touchy: p(G.emotion, "anger"),
  tractable: p(G.power, "control"),
  trawl: p(G.brain, "learning"),
  tremulous: p(G.emotion, "fear"),
  tag: p(G.nature, "object"),
  trendy: p(G.social, "society"),
  tale: p(G.speech, "speech"),
  unabashed: p(G.emotion, "calm"),
  unassuming: p(G.social, "behaviour"),
  unconscionable: p(G.social, "behaviour"),
  underdressed: p(G.social, "behaviour"),
  underscore: p(G.speech, "speech"),
  undone: p(G.change, "decline"),
  unfeigned: p(G.brain, "judgement"),
  unfettered: p(G.power, "freedom"),
  unkempt: p(G.social, "behaviour"),
  unprecedented: p(G.nature, "time"),
  uproar: p(G.speech, "argument"),
  upshot: p(G.work, "success"),
  unacknowledged: p(G.brain, "judgement"),
  vanquish: p(G.attack, "conflict"),
  vapid: p(G.emotion, "sadness"),
  vaunted: p(G.speech, "praise"),
  verdant: p(G.nature, "nature"),
  veritable: p(G.brain, "judgement"),
  verity: p(G.brain, "judgement"),
  verve: p(G.emotion, "joy"),
  vigour: p(G.work, "effort"),
  viscid: p(G.nature, "object"),
  vista: p(G.nature, "place"),
  vociferous: p(G.speech, "speech"),
  vogue: p(G.social, "society"),
  voluble: p(G.speech, "speech"),
  votary: p(G.social, "society"),
  vulpine: p(G.brain, "sharp-mind"),
  vital: p(G.nature, "body"),
  valiance: p(G.attack, "defence"),
  villainous: p(G.law, "crime"),
  venial: p(G.law, "justice"),
  vigorous: p(G.work, "effort"),
  viscous: p(G.nature, "object"),
  vivacity: p(G.emotion, "joy"),
  vanish: p(G.movement, "motion"),
  "wallow in": p(G.emotion, "desire"),
  weary: p(G.emotion, "sadness"),
  wraith: p(G.emotion, "fear"),
  wicked: p(G.law, "crime"),
  yield: p(G.power, "control"),
  zest: p(G.emotion, "joy"),
  inflexible: p(G.social, "behaviour"),
  irrefluable: p(G.brain, "judgement"),
  introspection: p(G.brain, "judgement"),
  invigorate: p(G.change, "improvement"),
  intersperse: p(G.movement, "motion"),
  intimate: p(G.social, "friendship"),
  morsel: p(G.nature, "object"),
  munch: p(G.movement, "action"),
  nagging: p(G.speech, "argument"),
  naked: p(G.nature, "body"),
  nap: p(G.nature, "body"),
  "non-committal": p(G.brain, "judgement"),
  numismatist: p(G.money, "trade"),
  nascence: p(G.nature, "time"),
  nacreous: p(G.nature, "object"),

  adamant: p(G.social, "behaviour"),
  admonish: p(G.speech, "argument"),
  alleviate: p(G.change, "improvement"),
  ambivalent: p(G.brain, "confusion"),
  abrupt: p(G.movement, "speed"),
  acrimonious: p(G.emotion, "anger"),
  aspersion: p(G.speech, "argument"),
  attrition: p(G.change, "reduction"),
  affinity: p(G.social, "friendship"),
  abominable: p(G.emotion, "anger"),
  arid: p(G.nature, "weather"),
  accolade: p(G.speech, "praise"),
  abnegation: p(G.power, "freedom"),
  beguile: p(G.social, "behaviour"),
  banal: p(G.emotion, "sadness"),
  beget: p(G.change, "increase"),
  bereft: p(G.emotion, "sadness"),
  blush: p(G.emotion, "sadness"),
  boost: p(G.change, "increase"),
  burlesque: p(G.speech, "argument"),
  compassion: p(G.social, "help"),
  cacophony: p(G.speech, "speech"),
  candid: p(G.speech, "speech"),
  cogent: p(G.brain, "judgement"),
  connoisseur: p(G.work, "skill"),
  circuitous: p(G.movement, "travel"),
  circumlocution: p(G.speech, "speech"),
  clumsy: p(G.work, "failure"),
  cadence: p(G.speech, "speech"),
  crooked: p(G.nature, "object"),
  consequence: p(G.change, "change"),
  conspire: p(G.law, "crime"),
  condescending: p(G.power, "status"),
  chide: p(G.speech, "argument"),
  debonair: p(G.social, "behaviour"),
  denounce: p(G.speech, "argument"),
  deprive: p(G.power, "control"),
  distort: p(G.change, "difference"),
  dapper: p(G.social, "behaviour"),
  effusion: p(G.speech, "speech"),
  evasive: p(G.speech, "speech"),
  expansion: p(G.change, "increase"),
  enthusiasm: p(G.emotion, "joy"),
  furore: p(G.speech, "argument"),
  fritter: p(G.money, "trade"),
  fumble: p(G.work, "failure"),
  fussy: p(G.brain, "judgement"),
  festivity: p(G.emotion, "joy"),
  adduce: p(G.speech, "argument"),
  adjourn: p(G.nature, "time"),
  adverse: p(G.attack, "conflict"),
  ascribe: p(G.brain, "judgement"),
  applause: p(G.speech, "praise"),
  adversary: p(G.attack, "conflict"),
  artful: p(G.brain, "sharp-mind"),
  assassinate: p(G.law, "crime"),
  bequeath: p(G.money, "money-growth"),
  beseech: p(G.speech, "speech"),
  betray: p(G.social, "insult"),
  buoyant: p(G.emotion, "joy"),
  barbarous: p(G.attack, "violence"),
  beatific: p(G.emotion, "joy"),
  betrayal: p(G.social, "insult"),
  bigot: p(G.social, "behaviour"),
  bleak: p(G.emotion, "sadness"),
  brisk: p(G.movement, "speed"),
  bulge: p(G.nature, "object"),
  beneficiary: p(G.social, "help"),
  bestow: p(G.power, "status"),
  blink: p(G.nature, "body"),
  bumpy: p(G.nature, "object"),
  behemoth: p(G.money, "quantity"),
  cajole: p(G.speech, "praise"),
  cantankerous: p(G.emotion, "anger"),
  caustic: p(G.attack, "violence"),
  chaste: p(G.social, "behaviour"),
  chronic: p(G.nature, "time"),
  clemency: p(G.law, "justice"),
  compatible: p(G.social, "behaviour"),
  conciliate: p(G.social, "friendship"),
  cognizance: p(G.brain, "learning"),
  conscience: p(G.brain, "judgement"),
  charisma: p(G.social, "friendship"),
  cliche: p(G.speech, "speech"),
  conservative: p(G.change, "change"),
  callous: p(G.social, "behaviour"),
  coerce: p(G.power, "control"),
  congested: p(G.movement, "stop"),
  committed: p(G.work, "effort"),
  connote: p(G.speech, "speech"),
  craven: p(G.emotion, "fear"),
  condense: p(G.change, "reduction"),
  daunt: p(G.emotion, "fear"),
  deter: p(G.movement, "stop"),
  dire: p(G.emotion, "fear"),
  disposition: p(G.social, "behaviour"),
  disseminate: p(G.speech, "speech"),
  doldrums: p(G.emotion, "sadness"),
  deliberate: p(G.brain, "judgement"),
  deplore: p(G.emotion, "sadness"),
  desecrate: p(G.social, "insult"),
  discreet: p(G.brain, "judgement"),
  dismantle: p(G.attack, "destruction"),
  disguise: p(G.social, "behaviour"),
  disperse: p(G.movement, "motion"),
  devious: p(G.social, "behaviour"),
  degradation: p(G.change, "decline"),
  delinquency: p(G.law, "crime"),
  detachment: p(G.emotion, "calm"),
  encroach: p(G.law, "crime"),
  ennui: p(G.emotion, "sadness"),
  epitome: p(G.work, "success"),
  explicit: p(G.speech, "speech"),
  expurgate: p(G.change, "reduction"),
  exhume: p(G.movement, "action"),
  extraneous: p(G.brain, "judgement"),
  estrange: p(G.social, "behaviour"),
  exempt: p(G.law, "rule"),
  exclusive: p(G.social, "behaviour"),
  exorcise: p(G.movement, "action"),
  easiness: p(G.work, "ability"),
  fabulous: p(G.emotion, "joy"),
  facetious: p(G.speech, "speech"),
  fiendish: p(G.attack, "violence"),
  fulminate: p(G.speech, "argument"),
  fortitude: p(G.attack, "defence"),
  fallible: p(G.brain, "judgement"),
  fecund: p(G.nature, "nature"),
  frustrate: p(G.attack, "conflict"),
  foul: p(G.emotion, "anger"),
  frenzy: p(G.emotion, "joy"),
  flummoxed: p(G.brain, "confusion"),
  flabby: p(G.nature, "body"),
  garrulous: p(G.speech, "speech"),
  gruesome: p(G.emotion, "fear"),
  grandiloquent: p(G.speech, "speech"),
  gluttonous: p(G.emotion, "desire"),
  gourmand: p(G.emotion, "desire"),
  gloomy: p(G.emotion, "sadness"),
  haggard: p(G.nature, "body"),
  humdrum: p(G.emotion, "sadness"),
  hegemony: p(G.power, "control"),
  hymn: p(G.speech, "praise"),
  hysterical: p(G.emotion, "fear"),

  attenuate: p(G.change, "reduction"),
  contravene: p(G.law, "rule"),
  commute: p(G.movement, "travel"),
  diverge: p(G.change, "difference"),
  induce: p(G.speech, "speech"),
  incessant: p(G.nature, "time"),
  indemnify: p(G.money, "value"),
  indulgent: p(G.social, "behaviour"),
  ingenuous: p(G.social, "behaviour"),
  ingratitude: p(G.social, "insult"),
  intrepid: p(G.attack, "defence"),
  irreconcilable: p(G.speech, "argument"),
  jaded: p(G.emotion, "sadness"),
  jargon: p(G.speech, "speech"),
  lethargic: p(G.emotion, "sadness"),
  licentious: p(G.social, "behaviour"),
  juxtaposition: p(G.nature, "place"),
  jejune: p(G.emotion, "sadness"),
  loom: p(G.attack, "conflict"),
  lurk: p(G.movement, "motion"),
  malign: p(G.speech, "argument"),
  martyr: p(G.social, "society"),
  mawkish: p(G.emotion, "sadness"),
  meek: p(G.social, "behaviour"),
  moot: p(G.speech, "argument"),
  naive: p(G.brain, "judgement"),
  narcissist: p(G.social, "behaviour"),
  neutral: p(G.brain, "judgement"),
  nonentity: p(G.power, "status"),
  occult: p(G.brain, "confusion"),
  obnoxious: p(G.social, "behaviour"),
  oust: p(G.movement, "motion"),
  outlandish: p(G.change, "difference"),
  obstruct: p(G.movement, "stop"),
  obstruction: p(G.movement, "stop"),
  pedagogue: p(G.brain, "learning"),
  philanderer: p(G.social, "behaviour"),
  placate: p(G.emotion, "calm"),
  perpetrate: p(G.law, "crime"),
  pithy: p(G.speech, "speech"),
  plummet: p(G.change, "decline"),
  pound: p(G.attack, "attack"),
  precursor: p(G.nature, "time"),
  prominent: p(G.power, "status"),
  principle: p(G.brain, "judgement"),
  persist: p(G.work, "effort"),
  qualm: p(G.brain, "confusion"),
  rancid: p(G.nature, "object"),
  reconcile: p(G.social, "friendship"),
  renegade: p(G.social, "insult"),
  revelry: p(G.emotion, "joy"),
  ruthless: p(G.attack, "violence"),
  repellent: p(G.emotion, "anger"),
  repercussion: p(G.change, "change"),
  scrupulous: p(G.social, "behaviour"),
  serenity: p(G.emotion, "calm"),
  spartan: p(G.social, "behaviour"),
  subside: p(G.change, "reduction"),
  sordid: p(G.social, "behaviour"),
  stingy: p(G.money, "scarcity"),
  smudge: p(G.nature, "object"),
  surge: p(G.change, "increase"),
  scattered: p(G.movement, "motion"),
  tamper: p(G.change, "change"),
  tether: p(G.movement, "stop"),
  timidity: p(G.emotion, "fear"),
  tirade: p(G.speech, "argument"),
  tonsure: p(G.social, "behaviour"),
  topple: p(G.movement, "motion"),
  traduce: p(G.speech, "argument"),
  transpire: p(G.speech, "speech"),
  undesirable: p(G.social, "behaviour"),
  veil: p(G.social, "behaviour"),
  vengeance: p(G.attack, "conflict"),
  versatile: p(G.work, "skill"),
  virago: p(G.emotion, "anger"),
  yell: p(G.speech, "speech"),
  zany: p(G.emotion, "joy"),
  incur: p(G.change, "decline"),
  endorse: p(G.social, "help"),
  foster: p(G.social, "help"),
  frugal: p(G.money, "scarcity"),
  fuse: p(G.change, "change"),
  flout: p(G.law, "rule"),
  grudge: p(G.emotion, "anger"),
  hackneyed: p(G.speech, "speech"),
  homogeneous: p(G.brain, "judgement"),
  haphazard: p(G.brain, "judgement"),
  ignominy: p(G.social, "insult"),
  impetus: p(G.change, "increase"),
  implicit: p(G.speech, "speech"),
  impenetrable: p(G.brain, "confusion"),
  impinge: p(G.law, "crime"),
  industrious: p(G.work, "effort"),
  imbue: p(G.emotion, "desire"),
  matriarchy: p(G.power, "leadership"),
  nibble: p(G.movement, "action"),
  hamper: p(G.movement, "stop"),
  hapless: p(G.emotion, "sadness"),
  heinous: p(G.law, "crime"),
  hindrance: p(G.movement, "stop"),
  impeccable: p(G.work, "success"),
  imbibe: p(G.nature, "body"),
  imminent: p(G.nature, "time"),
  impending: p(G.nature, "time"),
  immolate: p(G.attack, "violence"),
  impede: p(G.movement, "stop"),
  inception: p(G.nature, "time"),
  infirm: p(G.nature, "body"),
  irrelevant: p(G.brain, "judgement"),
  jaunt: p(G.movement, "travel"),
  kudos: p(G.speech, "praise"),
  laconic: p(G.speech, "speech"),
  logjam: p(G.movement, "stop"),
  maudlin: p(G.emotion, "sadness"),
  miffed: p(G.emotion, "anger"),
  morose: p(G.emotion, "sadness"),
  nasty: p(G.social, "behaviour"),
  numb: p(G.nature, "body"),
  objective: p(G.brain, "judgement"),
  obsequious: p(G.power, "rank"),
  officious: p(G.social, "behaviour"),
};

const WRONG_OVERRIDE_FIX_WORDS = [
  "adhere",
  "appropriate",
  "absolute",
  "anodyne",
  "amass",
  "belated",
  "bland",
  "accolade",
  "compassion",
  "candid",
  "connoisseur",
  "circuitous",
  "circumlocution",
  "debonair",
];

const MEMORY_CLUSTER_RULES = [
  ["friendly-words", "Social / Relationship / Behaviour", ["friendship", "help"], ["friendly", "pleasant", "kind", "amiable", "amicable", "affable"]],
  ["anger-words", "Emotion / Feelings / Mind State", ["anger"], ["hate", "hatred", "dislike", "abhor", "animosity", "aversion"]],
  ["fear-words", "Emotion / Feelings / Mind State", ["fear"], ["fear", "afraid", "terror", "panic", "dread", "apprehension"]],
  ["joy-words", "Emotion / Feelings / Mind State", ["joy"], ["joy", "happy", "cheerful", "enthusiasm", "zest", "vivacity"]],
  ["calm-words", "Emotion / Feelings / Mind State", ["calm"], ["calm", "relief", "soothe", "peaceful", "temperate"]],
  ["confusion-words", "Brain / Intelligence / Judgement", ["confusion"], ["unclear", "confuse", "ambiguous", "knotty", "implausible"]],
  ["intelligence-words", "Brain / Intelligence / Judgement", ["sharp-mind", "judgement", "memory", "learning"], ["mind", "intelligence", "wise", "clever", "acumen", "acuity", "astute", "aptitude"]],
  ["praise-words", "Speech / Communication / Expression", ["praise"], ["praise", "acclaim", "accolade", "adulation", "applause", "vaunted"]],
  ["argument-words", "Speech / Communication / Expression", ["argument"], ["argue", "protest", "complain", "remonstrate", "admonish"]],
  ["travel-words", "Movement / Action / Speed / Travel", ["travel"], ["journey", "route", "quest", "circuitous", "wander"]],
  ["law-words", "Crime / Law / Court / Blame", ["court", "rule", "justice", "blame", "punishment", "crime"], ["law", "court", "legal", "illegal", "rule", "guilt", "trial"]],
  ["punishment-words", "Crime / Law / Court / Blame", ["punishment"], ["prison", "sentence", "punish", "shackle", "manacle"]],
  ["leadership-words", "Power / Rank / Leadership / Status", ["leadership"], ["king", "queen", "throne", "ruler", "abdicate"]],
  ["wealth-words", "Money / Quantity / Growth / Wealth", ["money-growth"], ["wealth", "rich", "profit", "fortune", "pecuniary", "amass"]],
  ["quantity-words", "Money / Quantity / Growth / Wealth", ["quantity", "scarcity"], ["amount", "many", "few", "scarce", "populous", "redundant"]],
  ["skill-words", "Work / Skill / Effort / Ability", ["skill", "ability"], ["skill", "expert", "connoisseur", "meticulous", "punctilious"]],
  ["improvement-words", "Change / Increase / Decrease / Improvement", ["improvement"], ["improve", "rectify", "remedy", "panacea", "rejuvenate"]],
  ["reduction-words", "Change / Increase / Decrease / Improvement", ["reduction", "decline"], ["decrease", "lessen", "reduce", "diminish", "abate", "wane"]],
  ["increase-words", "Change / Increase / Decrease / Improvement", ["increase"], ["increase", "grow", "expand", "augment", "rise"]],
  ["nature-words", "Nature / Place / Time / Atmosphere / Physical World", ["nature", "weather", "place", "body", "object"], ["nature", "weather", "body", "place", "light", "shine", "plant"]],
  ["status-words", "Power / Rank / Leadership / Status", ["rank", "status", "fame", "leadership"], ["rank", "status", "fame", "honour", "prestige", "king", "queen"]],
];

const FIELD_WEIGHTS = {
  simplePhrase: 8,
  trickPhrase: 5,
  examplePhrase: 2,
  simpleKeyword: 5,
  trickKeyword: 3,
  wordKeyword: 3,
  visualKeyword: 2,
  exampleKeyword: 1,
};

const PRE_FINAL_BASELINE_REPORT = {
  totalWords: 2513,
  classifiedWords: 2259,
  needsReviewCount: 254,
  subgroupReviewCount: 0,
  subgroupLowConfidenceCount: 683,
  lowConfidenceCount: 428,
  tiedScoreCount: 169,
};

const MIN_CLASSIFICATION_SCORE = 3;

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function fieldsFor(item) {
  return {
    word: normalize(item.word),
    simple: normalize(item.simple),
    trick: normalize(item.trick),
    visual: normalize(item.visual),
    example: normalize(item.example),
  };
}

function keywordMatches(text, keyword) {
  const normalized = normalize(keyword);
  if (!normalized) return false;
  if (normalized.includes(" ")) return text.includes(normalized);
  return new RegExp(`(^|\\s|-)${normalized}(\\s|-|$)`).test(text);
}

function addScore(entry, amount, rule, field) {
  entry.score += amount;
  entry.rules.push(`${rule}:${field}+${amount}`);
  if (field === "simple") entry.simpleScore += amount;
  if (rule === "phrase") entry.phraseScore += amount;
}

function emptyGroupScores() {
  return GROUPS.map((group, index) => ({
    group,
    index,
    score: 0,
    simpleScore: 0,
    phraseScore: 0,
    rules: [],
  }));
}

function scoreGroups(fields) {
  const scores = emptyGroupScores();
  const byGroup = new Map(scores.map(score => [score.group.mainGroup, score]));

  for (const [mainGroup, , phrases] of PHRASE_RULES) {
    const entry = byGroup.get(mainGroup);
    if (!entry) continue;
    for (const phrase of phrases) {
      const normalized = normalize(phrase);
      if (fields.simple.includes(normalized)) addScore(entry, FIELD_WEIGHTS.simplePhrase, `phrase:${phrase}`, "simple");
      if (fields.trick.includes(normalized)) addScore(entry, FIELD_WEIGHTS.trickPhrase, `phrase:${phrase}`, "trick");
      if (fields.example.includes(normalized)) addScore(entry, FIELD_WEIGHTS.examplePhrase, `phrase:${phrase}`, "example");
    }
  }

  for (const [mainGroup, familyName, roots] of ROOT_FAMILY_RULES) {
    const entry = byGroup.get(mainGroup);
    if (!entry) continue;
    for (const root of roots) {
      const normalized = normalize(root);
      if (!normalized) continue;
      if (fields.simple.includes(normalized)) addScore(entry, 4, `root:${familyName}:${root}`, "simple");
      if (fields.trick.includes(normalized)) addScore(entry, 3, `root:${familyName}:${root}`, "trick");
      if (fields.word.includes(normalized)) addScore(entry, 4, `root:${familyName}:${root}`, "word");
      if (fields.visual.includes(normalized)) addScore(entry, 2, `root:${familyName}:${root}`, "visual");
      if (fields.example.includes(normalized)) addScore(entry, 1, `root:${familyName}:${root}`, "example");
    }
  }

  for (const entry of scores) {
    const keywords = [
      ...entry.group.keywords,
      ...(GROUP_KEYWORD_EXPANSIONS[entry.group.mainGroup] || []),
    ];
    for (const keyword of keywords) {
      if (keywordMatches(fields.simple, keyword)) addScore(entry, FIELD_WEIGHTS.simpleKeyword, `keyword:${keyword}`, "simple");
      if (keywordMatches(fields.trick, keyword)) addScore(entry, FIELD_WEIGHTS.trickKeyword, `keyword:${keyword}`, "trick");
      if (keywordMatches(fields.word, keyword)) addScore(entry, FIELD_WEIGHTS.wordKeyword, `keyword:${keyword}`, "word");
      if (keywordMatches(fields.visual, keyword)) addScore(entry, FIELD_WEIGHTS.visualKeyword, `keyword:${keyword}`, "visual");
      if (keywordMatches(fields.example, keyword)) addScore(entry, FIELD_WEIGHTS.exampleKeyword, `keyword:${keyword}`, "example");
    }
  }

  return scores;
}

function scoreSecondPassGroups(fields) {
  const scores = emptyGroupScores();
  const byGroup = new Map(scores.map(score => [score.group.mainGroup, score]));

  for (const [mainGroup, phrases] of SECOND_PASS_PHRASE_RULES) {
    const entry = byGroup.get(mainGroup);
    if (!entry) continue;
    for (const phrase of phrases) {
      const normalized = normalize(phrase);
      if (fields.simple.includes(normalized)) addScore(entry, 4, `second-pass:${phrase}`, "simple");
      if (fields.trick.includes(normalized)) addScore(entry, 3, `second-pass:${phrase}`, "trick");
      if (fields.word.includes(normalized)) addScore(entry, 2, `second-pass:${phrase}`, "word");
    }
  }

  return scores;
}

function candidateGroupsFromScores(scores, limit = 3) {
  return sortGroupScores(scores)
    .filter(score => score.score > 0)
    .slice(0, limit)
    .map(score => ({
      mainGroup: score.group.mainGroup,
      score: score.score,
      simpleScore: score.simpleScore,
      phraseScore: score.phraseScore,
      topRule: score.rules[0] || "",
    }));
}

function sortGroupScores(scores) {
  return [...scores].sort((a, b) =>
    b.score - a.score ||
    b.phraseScore - a.phraseScore ||
    b.simpleScore - a.simpleScore ||
    (GROUP_SPECIFICITY[a.group.mainGroup] ?? 99) - (GROUP_SPECIFICITY[b.group.mainGroup] ?? 99) ||
    a.index - b.index
  );
}

function scoreSubGroups(fields, selectedGroup) {
  return SUBGROUP_RULES
    .filter(([subGroup]) => selectedGroup.subGroups.includes(subGroup))
    .map(([subGroup, keywords], index) => {
      const result = { subGroup, index, score: 0, rules: [] };
      for (const keyword of keywords) {
        if (keywordMatches(fields.simple, keyword)) {
          result.score += FIELD_WEIGHTS.simpleKeyword;
          result.rules.push(`keyword:${keyword}:simple+${FIELD_WEIGHTS.simpleKeyword}`);
        }
        if (keywordMatches(fields.trick, keyword)) {
          result.score += FIELD_WEIGHTS.trickKeyword;
          result.rules.push(`keyword:${keyword}:trick+${FIELD_WEIGHTS.trickKeyword}`);
        }
        if (keywordMatches(fields.word, keyword)) {
          result.score += FIELD_WEIGHTS.wordKeyword;
          result.rules.push(`keyword:${keyword}:word+${FIELD_WEIGHTS.wordKeyword}`);
        }
        if (keywordMatches(fields.visual, keyword)) {
          result.score += FIELD_WEIGHTS.visualKeyword;
          result.rules.push(`keyword:${keyword}:visual+${FIELD_WEIGHTS.visualKeyword}`);
        }
        if (keywordMatches(fields.example, keyword)) {
          result.score += FIELD_WEIGHTS.exampleKeyword;
          result.rules.push(`keyword:${keyword}:example+${FIELD_WEIGHTS.exampleKeyword}`);
        }
      }
      for (const [mainGroup, subGroupFromPhrase, phrases] of PHRASE_RULES) {
        if (mainGroup !== selectedGroup.mainGroup || subGroupFromPhrase !== subGroup) continue;
        for (const phrase of phrases) {
          const normalized = normalize(phrase);
          if (fields.simple.includes(normalized)) {
            result.score += FIELD_WEIGHTS.simplePhrase;
            result.rules.push(`phrase:${phrase}:simple+${FIELD_WEIGHTS.simplePhrase}`);
          }
          if (fields.trick.includes(normalized)) {
            result.score += FIELD_WEIGHTS.trickPhrase;
            result.rules.push(`phrase:${phrase}:trick+${FIELD_WEIGHTS.trickPhrase}`);
          }
          if (fields.example.includes(normalized)) {
            result.score += FIELD_WEIGHTS.examplePhrase;
            result.rules.push(`phrase:${phrase}:example+${FIELD_WEIGHTS.examplePhrase}`);
          }
        }
      }
      return result;
    })
    .sort((a, b) => b.score - a.score || a.index - b.index);
}

function overrideFor(word) {
  const normalized = normalize(word);
  const direct = WORD_OVERRIDES[normalized];
  if (!direct) return null;
  const [mainGroup, subGroup] = direct;
  const group = GROUP_BY_NAME[mainGroup];
  return group ? { mainGroup, subGroup, visualFamily: group.visualFamily } : null;
}

function manualPatchFor(word) {
  const patch = MANUAL_GROUP_PATCH[normalize(word)];
  if (!patch?.mainGroup) return null;
  const group = GROUP_BY_NAME[patch.mainGroup];
  if (!group) return null;
  return {
    mainGroup: patch.mainGroup,
    subGroup: patch.subGroup || NEEDS_SUBGROUP_REVIEW,
    visualFamily: patch.visualFamily || group.visualFamily,
    memoryCluster: patch.memoryCluster,
  };
}

function memoryClusterFor(item) {
  if (item.memoryCluster) return item.memoryCluster;
  const text = [item.word, item.simple, item.trick].map(normalize).join(" ");
  const matched = MEMORY_CLUSTER_RULES.find(([, mainGroup, subGroups, keywords]) =>
    item.mainGroup === mainGroup &&
    (subGroups.includes(item.subGroup) || keywords.some(keyword => keywordMatches(text, keyword)))
  );
  return matched?.[0] || DEFAULT_MEMORY_CLUSTER_BY_SUBGROUP[item.subGroup] || `${item.visualFamily || "general"}-words`;
}

function classifyWord(item) {
  const fields = fieldsFor(item);
  const manualPatch = manualPatchFor(item.word);
  if (manualPatch) {
    return {
      ...manualPatch,
      memoryCluster: memoryClusterFor({ ...item, ...manualPatch }),
      classificationReason: {
        matchedGroupRule: "manual-group-patch",
        matchedSubGroupRule: "manual-group-patch",
        confidenceScore: 120,
        confidenceGap: 120,
        tiedScores: [],
        subgroupNeedsReview: manualPatch.subGroup === NEEDS_SUBGROUP_REVIEW,
        subgroupLowConfidence: false,
      },
    };
  }

  const override = overrideFor(item.word);
  if (override) {
    return {
      ...override,
      memoryCluster: memoryClusterFor({ ...item, ...override }),
      classificationReason: {
        matchedGroupRule: "word-override",
        matchedSubGroupRule: "word-override",
        confidenceScore: 100,
        confidenceGap: 100,
        tiedScores: [],
        subgroupNeedsReview: false,
        subgroupLowConfidence: false,
      },
    };
  }

  const scores = scoreGroups(fields);
  const rawTopScore = Math.max(...scores.map(score => score.score));
  const ranked = sortGroupScores(scores);
  const winner = ranked[0];
  const rawTies = scores.filter(score =>
    rawTopScore > 0 &&
    score.score === rawTopScore &&
    score.phraseScore === winner.phraseScore &&
    score.simpleScore === winner.simpleScore
  );

  if (!winner || winner.score < MIN_CLASSIFICATION_SCORE) {
    const secondPassScores = scoreSecondPassGroups(fields);
    const combinedScores = scores.map((score, index) => ({
      ...score,
      score: score.score + secondPassScores[index].score,
      simpleScore: score.simpleScore + secondPassScores[index].simpleScore,
      phraseScore: score.phraseScore + secondPassScores[index].phraseScore,
      rules: [...score.rules, ...secondPassScores[index].rules],
    }));
    const secondPassRanked = sortGroupScores(combinedScores);
    const secondPassWinner = secondPassRanked[0];
    const secondPassGap = secondPassWinner.score - (secondPassRanked[1]?.score || 0);
    const canUseSecondPass = secondPassWinner.score >= 4 && secondPassGap >= 1;

    if (canUseSecondPass) {
      const subgroupScores = scoreSubGroups(fields, secondPassWinner.group);
      const subgroupWinner = subgroupScores[0];
      const subgroupLowConfidence = !subgroupWinner || subgroupWinner.score <= 0;
      const safeDefaultSubGroup = DEFAULT_SUBGROUP_BY_GROUP[secondPassWinner.group.mainGroup];
      const subgroupNeedsReview = subgroupLowConfidence && !safeDefaultSubGroup;
      const selectedSubGroup = subgroupNeedsReview
        ? NEEDS_SUBGROUP_REVIEW
        : subgroupLowConfidence
          ? safeDefaultSubGroup
          : subgroupWinner.subGroup;
      const classification = {
        mainGroup: secondPassWinner.group.mainGroup,
        subGroup: selectedSubGroup,
        visualFamily: secondPassWinner.group.visualFamily,
      };

      return {
        ...classification,
        memoryCluster: memoryClusterFor({ ...item, ...classification }),
        classificationReason: {
          matchedGroupRule: secondPassWinner.rules[0] || "second-pass",
          matchedSubGroupRule: subgroupNeedsReview
            ? "needs-subgroup-review:no-safe-default"
            : subgroupLowConfidence
              ? `safe-default-subgroup:${safeDefaultSubGroup}`
              : subgroupWinner.rules[0],
          confidenceScore: secondPassWinner.score,
          confidenceGap: secondPassGap,
          simpleDefinitionScore: secondPassWinner.simpleScore,
          phraseScore: secondPassWinner.phraseScore,
          tiedScores: [],
          candidateGroups: candidateGroupsFromScores(combinedScores),
          subgroupNeedsReview,
          subgroupLowConfidence,
        },
      };
    }

    return {
      ...REVIEW_CLASSIFICATION,
      classificationReason: {
        matchedGroupRule: "needs-review:no-positive-match",
        matchedSubGroupRule: "needs-review",
        confidenceScore: winner?.score || 0,
        confidenceGap: 0,
        tiedScores: rawTies.length > 1 ? rawTies.map(score => score.group.mainGroup) : [],
        candidateGroups: candidateGroupsFromScores(combinedScores),
        subgroupNeedsReview: false,
        subgroupLowConfidence: false,
      },
    };
  }

  const subgroupScores = scoreSubGroups(fields, winner.group);
  const subgroupWinner = subgroupScores[0];
  const subgroupLowConfidence = !subgroupWinner || subgroupWinner.score <= 0;
  const safeDefaultSubGroup = DEFAULT_SUBGROUP_BY_GROUP[winner.group.mainGroup];
  const subgroupNeedsReview = subgroupLowConfidence && !safeDefaultSubGroup;
  const selectedSubGroup = subgroupNeedsReview
    ? NEEDS_SUBGROUP_REVIEW
    : subgroupLowConfidence
      ? safeDefaultSubGroup
      : subgroupWinner.subGroup;
  const confidenceGap = winner.score - (ranked[1]?.score || 0);
  const classification = {
    mainGroup: winner.group.mainGroup,
    subGroup: selectedSubGroup,
    visualFamily: winner.group.visualFamily,
  };

  return {
    ...classification,
    memoryCluster: memoryClusterFor({ ...item, ...classification }),
    classificationReason: {
      matchedGroupRule: winner.rules[0] || "weighted-keyword",
      matchedSubGroupRule: subgroupNeedsReview
        ? "needs-subgroup-review:no-safe-default"
        : subgroupLowConfidence
          ? `safe-default-subgroup:${safeDefaultSubGroup}`
          : subgroupWinner.rules[0],
      confidenceScore: winner.score,
      confidenceGap,
      simpleDefinitionScore: winner.simpleScore,
      phraseScore: winner.phraseScore,
      tiedScores: rawTies.length > 1 ? rawTies.map(score => score.group.mainGroup) : [],
      candidateGroups: candidateGroupsFromScores(scores),
      subgroupNeedsReview,
      subgroupLowConfidence,
    },
  };
}

export function enrichVocabulary(source) {
  return source.map(item => ({
    ...item,
    ...classifyWord(item),
  }));
}

export function buildGroupingSummary(originalWords, enrichedWords) {
  const countBy = (key) => enrichedWords.reduce((counts, item) => {
    counts[item[key]] = (counts[item[key]] || 0) + 1;
    return counts;
  }, {});

  return {
    totalOriginalWords: originalWords.length,
    totalEnrichedWords: enrichedWords.length,
    groupedCounts: countBy("mainGroup"),
    subgroupCounts: countBy("subGroup"),
    memoryClusterCounts: countBy("memoryCluster"),
    ungroupedWords: enrichedWords.filter(item => !item.mainGroup || !item.subGroup || !item.visualFamily).map(item => item.word),
  };
}

function topWordsBy(enrichedWords, key, limit = 12) {
  return enrichedWords.reduce((groups, item) => {
    const value = item[key] || "none";
    groups[value] ||= [];
    if (groups[value].length < limit) {
      groups[value].push({
        word: item.word,
        confidenceScore: item.classificationReason?.confidenceScore || 0,
        rule: item.classificationReason?.matchedGroupRule,
      });
    }
    return groups;
  }, {});
}

export function buildClassificationValidationReport(enrichedWords) {
  const needsReview = enrichedWords.filter(item => item.mainGroup === REVIEW_CLASSIFICATION.mainGroup);
  const tied = enrichedWords.filter(item => item.classificationReason?.tiedScores?.length > 1);
  const subgroupReview = enrichedWords.filter(item => item.subGroup === NEEDS_SUBGROUP_REVIEW || item.classificationReason?.subgroupNeedsReview);
  const subgroupLowConfidence = enrichedWords.filter(item =>
    item.mainGroup !== REVIEW_CLASSIFICATION.mainGroup &&
    item.subGroup !== NEEDS_SUBGROUP_REVIEW &&
    item.classificationReason?.subgroupLowConfidence
  );
  const lowConfidence = enrichedWords.filter(item =>
    item.mainGroup !== REVIEW_CLASSIFICATION.mainGroup &&
    (item.classificationReason?.confidenceGap ?? 99) <= 2 &&
    (item.classificationReason?.confidenceScore ?? 0) < 8
  );
  const uncertain = enrichedWords
    .filter(item => item.mainGroup !== REVIEW_CLASSIFICATION.mainGroup)
    .map(item => ({
      word: item.word,
      mainGroup: item.mainGroup,
      subGroup: item.subGroup,
      confidenceScore: item.classificationReason?.confidenceScore || 0,
      confidenceGap: item.classificationReason?.confidenceGap || 0,
      matchedGroupRule: item.classificationReason?.matchedGroupRule,
    }))
    .sort((a, b) => a.confidenceScore - b.confidenceScore || a.confidenceGap - b.confidenceGap || a.word.localeCompare(b.word))
    .slice(0, 50);
  const currentCoreReport = {
    totalWords: enrichedWords.length,
    classifiedWords: enrichedWords.length - needsReview.length,
    needsReviewCount: needsReview.length,
    subgroupReviewCount: subgroupReview.length,
    subgroupLowConfidenceCount: subgroupLowConfidence.length,
    lowConfidenceCount: lowConfidence.length,
    tiedScoreCount: tied.length,
  };

  return {
    ...currentCoreReport,
    needsReviewWords: needsReview.map(item => item.word),
    subgroupReviewWords: subgroupReview.map(item => item.word),
    subgroupLowConfidenceWords: subgroupLowConfidence.map(item => ({
      word: item.word,
      mainGroup: item.mainGroup,
      subGroup: item.subGroup,
      confidenceScore: item.classificationReason?.confidenceScore || 0,
      matchedSubGroupRule: item.classificationReason?.matchedSubGroupRule,
    })),
    lowConfidenceWords: lowConfidence.map(item => ({
      word: item.word,
      mainGroup: item.mainGroup,
      subGroup: item.subGroup,
      confidenceScore: item.classificationReason?.confidenceScore || 0,
      confidenceGap: item.classificationReason?.confidenceGap || 0,
    })),
    tiedScoreWords: tied.map(item => ({
      word: item.word,
      tiedScores: item.classificationReason.tiedScores,
      selected: item.mainGroup,
    })),
    needsReviewWordsDetailed: needsReview.map(item => ({
      word: item.word,
      simple: item.simple,
      trick: item.trick,
      top3CandidateGroups: item.classificationReason?.candidateGroups || [],
      whyFailed: item.classificationReason?.matchedGroupRule || "not enough semantic evidence",
    })),
    top50UncertainWords: uncertain,
    topWordsByGroup: topWordsBy(enrichedWords, "mainGroup"),
    topWordsBySubgroup: topWordsBy(enrichedWords, "subGroup"),
    topWordsByMemoryCluster: topWordsBy(enrichedWords, "memoryCluster"),
    wrongOverrideFixesApplied: WRONG_OVERRIDE_FIX_WORDS
      .filter(word => MANUAL_GROUP_PATCH[word])
      .map(word => ({
        word,
        mainGroup: MANUAL_GROUP_PATCH[word].mainGroup,
        subGroup: MANUAL_GROUP_PATCH[word].subGroup,
      })),
    manualPatchCount: Object.keys(MANUAL_GROUP_PATCH).length,
    beforeAfterComparison: {
      before: PRE_FINAL_BASELINE_REPORT,
      after: currentCoreReport,
      delta: Object.fromEntries(Object.entries(currentCoreReport).map(([key, value]) => [
        key,
        value - (PRE_FINAL_BASELINE_REPORT[key] ?? 0),
      ])),
    },
    wordsWithTiedScores: tied.map(item => ({
      word: item.word,
      tiedScores: item.classificationReason.tiedScores,
      selected: item.mainGroup,
    })),
    wordsWhereSubgroupDefaultedWithoutPositiveMatch: subgroupReview.map(item => ({
      word: item.word,
      mainGroup: item.mainGroup,
      defaultSubGroup: item.subGroup,
      confidenceScore: item.classificationReason?.confidenceScore || 0,
    })),
  };
}

export const enrichedVocab = enrichVocabulary(vocab);
export const groupingSummary = buildGroupingSummary(vocab, enrichedVocab);
export const classificationValidationReport = buildClassificationValidationReport(enrichedVocab);
export const needsReviewWords = classificationValidationReport.needsReviewWords;
export const subgroupReviewWords = classificationValidationReport.subgroupReviewWords;
export const subgroupLowConfidenceWords = classificationValidationReport.subgroupLowConfidenceWords;
export const lowConfidenceWords = classificationValidationReport.lowConfidenceWords;
export const tiedScoreWords = classificationValidationReport.tiedScoreWords;
export const needsReviewWordsDetailed = classificationValidationReport.needsReviewWordsDetailed;
export const top50UncertainWords = classificationValidationReport.top50UncertainWords;
export const topWordsByMemoryCluster = classificationValidationReport.topWordsByMemoryCluster;
