import React, { useEffect, useMemo, useRef, useState, useTransition } from "react";

import vocab from "./vocabData";
import { GROUPS, buildGroupingSummary, enrichedVocab, enrichVocabulary } from "./vocabGroups";
import "./App.css";

const pdfRecheckPatch = [];

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
  const [viewMode, setViewMode] = useState("flashcard");
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

  useEffect(() => {
    document.documentElement.classList.toggle("dark-theme", theme === "dark");
    document.documentElement.classList.toggle("light-theme", theme === "light");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === "dark" ? "light" : "dark"));

  const chapters = useMemo(() => ["All", ...new Set(allWords.map(v => v.chapter))], [allWords]);
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
      (v.word.toLowerCase().includes(q) ||
        v.simple.toLowerCase().includes(q) ||
        v.hindi.includes(query) ||
        v.telugu.includes(query))
    );
  }, [query, chapter, mainGroup, subGroup, studySource]);

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
  ].filter(Boolean);
  const previewIndex = filtered.length && swipeDirection
    ? (index + (swipeDirection < 0 ? 1 : -1) + filtered.length) % filtered.length
    : index;
  const previewCard = filtered.length && swipeDirection ? filtered[previewIndex] : null;
  const quizPool = useMemo(() => {
    const source = chapter === "All" ? allWords : allWords.filter(v => v.chapter === chapter);
    return source.filter(v => !learned.includes(v.word));
  }, [allWords, chapter, learned]);

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
  };

  function updateFilters(updater) {
    startFilterTransition(() => {
      updater();
      setIndex(0);
    });
  }

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
    <div className="app-shell">
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
          <section className="study-layout">
            <div className="study-main">
              {studyFilter !== "all" && (
                <div className="study-focus-bar">
                  <div>
                    <p className="eyebrow">Focused study</p>
                    <strong>{studyFilterTitle}</strong>
                  </div>
                  <button type="button" onClick={() => openStudySet("all")}>All words</button>
                </div>
              )}

              <div className="search-row">
                <input
                  value={query}
                  onChange={handleSearchChange}
                  placeholder="Search word, meaning, Telugu..."
                  className="input"
                />
                <button type="button" className="settings-button" onClick={() => setSettingsOpen(true)} aria-label="Open study settings">⚙</button>
                <div className="speech-controls">
                  <button type="button" className="speak-btn" onClick={speakCurrent}>Speak</button>
                  <select value={wordVoice} onChange={e => setWordVoice(e.target.value)} className="voice-select" aria-label="Word voice">
                    <option value="">Word: Indian male</option>
                    {voices.map(voice => (
                      <option key={`word-${voice.name}-${voice.lang}`} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                  </select>
                  <select value={teluguVoice} onChange={e => setTeluguVoice(e.target.value)} className="voice-select" aria-label="Telugu meaning voice">
                    <option value="">Telugu: female</option>
                    {voices.map(voice => (
                      <option key={`telugu-${voice.name}-${voice.lang}`} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                  </select>
                  <label className="speak-toggle">
                    <input type="checkbox" checked={autoSpeak} onChange={e => setAutoSpeak(e.target.checked)} />
                    Auto
                  </label>
                </div>
              </div>

              <section className={isFilterPending ? "focus-toolbar is-loading" : "focus-toolbar"}>
                <div className="focus-summary">
                  <div>
                    <p className="eyebrow">Study focus</p>
                    <h2>{isFilterPending ? "Updating..." : `${filtered.length} words ready`}</h2>
                  </div>
                  <div className="view-toggle">
                    <button type="button" className={viewMode === "flashcard" ? "active" : ""} onClick={() => setViewMode("flashcard")}>Cards</button>
                    <button type="button" className={viewMode === "list" ? "active" : ""} onClick={() => setViewMode("list")}>List</button>
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
              </section>

              {settingsOpen && (
                <div className="mobile-settings" role="dialog" aria-modal="true" aria-label="Study settings">
                  <div className="mobile-settings-card">
                    <div className="settings-header">
                      <div>
                        <p className="eyebrow">Study settings</p>
                        <h2>Controls</h2>
                      </div>
                      <button type="button" onClick={() => setSettingsOpen(false)} aria-label="Close settings">×</button>
                    </div>

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
                      <span>Speech</span>
                      <button type="button" className="speak-btn" onClick={speakCurrent}>Speak current word</button>
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

                    <div className="setting-group">
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
                    </div>
                  </div>
                </div>
              )}

              {filtered.length && viewMode === "list" ? (
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

              <div className="auto-next-panel">
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
              </div>
            </div>

            <aside className="queue panel">
              <p className="eyebrow">Study queue</p>
              <h2>{filtered.length} cards</h2>
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
