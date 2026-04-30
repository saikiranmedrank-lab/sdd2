import React, { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { forceCollide } from "d3-force-3d";
import ForceGraph2D from "react-force-graph-2d";

import vocab from "./vocabData";
import { GROUPS, buildGroupingSummary, enrichedVocab, enrichVocabulary } from "./vocabGroups";
import "./App.css";

const pdfRecheckPatch = [];
const GRAPH_NODE_POSITIONS_KEY = "sscGraphNodePositions";

const GROUP_LABELS = {
  brain: "Brain",
  emotion: "Emotion",
  speech: "Speech",
  movement: "Movement",
  law: "Law",
  battle: "Conflict",
  social: "Social",
  crown: "Power",
  money: "Money",
  skill: "Skill",
  change: "Change",
  nature: "Nature",
};

function loadArray(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function loadGraphNodePositions() {
  try {
    const saved = JSON.parse(localStorage.getItem(GRAPH_NODE_POSITIONS_KEY) || "{}");
    return Object.fromEntries(
      Object.entries(saved).filter(([, position]) => (
        isFiniteNumber(position?.x) &&
        isFiniteNumber(position?.y)
      ))
    );
  } catch {
    return {};
  }
}

function saveGraphNodePositions(positions) {
  localStorage.setItem(GRAPH_NODE_POSITIONS_KEY, JSON.stringify(positions));
}

function storedGraphPosition(positions, nodeId) {
  const position = positions?.[nodeId];
  return isFiniteNumber(position?.x) && isFiniteNumber(position?.y) ? position : null;
}

function applyStoredGraphPositions(nodes, positions) {
  if (!positions) return;
  nodes.forEach(node => {
    const position = storedGraphPosition(positions, node.id);
    if (!position) return;
    node.x = position.x;
    node.y = position.y;
    node.fx = position.x;
    node.fy = position.y;
    node.isUserPlaced = true;
  });
}

function graphWithStoredPositions(graphData, positions) {
  const nodes = graphData.nodes.map(node => ({ ...node }));
  const links = graphData.links.map(link => ({ ...link }));
  applyStoredGraphPositions(nodes, positions);
  return { nodes, links };
}

function getOptions(correct, source = enrichedVocab) {
  const wrong = source
    .filter(v => v.word !== correct.word)
    .map(v => ({ v, r: Math.random() }))
    .sort((a, b) => a.r - b.r)
    .slice(0, 3)
    .map(x => x.v);
  return [...wrong, correct]
    .map(v => ({ v, r: Math.random() }))
    .sort((a, b) => a.r - b.r)
    .map(x => x.v);
}

function scoreVoice(voice, type) {
  const name = voice.name.toLowerCase();
  const lang = voice.lang.toLowerCase();
  let score = 0;

  if (type === "word") {
    if (lang === "en-in") score += 60;
    if (lang.startsWith("en")) score += 25;
    if (name.includes("ravi") || name.includes("kunal") || name.includes("hemant")) score += 35;
    if (name.includes("male") || name.includes("man") || name.includes("guy")) score += 45;
    if (name.includes("india") || name.includes("indian")) score += 20;
    if (name.includes("female") || name.includes("woman") || name.includes("girl")) score -= 90;
    return score;
  }

  if (lang === "te-in" || lang.startsWith("te")) score += 70;
  if (lang.endsWith("-in")) score += 25;
  if (name.includes("telugu")) score += 30;
  if (name.includes("female")) score += 20;
  if (name.includes("heera") || name.includes("kalpana") || name.includes("lekha") || name.includes("shruti")) score += 18;
  if (name.includes("male") || name.includes("ravi") || name.includes("kunal") || name.includes("hemant")) score -= 15;
  return score;
}

function soundsFemaleVoice(voice) {
  const name = voice.name.toLowerCase();
  return name.includes("female") || name.includes("woman") || name.includes("girl") || name.includes("zira") || name.includes("samantha");
}

function formatDuration(totalSeconds) {
  const seconds = Math.max(Math.round(totalSeconds), 0);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours) return `${hours}h ${minutes}m`;
  if (minutes) return `${minutes}m ${remainingSeconds}s`;
  return `${remainingSeconds}s`;
}

const SIMPLE_HIGHLIGHT_SKIP_WORDS = new Set([
  "about", "above", "across", "after", "again", "against", "also", "among", "another", "being", "between",
  "causing", "connected", "considered", "does", "doing", "done", "especially", "feeling", "from", "given",
  "having", "into", "itself", "kind", "least", "made", "make", "making", "many", "more", "most", "much",
  "often", "only", "others", "over", "part", "people", "person", "persons", "process", "quality", "regarded",
  "related", "relating", "section", "showing", "somebody", "someone", "something", "state", "than", "that",
  "their", "them", "then", "there", "these", "thing", "things", "this", "those", "through", "under", "used",
  "usually", "very", "when", "where", "which", "while", "with", "without", "your",
]);

function normalizeHighlightToken(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function simpleHighlightTerms(text, word) {
  const wordTokens = new Set(String(word || "").match(/[a-zA-Z0-9'-]+/g)?.map(normalizeHighlightToken) || []);
  const tokens = String(text || "").match(/[a-zA-Z][a-zA-Z'-]*/g) || [];
  return new Set(
    tokens
      .map(normalizeHighlightToken)
      .filter(token =>
        token.length >= 4 &&
        !wordTokens.has(token) &&
        !SIMPLE_HIGHLIGHT_SKIP_WORDS.has(token)
      )
  );
}

function HighlightedSimple({ text, word }) {
  const terms = simpleHighlightTerms(text, word);
  if (!terms.size) return text;

  return String(text || "").split(/([a-zA-Z][a-zA-Z'-]*)/g).map((part, index) => {
    const token = normalizeHighlightToken(part);
    if (!terms.has(token)) return part;
    return <mark className="simple-synonym-highlight" key={`${part}-${index}`}>{part}</mark>;
  });
}

const GRAPH_RELATION_META = {
  subGroup: { label: "Subgroup", strength: 6, maxPerCluster: 360, neighborCount: 1 },
  memoryCluster: { label: "Memory", strength: 5, maxPerCluster: 260, neighborCount: 0 },
  mainGroup: { label: "Main group", strength: 3, maxPerCluster: 120, neighborCount: 0 },
  visualFamily: { label: "Visual", strength: 2, maxPerCluster: 140, neighborCount: 0 },
  chapter: { label: "Chapter", strength: 1, maxPerCluster: 160, neighborCount: 0 },
  synonymFamily: { label: "Synonym", strength: 7, maxPerCluster: 160, neighborCount: 0 },
  similarMeaning: { label: "Meaning", strength: 4, maxPerCluster: 180, neighborCount: 0 },
};

const DEFAULT_GRAPH_RELATIONS = {
  mainGroup: false,
  subGroup: false,
  memoryCluster: false,
  visualFamily: false,
  chapter: false,
  synonymFamily: true,
  similarMeaning: false,
};

const GROUP_COLORS = {
  "Brain / Intelligence / Judgement": "#38bdf8",
  "Emotion / Feelings / Mind State": "#fb7185",
  "Speech / Communication / Expression": "#f59e0b",
  "Movement / Action / Speed / Travel": "#22c55e",
  "Crime / Law / Court / Blame": "#a855f7",
  "Attack / Destruction / Conflict": "#ef4444",
  "Social / Relationship / Behaviour": "#14b8a6",
  "Power / Rank / Leadership / Status": "#eab308",
  "Money / Quantity / Growth / Wealth": "#84cc16",
  "Work / Skill / Effort / Ability": "#6366f1",
  "Change / Increase / Decrease / Improvement": "#f97316",
  "Nature / Place / Time / Atmosphere / Physical World": "#06b6d4",
};

function relationKey(source, target) {
  return source < target ? `${source}::${target}` : `${target}::${source}`;
}

function addGraphLink(linkMap, source, target, relationType, strength) {
  if (!source || !target || source === target) return;
  const key = relationKey(source, target);
  const current = linkMap.get(key);
  if (!current || strength > current.strength) {
    linkMap.set(key, { source, target, relationType, strength });
  }
}

function groupByField(words, field) {
  return words.reduce((groups, item) => {
    const value = item[field] || "none";
    groups[value] ||= [];
    groups[value].push(item);
    return groups;
  }, {});
}

function addClusterLinks(linkMap, groupedWords, relationType) {
  const meta = GRAPH_RELATION_META[relationType];
  Object.values(groupedWords).forEach(cluster => {
    if (cluster.length < 2) return;
    const sorted = [...cluster].sort((a, b) => (a.bookNo || 99999) - (b.bookNo || 99999) || a.word.localeCompare(b.word));
    const hub = sorted[0];
    let added = 0;

    for (let index = 1; index < sorted.length && added < meta.maxPerCluster; index += 1) {
      addGraphLink(linkMap, hub.word, sorted[index].word, relationType, meta.strength);
      added += 1;
    }

    for (let index = 0; index < sorted.length && added < meta.maxPerCluster; index += 1) {
      for (let offset = 1; offset <= meta.neighborCount && added < meta.maxPerCluster; offset += 1) {
        const next = sorted[index + offset];
        if (!next) break;
        addGraphLink(linkMap, sorted[index].word, next.word, relationType, meta.strength);
        added += 1;
      }
    }
  });
}

function buildMeaningLinks(linkMap, words, relationType) {
  const meta = GRAPH_RELATION_META[relationType];
  const byWord = new Map(words.map(item => [normalizeHighlightToken(item.word), item]));
  const byTerm = new Map();

  words.forEach(item => {
    const terms = [...simpleHighlightTerms(item.simple, item.word)].filter(term => term.length >= 5).slice(0, 8);

    if (relationType === "synonymFamily") {
      terms.forEach(term => {
        const match = byWord.get(term);
        if (match) addGraphLink(linkMap, item.word, match.word, relationType, meta.strength);
      });
      return;
    }

    terms.forEach(term => {
      if (!byTerm.has(term)) byTerm.set(term, []);
      const bucket = byTerm.get(term);
      if (bucket.length < 18) bucket.push(item);
    });
  });

  if (relationType !== "similarMeaning") return;

  byTerm.forEach(bucket => {
    for (let index = 0; index < bucket.length - 1; index += 1) {
      addGraphLink(linkMap, bucket[index].word, bucket[index + 1].word, relationType, meta.strength);
    }
  });
}

function simpleSynonymTerms(item, limit = 10) {
  return [...simpleHighlightTerms(item?.simple, item?.word)]
    .filter(term => term.length >= 4)
    .slice(0, limit);
}

function displayTerm(term) {
  return term
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, letter => letter.toUpperCase());
}

function mergeSynonymGraph(target, source) {
  if (!source) return target;
  const nodeIds = new Set(target.nodes.map(node => node.id));
  const linkIds = new Set(target.links.map(link => relationKey(linkId(link.source), linkId(link.target))));

  source.nodes.forEach(node => {
    if (!nodeIds.has(node.id)) {
      target.nodes.push(node);
      nodeIds.add(node.id);
    } else {
      const existing = target.nodes.find(item => item.id === node.id);
      Object.assign(existing, node);
    }
  });

  source.links.forEach(link => {
    const key = relationKey(linkId(link.source), linkId(link.target));
    if (!linkIds.has(key)) {
      target.links.push(link);
      linkIds.add(key);
    }
  });

  return target;
}

function layoutActiveBranch(nodes, links, selectedWord, storedPositions) {
  if (!selectedWord) return;
  const nodeById = new Map(nodes.map(node => [node.id, node]));
  const selectedNode = nodeById.get(selectedWord);
  if (!selectedNode) return;

  const childIds = [];
  links.forEach(link => {
    if (!link.isExpandedGraphLink) return;
    const source = linkId(link.source);
    const target = linkId(link.target);
    if (source === selectedWord) {
      childIds.push(target);
      link.isCurrentBranchLink = true;
    }
    if (target === selectedWord) {
      childIds.push(source);
      link.isCurrentBranchLink = true;
    }
  });

  const selectedPosition = storedGraphPosition(storedPositions, selectedWord);
  selectedNode.x = selectedPosition?.x ?? 0;
  selectedNode.y = selectedPosition?.y ?? 0;
  selectedNode.fx = selectedNode.x;
  selectedNode.fy = selectedNode.y;
  selectedNode.isCurrentBranchNode = true;

  const uniqueChildIds = [...new Set(childIds)].filter(id => id !== selectedWord);
  const radius = Math.max(220, Math.min(360, 180 + uniqueChildIds.length * 18));
  const startAngle = -Math.PI / 2;
  const angleStep = uniqueChildIds.length > 1 ? (Math.PI * 2) / uniqueChildIds.length : 0;

  uniqueChildIds.forEach((id, index) => {
    const child = nodeById.get(id);
    if (!child) return;
    const storedPosition = storedGraphPosition(storedPositions, id);
    if (storedPosition) {
      child.x = storedPosition.x;
      child.y = storedPosition.y;
      child.fx = storedPosition.x;
      child.fy = storedPosition.y;
      child.isUserPlaced = true;
      child.isCurrentBranchNode = true;
      return;
    }
    const angle = startAngle + index * angleStep;
    const labelOffset = Math.min(80, String(child.word || "").length * 4);
    child.x = Math.cos(angle) * (radius + labelOffset);
    child.y = Math.sin(angle) * radius;
    child.fx = child.x;
    child.fy = child.y;
    child.isCurrentBranchNode = true;
  });
}

function buildExpandedGraph(rawGraphData, synonymGraph, selectedWord, storedPositions) {
  if (!synonymGraph?.nodes.length) return rawGraphData;

  const expandedNodeIds = new Set(synonymGraph.nodes.map(node => node.id));
  const expandedLinkIds = new Set(synonymGraph.links.map(link => relationKey(linkId(link.source), linkId(link.target))));
  const synonymNodeById = new Map(synonymGraph.nodes.map(node => [node.id, node]));
  const synonymLinkById = new Map(synonymGraph.links.map(link => [relationKey(linkId(link.source), linkId(link.target)), link]));

  const nodes = rawGraphData.nodes.map(node => ({
    ...node,
    ...synonymNodeById.get(node.id),
    isExpandedGraphNode: expandedNodeIds.has(node.id),
    isGraphInactive: !expandedNodeIds.has(node.id),
    isCurrentBranchNode: false,
  }));

  synonymGraph.nodes.forEach(node => {
    if (!rawGraphData.nodes.some(item => item.id === node.id)) {
      nodes.push({
        ...node,
        isExpandedGraphNode: true,
        isGraphInactive: false,
        isCurrentBranchNode: false,
      });
    }
  });

  const links = rawGraphData.links.map(link => {
    const key = relationKey(linkId(link.source), linkId(link.target));
    return {
      ...link,
      ...synonymLinkById.get(key),
      isExpandedGraphLink: expandedLinkIds.has(key),
      isGraphInactive: !expandedLinkIds.has(key),
      isCurrentBranchLink: false,
    };
  });

  synonymGraph.links.forEach(link => {
    const key = relationKey(linkId(link.source), linkId(link.target));
    if (!links.some(item => relationKey(linkId(item.source), linkId(item.target)) === key)) {
      links.push({
        ...link,
        isExpandedGraphLink: true,
        isGraphInactive: false,
        isCurrentBranchLink: false,
      });
    }
  });

  applyStoredGraphPositions(nodes, storedPositions);
  layoutActiveBranch(nodes, links, selectedWord, storedPositions);

  return { nodes, links };
}

function buildSingleSynonymGraph(selectedWord, selectedDetail, allWords) {
  if (!selectedWord || !selectedDetail) return null;
  const byToken = new Map(allWords.map(item => [normalizeHighlightToken(item.word), item]));
  const centerNode = {
    id: selectedDetail.word,
    word: selectedDetail.word,
    bookNo: selectedDetail.bookNo,
    chapter: selectedDetail.chapter,
    mainGroup: selectedDetail.mainGroup,
    subGroup: selectedDetail.subGroup,
    visualFamily: selectedDetail.visualFamily,
    memoryCluster: selectedDetail.memoryCluster,
    simple: selectedDetail.simple,
    trick: selectedDetail.trick,
    visual: selectedDetail.visual,
    isFocusWord: true,
  };
  const nodes = [centerNode];
  const links = [];

  simpleSynonymTerms(selectedDetail, 12).forEach(term => {
    const vocabMatch = byToken.get(term);
    const targetNode = vocabMatch
      ? {
          id: vocabMatch.word,
          word: vocabMatch.word,
          bookNo: vocabMatch.bookNo,
          chapter: vocabMatch.chapter,
          mainGroup: vocabMatch.mainGroup,
          subGroup: vocabMatch.subGroup,
          visualFamily: vocabMatch.visualFamily,
          memoryCluster: vocabMatch.memoryCluster,
          simple: vocabMatch.simple,
          trick: vocabMatch.trick,
          visual: vocabMatch.visual,
          isSynonymMatch: true,
        }
      : {
          id: `syn:${selectedDetail.word}:${term}`,
          word: displayTerm(term),
          simple: `Synonym/meaning clue for ${selectedDetail.word}`,
          mainGroup: selectedDetail.mainGroup,
          subGroup: "synonym",
          visualFamily: selectedDetail.visualFamily,
          memoryCluster: "direct-synonyms",
          isSynonymTerm: true,
        };

    nodes.push(targetNode);
    links.push({
      source: selectedDetail.word,
      target: targetNode.id,
      relationType: vocabMatch ? "synonymFamily" : "directSynonym",
      strength: vocabMatch ? 8 : 7,
    });
  });

  return { nodes, links };
}

function buildSelectedSynonymGraph(selectedWord, selectedDetail, allWords, expandedWords = []) {
  const byWord = new Map(allWords.map(item => [item.word, item]));
  const graph = { nodes: [], links: [] };
  const wordsToExpand = [...new Set([selectedWord, ...expandedWords].filter(Boolean))];

  wordsToExpand.forEach(word => {
    const detail = byWord.get(word) || (word === selectedWord ? selectedDetail : null);
    mergeSynonymGraph(graph, buildSingleSynonymGraph(word, detail, allWords));
  });

  return graph.nodes.length ? graph : null;
}

function buildVocabGraph(words, relationToggles, hideWeakLinks) {
  const nodes = words.map(item => ({
    id: item.word,
    word: item.word,
    bookNo: item.bookNo,
    chapter: item.chapter,
    mainGroup: item.mainGroup,
    subGroup: item.subGroup,
    visualFamily: item.visualFamily,
    memoryCluster: item.memoryCluster,
    simple: item.simple,
    trick: item.trick,
    visual: item.visual,
  }));
  const linkMap = new Map();
  const activeRelations = Object.entries(relationToggles).filter(([, enabled]) => enabled).map(([relation]) => relation);

  if (activeRelations.includes("subGroup")) addClusterLinks(linkMap, groupByField(words, "subGroup"), "subGroup");
  if (activeRelations.includes("memoryCluster")) addClusterLinks(linkMap, groupByField(words, "memoryCluster"), "memoryCluster");
  if (activeRelations.includes("mainGroup")) addClusterLinks(linkMap, groupByField(words, "mainGroup"), "mainGroup");
  if (activeRelations.includes("visualFamily")) addClusterLinks(linkMap, groupByField(words, "visualFamily"), "visualFamily");
  if (activeRelations.includes("chapter")) addClusterLinks(linkMap, groupByField(words, "chapter"), "chapter");
  if (activeRelations.includes("synonymFamily")) buildMeaningLinks(linkMap, words, "synonymFamily");
  if (activeRelations.includes("similarMeaning")) buildMeaningLinks(linkMap, words, "similarMeaning");

  const links = [...linkMap.values()]
    .filter(link => !hideWeakLinks || link.strength >= 4)
    .sort((a, b) => b.strength - a.strength)
    .slice(0, 1600);

  return { nodes, links };
}

function linkId(value) {
  return typeof value === "object" ? value.id : value;
}

function findGraphPath(graphData, startWord, endWord) {
  if (!startWord || !endWord || startWord === endWord) return startWord ? [startWord] : [];
  const adjacency = new Map(graphData.nodes.map(node => [node.id, []]));
  graphData.links.forEach(link => {
    const source = linkId(link.source);
    const target = linkId(link.target);
    adjacency.get(source)?.push(target);
    adjacency.get(target)?.push(source);
  });

  const queue = [startWord];
  const previous = new Map([[startWord, null]]);
  while (queue.length) {
    const current = queue.shift();
    if (current === endWord) break;
    for (const next of adjacency.get(current) || []) {
      if (previous.has(next)) continue;
      previous.set(next, current);
      queue.push(next);
    }
  }

  if (!previous.has(endWord)) return [];
  const path = [];
  for (let node = endWord; node; node = previous.get(node)) path.unshift(node);
  return path;
}

export default function App() {
  const allWords = useMemo(() => {
    const seen = new Map();
    [...enrichedVocab, ...enrichVocabulary(pdfRecheckPatch)].forEach(item => {
      const key = item.bookNo ? String(item.bookNo) : item.word.toLowerCase();
      if (!seen.has(key)) seen.set(key, item);
    });
    return Array.from(seen.values()).sort((a, b) => (a.bookNo || 99999) - (b.bookNo || 99999));
  }, []);
  const today = new Date().toDateString();
  const [mode, setMode] = useState("learn");
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [studyFilter, setStudyFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [chapter, setChapter] = useState("All");
  const [mainGroup, setMainGroup] = useState("All");
  const [subGroup, setSubGroup] = useState("All");
  const [viewMode, setViewMode] = useState("graph");
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);
  const [isFilterPending, startFilterTransition] = useTransition();
  const [index, setIndex] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [quizSettingsOpen, setQuizSettingsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [quiz, setQuiz] = useState(enrichedVocab[0]);
  const [options, setOptions] = useState(getOptions(enrichedVocab[0], enrichedVocab));
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [restoreWord, setRestoreWord] = useState(null);
  const [learned, setLearned] = useState(() => loadArray("sscLearnedWords"));
  const [weakWords, setWeakWords] = useState(() => loadArray("sscWeakWords"));
  const [streak, setStreak] = useState(() => Number(localStorage.getItem("sscStreak") || "0"));
  const [lastStudy, setLastStudy] = useState(() => localStorage.getItem("sscLastStudy") || "");
  const [autoSpeak, setAutoSpeak] = useState(() => localStorage.getItem("sscAutoSpeak") === "true");
  const [voices, setVoices] = useState([]);
  const [wordVoice, setWordVoice] = useState(() => localStorage.getItem("sscWordVoice") || "");
  const [teluguVoice, setTeluguVoice] = useState(() => localStorage.getItem("sscTeluguVoice") || "");
  const [autoNext, setAutoNext] = useState(false);
  const [secondsPerWord, setSecondsPerWord] = useState(() => Number(localStorage.getItem("sscSecondsPerWord") || "10"));
  const activeQueueRef = useRef(null);
  const speechQueueRef = useRef([]);
  const preSearchWordRef = useRef(null);
  const swipeStartRef = useRef(null);
  const swipeAnimatingRef = useRef(false);
  const swipeTimersRef = useRef([]);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [swipePhase, setSwipePhase] = useState("idle");
  const [swipeDirection, setSwipeDirection] = useState(0);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const graphRef = useRef(null);
  const graphWrapRef = useRef(null);
  const [graphSize, setGraphSize] = useState({ width: 900, height: 620 });
  const [graphRelations, setGraphRelations] = useState(DEFAULT_GRAPH_RELATIONS);
  const [graphMemoryCluster, setGraphMemoryCluster] = useState("All");
  const [graphSelectedWord, setGraphSelectedWord] = useState("");
  const [graphSearch, setGraphSearch] = useState("");
  const [graphNeighborsOnly, setGraphNeighborsOnly] = useState(false);
  const [graphHideWeakLinks, setGraphHideWeakLinks] = useState(false);
  const [graphPathStart, setGraphPathStart] = useState("");
  const [graphPathEnd, setGraphPathEnd] = useState("");
  const [graphPath, setGraphPath] = useState([]);
  const [expandedGraphWords, setExpandedGraphWords] = useState([]);
  const graphNodePositionsRef = useRef(loadGraphNodePositions());
  const graphDragRef = useRef(null);
  const [graphPositionVersion, setGraphPositionVersion] = useState(0);

  useEffect(() => {
    document.documentElement.classList.toggle("dark-theme", theme === "dark");
    document.documentElement.classList.toggle("light-theme", theme === "light");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === "dark" ? "light" : "dark"));

  const chapters = useMemo(() => ["All", ...new Set(allWords.map(v => v.chapter))], [allWords]);
  const memoryClusters = useMemo(() => ["All", ...new Set(allWords.map(v => v.memoryCluster).filter(Boolean))], [allWords]);
  const subGroups = useMemo(() => {
    const source = mainGroup === "All" ? allWords : allWords.filter(v => v.mainGroup === mainGroup);
    return ["All", ...new Set(source.map(v => v.subGroup))];
  }, [allWords, mainGroup]);
  const groupingCheck = useMemo(() => buildGroupingSummary(vocab, allWords), [allWords]);

  useEffect(() => localStorage.setItem("sscLearnedWords", JSON.stringify(learned)), [learned]);
  useEffect(() => localStorage.setItem("sscWeakWords", JSON.stringify(weakWords)), [weakWords]);
  useEffect(() => localStorage.setItem("sscAutoSpeak", String(autoSpeak)), [autoSpeak]);
  useEffect(() => localStorage.setItem("sscWordVoice", wordVoice), [wordVoice]);
  useEffect(() => localStorage.setItem("sscTeluguVoice", teluguVoice), [teluguVoice]);
  useEffect(() => localStorage.setItem("sscSecondsPerWord", String(secondsPerWord)), [secondsPerWord]);
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, []);

  useEffect(() => {
    const element = graphWrapRef.current;
    if (!element || typeof ResizeObserver === "undefined") return undefined;
    const resize = () => {
      const rect = element.getBoundingClientRect();
      setGraphSize({
        width: Math.max(320, Math.floor(rect.width)),
        height: Math.max(420, Math.min(620, Math.floor(rect.height))),
      });
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    return () => observer.disconnect();
  }, [viewMode]);

  const markStudiedToday = () => {
    if (lastStudy === today) return;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const newStreak = lastStudy === yesterday ? streak + 1 : 1;
    setStreak(newStreak);
    setLastStudy(today);
    localStorage.setItem("sscStreak", String(newStreak));
    localStorage.setItem("sscLastStudy", today);
  };

  const studySource = useMemo(() => {
    if (studyFilter === "learned") return allWords.filter(v => learned.includes(v.word));
    if (studyFilter === "weak") return allWords.filter(v => weakWords.includes(v.word));
    return allWords;
  }, [allWords, learned, studyFilter, weakWords]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return studySource.filter(v =>
      (chapter === "All" || v.chapter === chapter) &&
      (mainGroup === "All" || v.mainGroup === mainGroup) &&
      (subGroup === "All" || v.subGroup === subGroup) &&
      (viewMode !== "graph" || graphMemoryCluster === "All" || v.memoryCluster === graphMemoryCluster) &&
      (v.word.toLowerCase().includes(q) ||
        v.simple.toLowerCase().includes(q) ||
        v.hindi.includes(query) ||
        v.telugu.includes(query))
    );
  }, [query, chapter, mainGroup, subGroup, graphMemoryCluster, studySource, viewMode]);

  const current = filtered.length ? filtered[index % filtered.length] : vocab[0];
  const doneCount = filtered.length ? index + 1 : 0;
  const leftCount = Math.max(filtered.length - doneCount, 0);
  const estimatedTotalTime = formatDuration(filtered.length * secondsPerWord);
  const estimatedRemainingTime = formatDuration(leftCount * secondsPerWord);

  const handleSearchChange = (event) => {
    const nextQuery = event.target.value;

    if (!query && nextQuery && current?.word) {
      preSearchWordRef.current = current.word;
    }

    setQuery(nextQuery);

    if (!nextQuery) {
      const wordToRestore = preSearchWordRef.current;
      preSearchWordRef.current = null;
      if (wordToRestore) setRestoreWord(wordToRestore);
      return;
    }

    setIndex(0);
  };

  useEffect(() => {
    if (!restoreWord) return;
    const nextIndex = filtered.findIndex(item => item.word === restoreWord);
    if (nextIndex >= 0) setIndex(nextIndex);
    setRestoreWord(null);
  }, [filtered, restoreWord]);

  useEffect(() => {
    if (filtered.length && index >= filtered.length) setIndex(0);
  }, [filtered.length, index]);

  useEffect(() => {
    if (mode !== "learn" || viewMode !== "graph" || !current?.word) return;
    setGraphSelectedWord(current.word);
    setGraphNeighborsOnly(true);
    setExpandedGraphWords(words => [...new Set([...words, current.word])]);
  }, [current?.word, mode, viewMode]);

  useEffect(() => {
    if (window.matchMedia("(max-width: 1040px)").matches) return;
    activeQueueRef.current?.scrollIntoView({ block: "nearest" });
  }, [index, filtered]);

  useEffect(() => {
    if (!autoNext || mode !== "learn" || filtered.length <= 1) return undefined;
    const timer = window.setInterval(() => {
      setIndex(prev => (prev + 1) % Math.max(filtered.length, 1));
    }, secondsPerWord * 1000);
    return () => window.clearInterval(timer);
  }, [autoNext, mode, filtered.length, secondsPerWord]);

  useEffect(() => {
    return () => {
      swipeTimersRef.current.forEach(timer => window.clearTimeout(timer));
    };
  }, []);

  const getPreferredVoice = (type) => {
    const savedVoice = type === "word" ? wordVoice : teluguVoice;
    const exact = voices.find(v => v.name === savedVoice);
    if (exact && (type !== "word" || !soundsFemaleVoice(exact))) return exact;

    const scored = voices
      .map(voice => ({ voice, score: scoreVoice(voice, type) }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);

    return scored[0]?.voice || null;
  };

  const createUtterance = (text, type) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getPreferredVoice(type);
    if (voice) utterance.voice = voice;
    utterance.lang = type === "telugu" ? "te-IN" : "en-IN";
    utterance.volume = 1;
    return utterance;
  };

  const speakText = (text, type) => {
    if (!("speechSynthesis" in window)) return;
    const utterance = createUtterance(text, type);
    speechQueueRef.current = [utterance];
    window.speechSynthesis.resume();
    window.speechSynthesis.speak(utterance);
  };

  const speakCurrent = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();

    const wordUtterance = createUtterance(current.word, "word");
    const teluguUtterance = current.telugu ? createUtterance(current.telugu, "telugu") : null;
    speechQueueRef.current = teluguUtterance ? [wordUtterance, teluguUtterance] : [wordUtterance];

    if (teluguUtterance) {
      let teluguStarted = false;
      const speakTelugu = () => {
        if (teluguStarted) return;
        teluguStarted = true;
        window.speechSynthesis.resume();
        window.speechSynthesis.speak(teluguUtterance);
      };

      wordUtterance.onend = speakTelugu;
      wordUtterance.onerror = speakTelugu;
      window.setTimeout(speakTelugu, 1400);
    }

    window.speechSynthesis.speak(wordUtterance);
  };

  useEffect(() => {
    if (mode === "learn" && autoSpeak && current?.word) {
      speakCurrent();
    }
  }, [mode, autoSpeak, current?.word, wordVoice, teluguVoice, voices]);

  const progressPercent = Math.round((learned.length / allWords.length) * 100);
  const actualCards = allWords.length;
  const accuracy = score.total ? Math.round((score.correct / score.total) * 100) : 0;
  const studyFilterTitle = studyFilter === "weak" ? "Weak words" : studyFilter === "learned" ? "Learned words" : "All words";
  const activeGroupMeta = GROUPS.find(group => group.mainGroup === mainGroup);
  const groupCounts = useMemo(() => studySource.reduce((counts, item) => {
    counts[item.mainGroup] = (counts[item.mainGroup] || 0) + 1;
    return counts;
  }, {}), [studySource]);
  const difficultGroupCounts = useMemo(() => {
    const groupByWord = new Map(allWords.map(item => [item.word, item.mainGroup]));
    return weakWords.reduce((counts, word) => {
      const group = groupByWord.get(word);
      if (group) counts[group] = (counts[group] || 0) + 1;
      return counts;
    }, {});
  }, [allWords, weakWords]);
  const groupCards = useMemo(() => GROUPS.map(group => ({
    ...group,
    shortLabel: GROUP_LABELS[group.visualFamily] || group.visualFamily,
    count: groupCounts[group.mainGroup] || 0,
    difficult: difficultGroupCounts[group.mainGroup] || 0,
  })), [groupCounts, difficultGroupCounts]);
  const visibleListWords = useMemo(() => filtered.slice(0, 220), [filtered]);
  const visibleQueueItems = useMemo(() => {
    if (filtered.length <= 180) return filtered.map((item, realIndex) => ({ item, realIndex }));
    const windowSize = 150;
    const halfWindow = Math.floor(windowSize / 2);
    const start = Math.max(0, Math.min(index - halfWindow, filtered.length - windowSize));
    return filtered.slice(start, start + windowSize).map((item, offset) => ({ item, realIndex: start + offset }));
  }, [filtered, index]);
  const activeFilters = [
    studyFilter !== "all" && { label: studyFilterTitle, clear: () => openStudySet("all") },
    chapter !== "All" && { label: chapter, clear: () => updateFilters(() => setChapter("All")) },
    mainGroup !== "All" && { label: GROUP_LABELS[activeGroupMeta?.visualFamily] || mainGroup, clear: () => updateFilters(() => { setMainGroup("All"); setSubGroup("All"); }) },
    subGroup !== "All" && { label: subGroup, clear: () => updateFilters(() => setSubGroup("All")) },
    viewMode === "graph" && graphMemoryCluster !== "All" && { label: graphMemoryCluster, clear: () => updateFilters(() => setGraphMemoryCluster("All")) },
  ].filter(Boolean);
  const previewIndex = filtered.length && swipeDirection
    ? (index + (swipeDirection < 0 ? 1 : -1) + filtered.length) % filtered.length
    : index;
  const previewCard = filtered.length && swipeDirection ? filtered[previewIndex] : null;
  const quizPool = useMemo(() => {
    const source = chapter === "All" ? allWords : allWords.filter(v => v.chapter === chapter);
    return source.filter(v => !learned.includes(v.word));
  }, [allWords, chapter, learned]);
  const graphBaseWords = useMemo(() => {
    const q = graphSearch.trim().toLowerCase();
    return studySource.filter(item =>
      (chapter === "All" || item.chapter === chapter) &&
      (mainGroup === "All" || item.mainGroup === mainGroup) &&
      (subGroup === "All" || item.subGroup === subGroup) &&
      (graphMemoryCluster === "All" || item.memoryCluster === graphMemoryCluster) &&
      (!q ||
        item.word.toLowerCase().includes(q) ||
        item.simple.toLowerCase().includes(q) ||
        String(item.subGroup || "").toLowerCase().includes(q) ||
        String(item.memoryCluster || "").toLowerCase().includes(q))
    );
  }, [chapter, graphMemoryCluster, graphSearch, mainGroup, studySource, subGroup]);
  const rawGraphData = useMemo(
    () => buildVocabGraph(graphBaseWords, graphRelations, graphHideWeakLinks),
    [graphBaseWords, graphHideWeakLinks, graphRelations]
  );
  const graphSelectedNode = useMemo(
    () => graphSelectedWord ? rawGraphData.nodes.find(node => node.id === graphSelectedWord) || null : null,
    [graphSelectedWord, rawGraphData.nodes]
  );
  const selectedGraphDetail = useMemo(
    () => graphSelectedWord ? allWords.find(item => item.word === graphSelectedWord) || null : null,
    [allWords, graphSelectedWord]
  );
  const graphData = useMemo(() => {
    const storedPositions = graphNodePositionsRef.current;
    if (graphNeighborsOnly && selectedGraphDetail) {
      const synonymGraph = buildSelectedSynonymGraph(graphSelectedWord, selectedGraphDetail, allWords, expandedGraphWords);
      return buildExpandedGraph(rawGraphData, synonymGraph, graphSelectedWord, storedPositions);
    }
    if (!graphNeighborsOnly || !graphSelectedNode) return graphWithStoredPositions(rawGraphData, storedPositions);
    const neighborIds = new Set([graphSelectedNode.id]);
    rawGraphData.links.forEach(link => {
      const source = linkId(link.source);
      const target = linkId(link.target);
      if (source === graphSelectedNode.id) neighborIds.add(target);
      if (target === graphSelectedNode.id) neighborIds.add(source);
    });
    return graphWithStoredPositions({
      nodes: rawGraphData.nodes.filter(node => neighborIds.has(node.id)),
      links: rawGraphData.links.filter(link => neighborIds.has(linkId(link.source)) && neighborIds.has(linkId(link.target))),
    }, storedPositions);
  }, [allWords, expandedGraphWords, graphNeighborsOnly, graphPositionVersion, graphSelectedNode, graphSelectedWord, rawGraphData, selectedGraphDetail]);
  const graphNodeIds = useMemo(() => new Set(graphData.nodes.map(node => node.id)), [graphData.nodes]);
  const graphPathSet = useMemo(() => new Set(graphPath), [graphPath]);
  const graphPathLinkSet = useMemo(() => {
    const links = new Set();
    for (let index = 0; index < graphPath.length - 1; index += 1) {
      links.add(relationKey(graphPath[index], graphPath[index + 1]));
    }
    return links;
  }, [graphPath]);
  const selectedSynonymTerms = useMemo(() => simpleSynonymTerms(selectedGraphDetail, 12), [selectedGraphDetail]);
  const graphLegendGroups = useMemo(
    () => [...new Set(graphData.nodes.map(node => node.mainGroup))].slice(0, 12),
    [graphData.nodes]
  );

  useEffect(() => {
    if (mode !== "learn" || viewMode !== "graph") return;
    setGraphSelectedWord("");
    setGraphNeighborsOnly(false);
    setExpandedGraphWords([]);
    setGraphPath([]);
  }, [chapter, graphMemoryCluster, graphSearch, mainGroup, subGroup]);

  useEffect(() => {
    if (mode !== "learn" || viewMode !== "graph" || !graphRef.current || !graphData.nodes.length) return undefined;
    const centerSelectedNode = (duration = 600) => {
      if (!graphNeighborsOnly || !graphSelectedWord) return;
      const selectedNode = graphData.nodes.find(node => node.id === graphSelectedWord);
      if (!Number.isFinite(selectedNode?.x) || !Number.isFinite(selectedNode?.y)) return;
      const activeBranchIds = new Set([graphSelectedWord]);
      graphData.links.forEach(link => {
        if (!link.isExpandedGraphLink) return;
        const source = linkId(link.source);
        const target = linkId(link.target);
        if (source === graphSelectedWord) activeBranchIds.add(target);
        if (target === graphSelectedWord) activeBranchIds.add(source);
      });

      if (activeBranchIds.size > 1) {
        graphRef.current?.zoomToFit(duration, 110, node => activeBranchIds.has(node.id));
        return;
      }

      graphRef.current?.centerAt(selectedNode.x, selectedNode.y, duration);
      graphRef.current?.zoom(2.35, duration);
    };
    const settleTimer = window.setTimeout(() => {
      const graph = graphRef.current;
      graph?.d3Force("charge")?.strength(node => {
        if (!graphNeighborsOnly) return -18;
        if (node.fx !== undefined && node.fy !== undefined) return -20;
        if (node.isGraphInactive) return -18;
        if (node.isFocusWord || node.isExpandedGraphNode) return -140;
        return -80;
      });
      graph?.d3Force("link")
        ?.distance(link => {
          if (link.isExpandedGraphLink) return 190;
          if (link.relationType === "directSynonym") return 150;
          return graphNeighborsOnly ? 88 : 46;
        })
        .strength(link => link.isExpandedGraphLink ? 0.92 : graphNeighborsOnly ? 0.42 : 0.65);
      graph?.d3Force(
        "collide",
        graphNeighborsOnly
          ? forceCollide(node => {
              if (node.isGraphInactive) return 30;
              const labelRoom = Math.min(120, Math.max(44, String(node.word || "").length * 7));
              return node.id === graphSelectedWord ? labelRoom + 26 : labelRoom;
            }).strength(0.95).iterations(4)
          : forceCollide(node => (node.isSynonymTerm || node.isSynonymMatch ? 28 : 18)).strength(0.35).iterations(1)
      );
      graph?.d3Force("center")?.x(0).y(0);
      graphData.nodes.forEach(node => {
        if (node.isUserPlaced) return;
        if (graphNeighborsOnly && node.isExpandedGraphNode) return;
        if (node.fx !== undefined || node.fy !== undefined) {
          node.fx = undefined;
          node.fy = undefined;
        }
      });
      graph?.d3ReheatSimulation();
      if (graphNeighborsOnly) centerSelectedNode(0);
      else graph?.centerAt(0, 0, 0);
    }, 80);
    const fitTimer = window.setTimeout(() => {
      if (!graphNeighborsOnly) {
        graphRef.current?.zoomToFit(700, 90);
        graphRef.current?.zoom(2.2, 500);
      }
    }, 900);
    const selectedCenterTimers = graphNeighborsOnly
      ? [120, 360].map(delay => window.setTimeout(() => centerSelectedNode(360), delay))
      : [];
    return () => {
      window.clearTimeout(settleTimer);
      window.clearTimeout(fitTimer);
      selectedCenterTimers.forEach(timer => window.clearTimeout(timer));
    };
  }, [mode, viewMode, graphData.nodes, graphData.nodes.length, graphData.links.length, graphNeighborsOnly, graphSelectedWord]);

  const openStudySet = (filter) => {
    updateFilters(() => {
      setStudyFilter(filter);
      setMode("learn");
      if (filter === "all") {
        setChapter("All");
        setMainGroup("All");
        setSubGroup("All");
      }
      setQuery("");
    });
  };

  const openMemoryGroup = (groupName) => {
    updateFilters(() => {
      setStudyFilter("all");
      setMode("learn");
      setMainGroup(groupName);
      setSubGroup("All");
      setQuery("");
    });
  };

  const resetFilters = () => {
    updateFilters(() => {
      setStudyFilter("all");
      setChapter("All");
      setMainGroup("All");
      setSubGroup("All");
      setQuery("");
    });
    setGraphMemoryCluster("All");
    setGraphSearch("");
    setGraphSelectedWord("");
    setGraphNeighborsOnly(false);
    setGraphPath([]);
  };

  function updateFilters(updater) {
    startFilterTransition(() => {
      updater();
      setIndex(0);
    });
  }

  const updateGraphMemoryCluster = (cluster) => {
    updateFilters(() => setGraphMemoryCluster(cluster));
  };

  const saveGraphNodePositionsForNodes = (nodes) => {
    const nextPositions = { ...graphNodePositionsRef.current };
    let didChange = false;

    nodes.forEach(node => {
      if (!node?.id || !isFiniteNumber(node.x) || !isFiniteNumber(node.y)) return;
      node.fx = node.x;
      node.fy = node.y;
      node.isUserPlaced = true;
      nextPositions[node.id] = { x: node.x, y: node.y };
      didChange = true;
    });

    if (!didChange) return;
    graphNodePositionsRef.current = nextPositions;
    saveGraphNodePositions(graphNodePositionsRef.current);
    setGraphPositionVersion(version => version + 1);
  };

  const getCurrentBranchNodes = (node) => {
    if (!node?.id || node.id !== graphSelectedWord || !graphNeighborsOnly) return [node].filter(Boolean);
    const branchIds = new Set([node.id]);
    graphData.links.forEach(link => {
      if (!link.isExpandedGraphLink) return;
      const source = linkId(link.source);
      const target = linkId(link.target);
      if (source === node.id) branchIds.add(target);
      if (target === node.id) branchIds.add(source);
    });
    return graphData.nodes.filter(item => branchIds.has(item.id));
  };

  const moveGraphBranchWithNode = (node) => {
    if (!node?.id || !isFiniteNumber(node.x) || !isFiniteNumber(node.y)) return;
    const previous = graphDragRef.current;
    graphDragRef.current = { id: node.id, x: node.x, y: node.y };

    if (!previous || previous.id !== node.id) return;
    const deltaX = node.x - previous.x;
    const deltaY = node.y - previous.y;
    if (!deltaX && !deltaY) return;

    getCurrentBranchNodes(node).forEach(item => {
      if (item.id === node.id) return;
      if (!isFiniteNumber(item.x) || !isFiniteNumber(item.y)) return;
      item.x += deltaX;
      item.y += deltaY;
      item.fx = item.x;
      item.fy = item.y;
      item.isUserPlaced = true;
    });
  };

  const saveGraphDragPositions = (node) => {
    graphDragRef.current = null;
    saveGraphNodePositionsForNodes(getCurrentBranchNodes(node));
  };

  const selectGraphNode = (node) => {
    if (node.isSynonymTerm) return;
    setGraphSelectedWord(node.id);
    setGraphNeighborsOnly(true);
    if (!node.id.startsWith("syn:")) {
      setExpandedGraphWords(words => [...new Set([...words, node.id])]);
    }
    setGraphPathStart(currentValue => currentValue || node.id);
    const nextIndex = filtered.findIndex(item => item.word === node.id);
    if (nextIndex >= 0) setIndex(nextIndex);
    graphRef.current?.centerAt(node.x || 0, node.y || 0, 700);
    graphRef.current?.zoom(3.2, 700);
  };

  const focusGraphNeighborhood = (node) => {
    selectGraphNode(node);
    setGraphNeighborsOnly(true);
  };

  const pinSelectedGraphNode = () => {
    if (!graphSelectedNode) return;
    graphSelectedNode.fx = 0;
    graphSelectedNode.fy = 0;
    graphRef.current?.centerAt(0, 0, 700);
    graphRef.current?.zoom(3.5, 700);
  };

  const focusSelectedCluster = () => {
    if (!selectedGraphDetail) return;
    updateFilters(() => {
      setMode("learn");
      setViewMode("graph");
      setStudyFilter("all");
      setMainGroup(selectedGraphDetail.mainGroup);
      setSubGroup(selectedGraphDetail.subGroup);
      setChapter("All");
      setQuery("");
    });
    setGraphMemoryCluster(selectedGraphDetail.memoryCluster || "All");
  };

  const studySelectedCluster = () => {
    if (!selectedGraphDetail) return;
    updateFilters(() => {
      setMode("learn");
      setViewMode("flashcard");
      setStudyFilter("all");
      setMainGroup(selectedGraphDetail.mainGroup);
      setSubGroup(selectedGraphDetail.subGroup);
      setChapter("All");
      setQuery("");
    });
  };

  const showGraphPath = () => {
    const path = findGraphPath(graphData, graphPathStart, graphPathEnd);
    setGraphPath(path);
    if (path.length) setGraphSelectedWord(path[0]);
  };

  const resetGraphView = () => {
    updateFilters(() => {
      setStudyFilter("all");
      setChapter("All");
      setMainGroup("All");
      setSubGroup("All");
      setQuery("");
    });
    setGraphSearch("");
    setGraphMemoryCluster("All");
    setGraphSelectedWord("");
    setGraphNeighborsOnly(false);
    setGraphHideWeakLinks(false);
    setGraphPath([]);
    setGraphPathStart("");
    setGraphPathEnd("");
    setExpandedGraphWords([]);
    graphNodePositionsRef.current = {};
    saveGraphNodePositions({});
    setGraphPositionVersion(version => version + 1);
    window.setTimeout(() => graphRef.current?.zoomToFit(700, 80), 120);
  };

  const clearLearnedWords = () => {
    setLearned([]);
    if (studyFilter === "learned") openStudySet("all");
    if (!quiz) nextQuiz();
  };

  const clearWeakWords = () => {
    setWeakWords([]);
    if (studyFilter === "weak") openStudySet("all");
  };

  const nextWord = () => {
    setIndex(prev => (prev + 1) % Math.max(filtered.length, 1));
  };

  const previousWord = () => {
    setIndex(prev => (prev - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1));
  };

  const queueSwipeTimer = (callback, delay) => {
    const timer = window.setTimeout(callback, delay);
    swipeTimersRef.current.push(timer);
  };

  const swapCard = (direction) => {
    if (swipeAnimatingRef.current || filtered.length <= 1) return;

    const distance = Math.max(window.innerWidth * 1.18, 460);
    swipeAnimatingRef.current = true;
    setSwipeDirection(direction);
    setSwipeProgress(1);
    setSwipePhase("leaving");
    setSwipeOffset(direction * distance);

    queueSwipeTimer(() => {
      setIndex(prev => {
        const total = Math.max(filtered.length, 1);
        return direction < 0 ? (prev + 1) % total : (prev - 1 + total) % total;
      });
      setSwipePhase("resetting");
      setSwipeOffset(0);
      setSwipeProgress(0);
      setSwipeDirection(0);
    }, 280);

    queueSwipeTimer(() => {
      swipeAnimatingRef.current = false;
      setSwipePhase("idle");
      setSwipeOffset(0);
      setSwipeDirection(0);
      setSwipeProgress(0);
    }, 360);
  };

  const handleCardTouchStart = (event) => {
    if (filtered.length <= 1 || event.touches.length !== 1 || swipeAnimatingRef.current) return;
    const touch = event.touches[0];
    swipeStartRef.current = { x: touch.clientX, y: touch.clientY };
    setSwipePhase("dragging");
    setSwipeDirection(0);
    setSwipeOffset(0);
    setSwipeProgress(0);
  };

  const handleCardTouchMove = (event) => {
    const start = swipeStartRef.current;
    if (!start || event.touches.length !== 1) return;

    const touch = event.touches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      setSwipeDirection(deltaX < 0 ? -1 : 1);
      setSwipeOffset(Math.max(-160, Math.min(160, deltaX)));
      setSwipeProgress(Math.min(Math.abs(deltaX) / 140, 1));
    }
  };

  const handleCardTouchEnd = (event) => {
    const start = swipeStartRef.current;
    if (!start) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    const isHorizontalSwipe = Math.abs(deltaX) > 56 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2;

    if (isHorizontalSwipe) {
      swapCard(deltaX < 0 ? -1 : 1);
    } else {
      setSwipePhase("idle");
      setSwipeOffset(0);
      setSwipeDirection(0);
      setSwipeProgress(0);
    }

    swipeStartRef.current = null;
  };

  const nextQuiz = () => {
    if (!quizPool.length) {
      setQuiz(null);
      setOptions([]);
      setSelected(null);
      return;
    }
    const q = quizPool[Math.floor(Math.random() * quizPool.length)];
    setQuiz(q);
    setOptions(getOptions(q, quizPool));
    setSelected(null);
  };

  useEffect(() => {
    if (mode === "quiz" && !selected && (!quiz || learned.includes(quiz.word) || !quizPool.some(item => item.word === quiz.word))) {
      nextQuiz();
    }
  }, [mode, quiz?.word, learned, quizPool, selected]);

  const checkAnswer = (option) => {
    if (selected || !quiz) return;
    markStudiedToday();
    const correct = option.word === quiz.word;
    setSelected(option.word);
    setScore(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    if (!correct && !weakWords.includes(quiz.word)) setWeakWords([...weakWords, quiz.word]);
    if (correct && !learned.includes(quiz.word)) setLearned([...learned, quiz.word]);
  };

  return (
    <div className={mode === "learn" && viewMode === "graph" ? "app-shell graph-shell" : "app-shell"}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">SV</div>
          <div>
            <p>SSC PYQ Vocab</p>
            <strong>Study Platform</strong>
          </div>
          <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">{theme === 'dark' ? '🌙' : '🌞'}</button>
        </div>

        <button type="button" className="mobile-menu-button" onClick={() => setMenuOpen(true)} aria-label="Open navigation menu">☰</button>

        <nav className="nav-tabs" aria-label="Learning sections">
          <button className={mode === "learn" ? "active" : ""} onClick={() => openStudySet("all")}>Study Cards</button>
          <button className={mode === "quiz" ? "active" : ""} onClick={() => setMode("quiz")}>Practice Quiz</button>
          <button className={mode === "progress" ? "active" : ""} onClick={() => setMode("progress")}>Progress</button>
        </nav>

        {menuOpen && (
          <div className="mobile-settings nav-overlay" role="dialog" aria-modal="true" aria-label="Navigation menu">
            <div className="mobile-settings-card nav-card">
              <div className="settings-header">
                <div>
                  <p className="eyebrow">Menu</p>
                  <h2>Navigate</h2>
                </div>
                <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu">×</button>
              </div>
              <div className="mobile-nav-list">
                <button className={mode === "learn" ? "active" : ""} onClick={() => { openStudySet("all"); setMenuOpen(false); }}>Study Cards</button>
                <button className={mode === "quiz" ? "active" : ""} onClick={() => { setMode("quiz"); setMenuOpen(false); }}>Practice Quiz</button>
                <button className={mode === "progress" ? "active" : ""} onClick={() => { setMode("progress"); setMenuOpen(false); }}>Progress</button>
              </div>
            </div>
          </div>
        )}

        <div className="goal-card">
          <span>Course progress</span>
          <strong>{progressPercent}%</strong>
          <div className="mini-track"><div style={{ width: `${progressPercent}%` }} /></div>
          <p>{learned.length} of {allWords.length} words learned</p>
        </div>
      </aside>

      <main className="workspace">
        {mode === "progress" && (
          <header className="topbar compact">
            <div className="top-actions">
              <select value={chapter} onChange={e => updateFilters(() => setChapter(e.target.value))} className="input">
                {chapters.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </header>
        )}

        {mode === "progress" ? (
          <section className="panel progress-panel">
            <div className="section-title">
              <div>
                <p className="eyebrow">Progress dashboard</p>
                <h2>Your study snapshot</h2>
              </div>
              <span className="chip">{actualCards} active cards</span>
            </div>

            <div className="stat-grid progress-stats">
              <Metric label="Streak" value={`${streak} days`} />
              <Metric label="Learned" value={`${learned.length}/${allWords.length}`} onClick={() => openStudySet("learned")} />
              <Metric label="Accuracy" value={`${accuracy}%`} />
              <Metric label="Weak words" value={weakWords.length} onClick={() => openStudySet("weak")} />
            </div>

            <ProgressRow label="Course completion" value={`${progressPercent}%`} detail={`${learned.length} learned out of ${allWords.length}`} percent={progressPercent} />

            <div className="grouping-check">
              <strong>Grouping check</strong>
              <span>{groupingCheck.totalOriginalWords} original / {groupingCheck.totalEnrichedWords} enriched / {groupingCheck.ungroupedWords.length} ungrouped</span>
            </div>

            <div className="reset-actions">
              <button type="button" onClick={clearLearnedWords} disabled={!learned.length}>Clear learned words</button>
              <button type="button" onClick={clearWeakWords} disabled={!weakWords.length}>Clear weak words</button>
            </div>

            <div className="word-groups">
              <WordGroup title="Learned words" words={learned} empty="No words marked learned yet." onOpen={() => openStudySet("learned")} />
              <WordGroup title="Weak words" words={weakWords} empty="No weak words yet." onOpen={() => openStudySet("weak")} />
            </div>
          </section>
        ) : mode === "learn" ? (
          <section className={viewMode === "graph" ? "study-layout graph-mode" : "study-layout"}>
            <div className="study-main">
              {viewMode !== "graph" && studyFilter !== "all" && (
                <div className="study-focus-bar">
                  <div>
                    <p className="eyebrow">Focused study</p>
                    <strong>{studyFilterTitle}</strong>
                  </div>
                  <button type="button" onClick={() => openStudySet("all")}>All words</button>
                </div>
              )}

              {viewMode !== "graph" && <div className="search-row">
                <input
                  value={query}
                  onChange={handleSearchChange}
                  placeholder="Search word, meaning, Telugu..."
                  className="input"
                />
                <button type="button" className="settings-button" onClick={() => setSettingsOpen(true)} aria-label="Open study settings">⚙</button>
                <StudyPlaybackControls
                  autoSpeak={autoSpeak}
                  setAutoSpeak={setAutoSpeak}
                  speakCurrent={speakCurrent}
                  autoNext={autoNext}
                  setAutoNext={setAutoNext}
                  secondsPerWord={secondsPerWord}
                  setSecondsPerWord={setSecondsPerWord}
                  remainingText={`${leftCount} left`}
                />
              </div>}

              {viewMode !== "graph" && <section className={isFilterPending ? "focus-toolbar is-loading" : "focus-toolbar"}>
                <div className="focus-summary">
                  <div>
                    <p className="eyebrow">Study focus</p>
                    <h2>{isFilterPending ? "Updating..." : `${filtered.length} words ready`}</h2>
                  </div>
                  <div className="view-toggle">
                    <button type="button" className={viewMode === "flashcard" ? "active" : ""} onClick={() => setViewMode("flashcard")}>Cards</button>
                    <button type="button" className={viewMode === "list" ? "active" : ""} onClick={() => setViewMode("list")}>List</button>
                    <button type="button" className={viewMode === "graph" ? "active" : ""} onClick={() => setViewMode("graph")}>Graph View</button>
                  </div>
                </div>

                <div className="active-filter-row">
                  {activeFilters.length ? activeFilters.map(filter => (
                    <button type="button" key={filter.label} onClick={filter.clear}>{filter.label} x</button>
                  )) : <span>All chapters and all memory groups</span>}
                  {activeFilters.length > 0 && <button type="button" className="clear-filters" onClick={resetFilters}>Clear all</button>}
                </div>

                <div className="quick-group-grid">
                  <button type="button" className={mainGroup === "All" ? "active" : ""} onClick={() => updateFilters(() => { setMainGroup("All"); setSubGroup("All"); })}>All</button>
                  {groupCards.map(group => (
                    <button
                      type="button"
                      key={group.mainGroup}
                      className={mainGroup === group.mainGroup ? "active" : ""}
                      onClick={() => openMemoryGroup(group.mainGroup)}
                    >
                      <strong>{group.shortLabel}</strong>
                      <span>{group.count}</span>
                    </button>
                  ))}
                </div>

                <button type="button" className="advanced-toggle" onClick={() => setAdvancedFiltersOpen(value => !value)}>
                  {advancedFiltersOpen ? "Hide chapter filters" : "Chapter filters"}
                </button>

                {advancedFiltersOpen && (
                  <div className="advanced-filter-grid">
                    <label>
                      <span>Chapter</span>
                      <select value={chapter} onChange={e => updateFilters(() => setChapter(e.target.value))} className="input">
                        {chapters.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </label>
                    <label>
                      <span>Subgroup</span>
                      <select value={subGroup} onChange={e => updateFilters(() => setSubGroup(e.target.value))} className="input">
                        {subGroups.map(group => <option key={group} value={group}>{group === "All" ? "All subgroups" : group}</option>)}
                      </select>
                    </label>
                  </div>
                )}
              </section>}

              {settingsOpen && (
                <div className={viewMode === "graph" ? "mobile-settings graph-settings-overlay" : "mobile-settings"} role="dialog" aria-modal="true" aria-label="Study settings">
                  <div className="mobile-settings-card">
                    <div className="settings-header">
                      <div>
                        <p className="eyebrow">{viewMode === "graph" ? "Graph filters" : "Study settings"}</p>
                        <h2>{viewMode === "graph" ? "Filter graph" : "Controls"}</h2>
                      </div>
                      <button type="button" onClick={() => setSettingsOpen(false)} aria-label="Close settings">×</button>
                    </div>

                    {viewMode === "graph" && (
                      <>
                        <label className="setting-field">
                          <span>Search graph</span>
                          <input
                            value={graphSearch}
                            onChange={event => setGraphSearch(event.target.value)}
                            className="input"
                            placeholder="Search word or synonym..."
                          />
                        </label>

                        <label className="setting-field">
                          <span>Memory cluster</span>
                          <select value={graphMemoryCluster} onChange={event => updateGraphMemoryCluster(event.target.value)} className="input">
                            {memoryClusters.map(cluster => <option key={cluster} value={cluster}>{cluster === "All" ? "All memory clusters" : cluster}</option>)}
                          </select>
                        </label>
                      </>
                    )}

                    <label className="setting-field">
                      <span>Chapter</span>
                      <select value={chapter} onChange={e => updateFilters(() => setChapter(e.target.value))} className="input">
                        {chapters.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </label>

                    <label className="setting-field">
                      <span>Main group</span>
                      <select value={mainGroup} onChange={e => updateFilters(() => { setMainGroup(e.target.value); setSubGroup("All"); })} className="input">
                        <option value="All">All memory groups</option>
                        {GROUPS.map(group => <option key={group.mainGroup} value={group.mainGroup}>{group.mainGroup}</option>)}
                      </select>
                    </label>

                    <label className="setting-field">
                      <span>Subgroup</span>
                      <select value={subGroup} onChange={e => updateFilters(() => setSubGroup(e.target.value))} className="input">
                        {subGroups.map(group => <option key={group} value={group}>{group === "All" ? "All subgroups" : group}</option>)}
                      </select>
                    </label>

                    <div className="setting-group">
                      <span>Voice settings</span>
                      <select value={wordVoice} onChange={e => setWordVoice(e.target.value)} className="voice-select" aria-label="Word voice">
                        <option value="">Word: Indian male</option>
                        {voices.map(voice => (
                          <option key={`mobile-word-${voice.name}-${voice.lang}`} value={voice.name}>
                            {voice.name} ({voice.lang})
                          </option>
                        ))}
                      </select>
                      <select value={teluguVoice} onChange={e => setTeluguVoice(e.target.value)} className="voice-select" aria-label="Telugu meaning voice">
                        <option value="">Telugu: female</option>
                        {voices.map(voice => (
                          <option key={`mobile-telugu-${voice.name}-${voice.lang}`} value={voice.name}>
                            {voice.name} ({voice.lang})
                          </option>
                        ))}
                      </select>
                      <label className="speak-toggle">
                        <input type="checkbox" checked={autoSpeak} onChange={e => setAutoSpeak(e.target.checked)} />
                        Auto speak on word change
                      </label>
                    </div>

                    {false && <div className="setting-group">
                      <span>Auto next timer</span>
                      <strong>{secondsPerWord}s per word</strong>
                      <small>{doneCount} done · {leftCount} left · remaining {estimatedRemainingTime}</small>
                      <div className="timer-range">
                        <input
                          type="range"
                          min="5"
                          max="120"
                          step="5"
                          value={secondsPerWord}
                          onChange={e => setSecondsPerWord(Number(e.target.value))}
                          aria-label="Seconds per word"
                        />
                        <div className="range-labels">
                          <span>5s</span>
                          <span>60s</span>
                          <span>120s</span>
                        </div>
                      </div>
                      <button className={autoNext ? "timer-toggle running" : "timer-toggle"} onClick={() => setAutoNext(value => !value)}>
                        {autoNext ? "Pause auto next" : "Start auto next"}
                      </button>
                    </div>}
                  </div>
                </div>
              )}

              {viewMode === "graph" ? (
                <GraphStudyPanel
                  graphRef={graphRef}
                  graphWrapRef={graphWrapRef}
                  graphSize={graphSize}
                  graphData={graphData}
                  graphNodeIds={graphNodeIds}
                  graphRelations={graphRelations}
                  setGraphRelations={setGraphRelations}
                  graphMemoryCluster={graphMemoryCluster}
                  setGraphMemoryCluster={updateGraphMemoryCluster}
                  memoryClusters={memoryClusters}
                  graphSearch={graphSearch}
                  setGraphSearch={setGraphSearch}
                  graphNeighborsOnly={graphNeighborsOnly}
                  setGraphNeighborsOnly={setGraphNeighborsOnly}
                  graphHideWeakLinks={graphHideWeakLinks}
                  setGraphHideWeakLinks={setGraphHideWeakLinks}
                  graphSelectedWord={graphSelectedWord}
                  selectedGraphDetail={selectedGraphDetail}
                  selectedSynonymTerms={selectedSynonymTerms}
                  graphLegendGroups={graphLegendGroups}
                  graphPathStart={graphPathStart}
                  setGraphPathStart={setGraphPathStart}
                  graphPathEnd={graphPathEnd}
                  setGraphPathEnd={setGraphPathEnd}
                  graphPath={graphPath}
                  graphPathSet={graphPathSet}
                  graphPathLinkSet={graphPathLinkSet}
                  weakWords={weakWords}
                  learned={learned}
                  selectGraphNode={selectGraphNode}
                  moveGraphBranchWithNode={moveGraphBranchWithNode}
                  saveGraphDragPositions={saveGraphDragPositions}
                  focusGraphNeighborhood={focusGraphNeighborhood}
                  focusSelectedCluster={focusSelectedCluster}
                  studySelectedCluster={studySelectedCluster}
                  pinSelectedGraphNode={pinSelectedGraphNode}
                  showGraphPath={showGraphPath}
                  resetGraphView={resetGraphView}
                  openGraphFilters={() => setSettingsOpen(true)}
                  openGraphMenu={() => setMenuOpen(true)}
                  onNextWord={nextWord}
                  onPreviousWord={previousWord}
                  canSwipeWords={filtered.length > 1}
                  playbackControls={
                    <StudyPlaybackControls
                      autoSpeak={autoSpeak}
                      setAutoSpeak={setAutoSpeak}
                      speakCurrent={speakCurrent}
                      autoNext={autoNext}
                      setAutoNext={setAutoNext}
                      secondsPerWord={secondsPerWord}
                      setSecondsPerWord={setSecondsPerWord}
                      remainingText={`${leftCount} left`}
                      compact
                    />
                  }
                />
              ) : filtered.length && viewMode === "list" ? (
                <div className="study-list panel">
                  <div className="study-list-head">
                    <div>
                      <p className="eyebrow">List review</p>
                      <h2>{filtered.length} grouped words</h2>
                    </div>
                  </div>
                  {visibleListWords.map((item, realIndex) => (
                    <button
                      type="button"
                      key={`${item.bookNo}-${item.word}-list`}
                      className={realIndex === index ? "study-list-item active" : "study-list-item"}
                      onClick={() => setIndex(realIndex)}
                    >
                      <div>
                        <strong>{item.word}</strong>
                        <span><HighlightedSimple text={item.simple} word={item.word} /></span>
                        <small>{item.mainGroup} / {item.subGroup}</small>
                      </div>
                      <b>{item.visual}</b>
                    </button>
                  ))}
                  {filtered.length > visibleListWords.length && (
                    <div className="render-note">Showing first {visibleListWords.length} results. Use search or a group filter to narrow this list.</div>
                  )}
                </div>
              ) : filtered.length ? (
              <div
                className={`card-carousel ${swipePhase !== "idle" ? `is-${swipePhase}` : ""}`.trim()}
                onTouchStart={handleCardTouchStart}
                onTouchMove={handleCardTouchMove}
                onTouchEnd={handleCardTouchEnd}
                onTouchCancel={() => {
                  swipeStartRef.current = null;
                  setSwipePhase("idle");
                  setSwipeOffset(0);
                  setSwipeDirection(0);
                  setSwipeProgress(0);
                }}
                style={{ "--swipe-progress": swipeProgress }}
              >
                <button className="carousel-zone carousel-prev" onClick={previousWord} aria-label="Previous word"><span>←</span></button>
                {previewCard && (
                  <article
                    className={`flashcard preview-card ${swipeDirection < 0 ? "preview-next" : "preview-prev"}`}
                    aria-hidden="true"
                  >
                    <div className="card-meta">
                      <span>Card {previewIndex + 1} of {filtered.length}</span>
                      <span>{previewCard.chapter}</span>
                    </div>
                    <h2>{previewCard.word}</h2>
                    <div className="answer-grid">
                      <Info label="Simple" text={previewCard.simple} word={previewCard.word} highlightSimple />
                      <Info label="Telugu" text={previewCard.telugu} />
                      <Info label="Memory trick" text={previewCard.trick} visual={previewCard.visual} wide />
                      <Info label="Example" text={previewCard.example} wide />
                    </div>
                  </article>
                )}
                <article
                  className="flashcard"
                  style={{
                    transform: swipeOffset ? `translateX(${swipeOffset}px) rotate(${swipeOffset / 36}deg)` : undefined,
                  }}
                >
                  <div className="card-meta">
                    <span>Card {filtered.length ? index + 1 : 0} of {filtered.length}</span>
                    <span>{current.chapter}</span>
                    <span>{current.subGroup}</span>
                  </div>
                  <h2>{current.word}</h2>
                  <p className="group-line">{current.mainGroup}</p>
                  <div className="answer-grid">
                    <Info label="Simple" text={current.simple} word={current.word} highlightSimple />
                    {/* <Info label="Hindi" text={current.hindi} /> */}
                    <Info label="Telugu" text={current.telugu} />
                    <Info label="Memory trick" text={current.trick} visual={current.visual} wide />
                    <Info label="Example" text={current.example} wide />
                  </div>
                </article>
                <button className="carousel-zone carousel-next" onClick={nextWord} aria-label="Next word"><span>→</span></button>
              </div>
              ) : (
                <div className="empty-study panel">
                  <p className="eyebrow">No cards</p>
                  <h2>No {studyFilterTitle.toLowerCase()} found</h2>
                  <button type="button" className="primary" onClick={() => openStudySet("all")}>Study all words</button>
                </div>
              )}

              {false && viewMode !== "graph" && <div className="auto-next-panel">
                <div>
                  <p className="eyebrow">Auto next timer</p>
                  <strong>{secondsPerWord}s per word</strong>
                  <span>{filtered.length} words require about {estimatedTotalTime}</span>
                  <small>{doneCount} done · {leftCount} left · remaining {estimatedRemainingTime}</small>
                </div>
                <div className="timer-range">
                  <input
                    type="range"
                    min="5"
                    max="120"
                    step="5"
                    value={secondsPerWord}
                    onChange={e => setSecondsPerWord(Number(e.target.value))}
                    aria-label="Seconds per word"
                  />
                  <div className="range-labels">
                    <span>5s</span>
                    <span>60s</span>
                    <span>120s</span>
                  </div>
                </div>
                <button className={autoNext ? "timer-toggle running" : "timer-toggle"} onClick={() => setAutoNext(value => !value)}>
                  {autoNext ? "Pause" : "Start"}
                </button>
              </div>}
            </div>

            <aside className="queue panel">
              <p className="eyebrow">Study queue</p>
              <h2>{filtered.length} Words</h2>
              <div className="queue-list">
                {visibleQueueItems.map(({ item, realIndex }) => (
                  <QueueItem
                    key={`${item.bookNo}-${item.word}`}
                    item={item}
                    realIndex={realIndex}
                    isCurrent={realIndex === index}
                    setIndex={setIndex}
                    activeRef={realIndex === index ? activeQueueRef : null}
                  />
                ))}
                {filtered.length > visibleQueueItems.length && (
                  <div className="queue-note">Showing nearby cards for faster filtering.</div>
                )}
              </div>
            </aside>
          </section>
        ) : (
          <section className="panel quiz-panel">
            <button type="button" className="quiz-settings-button quiz-settings-top" onClick={() => setQuizSettingsOpen(true)} aria-label="Open quiz settings">⚙</button>

            {selected === quiz?.word && (
              <div className="paper-flyers" aria-hidden="true">
                {Array.from({ length: 18 }, (_, item) => (
                  <span key={item} />
                ))}
              </div>
            )}

            {!quiz ? (
              <div className="quiz-empty">
                <p className="eyebrow">Quiz complete</p>
                <h2>No unlearned words left here</h2>
                <p>Clear learned words or choose another chapter to continue practice.</p>
              </div>
            ) : (
              <>
                <div className="quiz-header">
                  <div>
                    <p className="eyebrow">Choose correct word</p>
                    <h2>{quiz.simple}</h2>
                  </div>
                  <div className="quiz-meta">
                    <div className="score-pill">{score.correct}/{score.total}</div>
                  </div>
                </div>

                {quizSettingsOpen && (
                  <div className="mobile-settings quiz-settings-overlay" role="dialog" aria-modal="true" aria-label="Quiz settings">
                    <div className="mobile-settings-card quiz-settings-card">
                      <div className="settings-header">
                        <div>
                          <p className="eyebrow">Quiz settings</p>
                          <h2>Practice set</h2>
                        </div>
                        <button type="button" onClick={() => setQuizSettingsOpen(false)} aria-label="Close quiz settings">×</button>
                      </div>

                      <label className="setting-field">
                        <span>Chapter</span>
                        <select value={chapter} onChange={e => { setChapter(e.target.value); setIndex(0); setSelected(null); }} className="input">
                          {chapters.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </label>

                      <button type="button" className="primary" onClick={() => { setQuizSettingsOpen(false); nextQuiz(); }}>
                        Apply
                      </button>
                    </div>
                  </div>
                )}

                <div className="options-grid">
                  {options.map(option => {
                    const isCorrect = option.word === quiz.word;
                    const isSelected = selected === option.word;
                    const state = selected && isCorrect ? "correct" : isSelected ? "wrong" : "";
                    const optionLabel = String.fromCharCode(65 + options.indexOf(option));
                    return (
                      <button key={option.word} onClick={() => checkAnswer(option)} className={state}>
                        <span className="option-label">{optionLabel}</span>
                        <span>{option.word}</span>
                      </button>
                    );
                  })}
                </div>

                {selected && (
                  <div className="explain-box">
                    {quiz.visual && <div className="visual small">{quiz.visual}</div>}
                    <strong>{quiz.word}</strong>
                    {quiz.telugu && <p className="telugu-meaning">{quiz.telugu}</p>}
                    <p>{quiz.trick}</p>
                    <span>{quiz.example}</span>
                  </div>
                )}

                <div className="quiz-actions">
                  <button className="primary next-question" onClick={nextQuiz}>Next Question</button>
                </div>
              </>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

function Metric({ label, value, onClick }) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag type={onClick ? "button" : undefined} className={onClick ? "metric metric-clickable" : "metric"} onClick={onClick}>
      <span>{label}</span>
      <strong>{value}</strong>
    </Tag>
  );
}

function Info({ label, text, visual, wide = false, highlightSimple = false, word = "" }) {
  return (
    <div className={wide ? "info wide" : "info"}>
      <span>{label}</span>
      {visual ? (
        <div className="trick-content">
          <strong>{visual}</strong>
          <p>{text}</p>
        </div>
      ) : (
        <p>{highlightSimple ? <HighlightedSimple text={text} word={word} /> : text}</p>
      )}
    </div>
  );
}

function StudyPlaybackControls({
  autoSpeak,
  setAutoSpeak,
  speakCurrent,
  autoNext,
  setAutoNext,
  secondsPerWord,
  setSecondsPerWord,
  remainingText,
  compact = false,
}) {
  return (
    <div className={compact ? "study-playback-controls compact" : "study-playback-controls"}>
      <button type="button" className="icon-control speak-icon-btn" onClick={speakCurrent} aria-label="Speak current word" title="Speak current word">
        {"\uD83D\uDD0A"}
      </button>
      <label className={autoSpeak ? "auto-speak-control active" : "auto-speak-control"} title="Auto speak on word change">
        <input type="checkbox" checked={autoSpeak} onChange={event => setAutoSpeak(event.target.checked)} />
        <span>Auto</span>
      </label>
      <div className="top-timer-control">
        <strong>{secondsPerWord}s</strong>
        {remainingText && <small>{remainingText}</small>}
        <input
          type="range"
          min="5"
          max="120"
          step="5"
          value={secondsPerWord}
          onChange={event => setSecondsPerWord(Number(event.target.value))}
          aria-label="Seconds per word"
        />
      </div>
      <button type="button" className={autoNext ? "timer-icon-btn running" : "timer-icon-btn"} onClick={() => setAutoNext(value => !value)} aria-label={autoNext ? "Pause auto next" : "Start auto next"} title={autoNext ? "Pause auto next" : "Start auto next"}>
        {autoNext ? "Pause" : "Start"}
      </button>
    </div>
  );
}

function GraphStudyPanel({
  graphRef,
  graphWrapRef,
  graphSize,
  graphData,
  graphNodeIds,
  graphRelations,
  setGraphRelations,
  graphMemoryCluster,
  setGraphMemoryCluster,
  memoryClusters,
  graphSearch,
  setGraphSearch,
  graphNeighborsOnly,
  setGraphNeighborsOnly,
  graphHideWeakLinks,
  setGraphHideWeakLinks,
  graphSelectedWord,
  selectedGraphDetail,
  selectedSynonymTerms,
  graphLegendGroups,
  graphPathStart,
  setGraphPathStart,
  graphPathEnd,
  setGraphPathEnd,
  graphPath,
  graphPathSet,
  graphPathLinkSet,
  weakWords,
  learned,
  selectGraphNode,
  moveGraphBranchWithNode,
  saveGraphDragPositions,
  focusGraphNeighborhood,
  focusSelectedCluster,
  studySelectedCluster,
  pinSelectedGraphNode,
  showGraphPath,
  resetGraphView,
  openGraphFilters,
  openGraphMenu,
  onNextWord,
  onPreviousWord,
  canSwipeWords,
  playbackControls,
}) {
  const weakWordSet = useMemo(() => new Set(weakWords), [weakWords]);
  const learnedSet = useMemo(() => new Set(learned), [learned]);
  const detailSwipeStartRef = useRef(null);

  const handleDetailTouchStart = (event) => {
    if (!canSwipeWords || event.touches.length !== 1) return;
    const touch = event.touches[0];
    detailSwipeStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleDetailTouchEnd = (event) => {
    const start = detailSwipeStartRef.current;
    if (!start) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    const isHorizontalSwipe = Math.abs(deltaX) > 56 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2;

    if (isHorizontalSwipe) {
      if (deltaX < 0) onNextWord();
      else onPreviousWord();
    }

    detailSwipeStartRef.current = null;
  };

  const drawNode = (node, ctx, globalScale) => {
    const isSelected = node.id === graphSelectedWord;
    const isTerm = node.isSynonymTerm;
    const isSynonymMatch = node.isSynonymMatch;
    const isWeak = weakWordSet.has(node.id);
    const isLearned = learnedSet.has(node.id);
    const isPath = graphPathSet.has(node.id);
    const isExpanded = node.isExpandedGraphNode;
    const isCurrentBranch = node.isCurrentBranchNode;
    const isInactive = node.isGraphInactive || (graphNeighborsOnly && !isCurrentBranch);
    const radius = isSelected ? 11 : isTerm || isSynonymMatch ? 7 : isCurrentBranch ? 6.8 : isExpanded ? 5.2 : isPath ? 6 : isWeak ? 5.5 : 4.5;
    const color = isTerm ? "#facc15" : GROUP_COLORS[node.mainGroup] || "#94a3b8";

    ctx.save();
    if (isInactive) ctx.globalAlpha = isExpanded ? 0.18 : 0.08;
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();

    if (isWeak || isSelected || isPath || isLearned) {
      ctx.lineWidth = isSelected ? 3 : 1.8;
      ctx.strokeStyle = isSelected ? "#facc15" : isPath ? "#fde68a" : isWeak ? "#ef4444" : "rgba(255,255,255,0.55)";
      ctx.stroke();
    }
    ctx.restore();

    if ((globalScale > 1.15 && !isInactive) || isSelected || isPath || isTerm || isSynonymMatch || isCurrentBranch) {
      const label = node.word;
      const fontSize = 12 / globalScale;
      if (!isSelected && !isPath && !isTerm && !isSynonymMatch && !isCurrentBranch && fontSize < 3.5) return;
      const isDark = document.documentElement.classList.contains("dark-theme");
      ctx.save();
      if (isInactive) ctx.globalAlpha = 0.18;
      ctx.font = `800 ${fontSize}px Inter, Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      const textWidth = ctx.measureText(label).width;
      const labelY = node.y + radius + 4 / globalScale;
      ctx.fillStyle = isDark ? "rgba(15, 23, 42, 0.76)" : "rgba(255, 255, 255, 0.82)";
      const padX = 4 / globalScale;
      const padY = 2 / globalScale;
      const boxHeight = fontSize + padY * 2;
      const boxWidth = textWidth + padX * 2;
      ctx.beginPath();
      ctx.roundRect(node.x - boxWidth / 2, labelY - padY, boxWidth, boxHeight, 5 / globalScale);
      ctx.fill();
      ctx.fillStyle = isDark ? "rgba(229, 237, 251, 0.95)" : "rgba(15, 23, 42, 0.92)";
      ctx.fillText(label, node.x, labelY);
      ctx.restore();
    }
  };

  const paintPointerArea = (node, color, ctx) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.isSynonymTerm ? 12 : 9, 0, 2 * Math.PI, false);
    ctx.fill();
  };

  return (
    <div className="graph-study panel">
      <div className="graph-toolbar">
        <div className="graph-toolbar-title">
          <p className="eyebrow">SSC PYQ Vocab</p>
          <h2>Study graph</h2>
        </div>
        <div className="graph-top-controls">
          <button type="button" className="graph-menu-button" onClick={openGraphMenu} aria-label="Open menu">&#9776;</button>
          <label className="graph-search-control">
            <span>Search</span>
            <input value={graphSearch} onChange={event => setGraphSearch(event.target.value)} className="input" placeholder="Search word or synonym..." />
          </label>
          <label className="graph-cluster-control">
            <span>Cluster</span>
            <select value={graphMemoryCluster} onChange={event => setGraphMemoryCluster(event.target.value)} className="input">
              {memoryClusters.map(cluster => <option key={cluster} value={cluster}>{cluster === "All" ? "All memory clusters" : cluster}</option>)}
            </select>
          </label>
        </div>
        <div className="graph-actions">
          <button type="button" onClick={openGraphFilters}>Filters</button>
          <button type="button" onClick={resetGraphView}>Reset graph</button>
        </div>
        {playbackControls}
      </div>

      <div className="graph-filter-grid graph-filter-grid-hidden">
        <label>
          <span>Search node</span>
          <input value={graphSearch} onChange={event => setGraphSearch(event.target.value)} className="input" placeholder="Search word or synonym..." />
        </label>
        <label>
          <span>Memory cluster</span>
          <select value={graphMemoryCluster} onChange={event => setGraphMemoryCluster(event.target.value)} className="input">
            {memoryClusters.map(cluster => <option key={cluster} value={cluster}>{cluster === "All" ? "All memory clusters" : cluster}</option>)}
          </select>
        </label>
      </div>

      <div className="graph-help graph-help-compact">
        <strong>How this view works</strong>
        <span>Click a word to see its direct synonym/meaning clues from the Simple field. Use group links only when you want broad cluster revision.</span>
      </div>

      <div className="graph-relation-row graph-relation-row-hidden">
        <button
          type="button"
          className="graph-preset-button"
          onClick={() => {
            setGraphRelations(DEFAULT_GRAPH_RELATIONS);
            setGraphNeighborsOnly(Boolean(selectedGraphDetail));
            setExpandedGraphWords(selectedGraphDetail ? [selectedGraphDetail.word] : []);
          }}
        >
          Synonym focus
        </button>
        <button
          type="button"
          className="graph-preset-button"
          onClick={() => {
            setGraphRelations({ ...DEFAULT_GRAPH_RELATIONS, subGroup: true, memoryCluster: true, mainGroup: true });
            setGraphNeighborsOnly(false);
            setExpandedGraphWords([]);
          }}
        >
          Group clusters
        </button>
      </div>

      <div className="graph-layout">
        <div className="graph-canvas-wrap" ref={graphWrapRef}>
          <ForceGraph2D
            ref={graphRef}
            graphData={graphData}
            width={graphSize.width}
            height={graphSize.height}
            backgroundColor="rgba(0,0,0,0)"
            nodeCanvasObject={drawNode}
            nodePointerAreaPaint={paintPointerArea}
            nodeLabel={node => `${node.word}<br/>${node.simple}<br/><b>${node.mainGroup}</b>`}
            linkWidth={link => graphPathLinkSet.has(relationKey(linkId(link.source), linkId(link.target))) ? 3 : link.isCurrentBranchLink ? 3.2 : link.isExpandedGraphLink ? 1.2 : Math.max(0.35, link.strength / 7)}
            linkColor={link => graphPathLinkSet.has(relationKey(linkId(link.source), linkId(link.target))) ? "#facc15" : link.isCurrentBranchLink ? "rgba(250, 204, 21, 0.95)" : link.isExpandedGraphLink ? "rgba(250, 204, 21, 0.16)" : link.isGraphInactive ? "rgba(148, 163, 184, 0.045)" : link.relationType === "directSynonym" ? "rgba(250, 204, 21, 0.14)" : "rgba(148, 163, 184, 0.08)"}
            linkDirectionalParticles={link => graphPathLinkSet.has(relationKey(linkId(link.source), linkId(link.target))) ? 2 : 0}
            cooldownTicks={graphNeighborsOnly ? 12 : 45}
            d3AlphaDecay={0.075}
            d3VelocityDecay={0.68}
            warmupTicks={graphNeighborsOnly ? 2 : 12}
            onNodeClick={selectGraphNode}
            onNodeDrag={moveGraphBranchWithNode}
            onNodeDragEnd={saveGraphDragPositions}
            onNodeDoubleClick={focusGraphNeighborhood}
          />
        </div>

        <aside
          className="graph-detail"
          onTouchStart={handleDetailTouchStart}
          onTouchEnd={handleDetailTouchEnd}
          onTouchCancel={() => {
            detailSwipeStartRef.current = null;
          }}
        >
          {selectedGraphDetail ? (
            <>
              <p className="eyebrow">Selected word</p>
              <div className="graph-title-row">
                {selectedGraphDetail.visual && <div className="graph-detail-visual">{selectedGraphDetail.visual}</div>}
                <div>
                  <h2>{selectedGraphDetail.word}</h2>
                  {selectedGraphDetail.trick && <span className="graph-detail-trick">{selectedGraphDetail.trick}</span>}
                  {selectedGraphDetail.telugu && <strong className="graph-detail-telugu">{selectedGraphDetail.telugu}</strong>}
                </div>
              </div>
              <div className="synonym-chip-list">
                <span>Synonyms / simple meaning</span>
                <div>
                  {selectedSynonymTerms.length ? selectedSynonymTerms.map(term => (
                    <b key={term}>{displayTerm(term)}</b>
                  )) : <em>No direct synonym terms found.</em>}
                </div>
              </div>
              <p><HighlightedSimple text={selectedGraphDetail.simple} word={selectedGraphDetail.word} /></p>
              <small>{selectedGraphDetail.mainGroup}</small>
            </>
          ) : (
            <div className="empty-graph-detail">
              <p className="eyebrow">Select a node</p>
              <h2>Click any word</h2>
              <span>The right panel will show direct synonyms from the Simple meaning and draw them around the selected word.</span>
            </div>
          )}
        </aside>
      </div>

      <div className="graph-legend">
        {graphLegendGroups.map(group => (
          <span key={group}><i style={{ background: GROUP_COLORS[group] || "#94a3b8" }} />{GROUP_LABELS[GROUPS.find(item => item.mainGroup === group)?.visualFamily] || group}</span>
        ))}
        <span><i className="weak-ring" />Weak words have red rings</span>
      </div>
    </div>
  );
}

function ProgressRow({ label, value, detail, percent, tone = "blue" }) {
  return (
    <div className="progress-row">
      <div>
        <strong>{label}</strong>
        <span>{detail}</span>
      </div>
      <b>{value}</b>
      <div className="track"><div className={tone} style={{ width: `${percent}%` }} /></div>
    </div>
  );
}

function WordGroup({ title, words, empty, onOpen }) {
  return (
    <button type="button" className="word-group-card" onClick={onOpen}>
      <h3>{title}<span>Study</span></h3>
      <div className="pill-list">
        {words.length ? words.map(w => <span key={w}>{w}</span>) : <p>{empty}</p>}
      </div>
    </button>
  );
}

const QueueItem = React.memo(function QueueItem({ item, realIndex, isCurrent, setIndex, activeRef }) {
  return (
    <button
      ref={activeRef}
      className={isCurrent ? "current" : ""}
      onClick={() => setIndex(realIndex)}
    >
      <span>{item.word}</span>
      <small>{item.bookNo}</small>
    </button>
  );
});
