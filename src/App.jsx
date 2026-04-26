import React, { useEffect, useMemo, useRef, useState } from "react";

import vocab from "./vocab.json";
import "./App.css";

const pdfRecheckPatch = [];

function loadArray(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function getOptions(correct, source = vocab) {
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
    if (name.includes("india") || name.includes("indian")) score += 20;
    if (name.includes("male")) score += 10;
    if (name.includes("female")) score -= 20;
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

function formatDuration(totalSeconds) {
  const seconds = Math.max(Math.round(totalSeconds), 0);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours) return `${hours}h ${minutes}m`;
  if (minutes) return `${minutes}m ${remainingSeconds}s`;
  return `${remainingSeconds}s`;
}

export default function App() {
  const allWords = useMemo(() => {
    const seen = new Map();
    [...vocab, ...pdfRecheckPatch].forEach(item => {
      const key = item.bookNo ? String(item.bookNo) : item.word.toLowerCase();
      if (!seen.has(key)) seen.set(key, item);
    });
    return Array.from(seen.values()).sort((a, b) => (a.bookNo || 99999) - (b.bookNo || 99999));
  }, []);
  const today = new Date().toDateString();
  const [mode, setMode] = useState("learn");
  const [studyFilter, setStudyFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [chapter, setChapter] = useState("All");
  const [index, setIndex] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [quiz, setQuiz] = useState(vocab[0]);
  const [options, setOptions] = useState(getOptions(vocab[0], vocab));
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [learned, setLearned] = useState(() => loadArray("sscLearnedWords"));
  const [weakWords, setWeakWords] = useState(() => loadArray("sscWeakWords"));
  const [streak, setStreak] = useState(() => Number(localStorage.getItem("sscStreak") || "0"));
  const [lastStudy, setLastStudy] = useState(() => localStorage.getItem("sscLastStudy") || "");
  const [autoSpeak, setAutoSpeak] = useState(() => localStorage.getItem("sscAutoSpeak") !== "false");
  const [voices, setVoices] = useState([]);
  const [wordVoice, setWordVoice] = useState(() => localStorage.getItem("sscWordVoice") || "");
  const [teluguVoice, setTeluguVoice] = useState(() => localStorage.getItem("sscTeluguVoice") || "");
  const [autoNext, setAutoNext] = useState(false);
  const [secondsPerWord, setSecondsPerWord] = useState(() => Number(localStorage.getItem("sscSecondsPerWord") || "10"));
  const activeQueueRef = useRef(null);
  const speechQueueRef = useRef([]);

  const chapters = useMemo(() => ["All", ...new Set(allWords.map(v => v.chapter))], [allWords]);

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

  const markLearned = () => {
    markStudiedToday();
    if (!learned.includes(current.word)) setLearned([...learned, current.word]);
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
      (v.word.toLowerCase().includes(q) ||
        v.simple.toLowerCase().includes(q) ||
        v.hindi.includes(query) ||
        v.telugu.includes(query))
    );
  }, [query, chapter, studySource]);

  const current = filtered.length ? filtered[index % filtered.length] : vocab[0];
  const doneCount = filtered.length ? index + 1 : 0;
  const leftCount = Math.max(filtered.length - doneCount, 0);
  const estimatedTotalTime = formatDuration(filtered.length * secondsPerWord);
  const estimatedRemainingTime = formatDuration(leftCount * secondsPerWord);

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

  const getPreferredVoice = (type) => {
    const savedVoice = type === "word" ? wordVoice : teluguVoice;
    const exact = voices.find(v => v.name === savedVoice);
    if (exact) return exact;

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
    utterance.rate = type === "telugu" ? 0.82 : 0.86;
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
  const quizPool = useMemo(() => {
    const source = chapter === "All" ? allWords : allWords.filter(v => v.chapter === chapter);
    return source.filter(v => !learned.includes(v.word));
  }, [allWords, chapter, learned]);

  const openStudySet = (filter) => {
    setStudyFilter(filter);
    setMode("learn");
    setChapter("All");
    setQuery("");
    setIndex(0);
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
              <select value={chapter} onChange={e => { setChapter(e.target.value); setIndex(0); }} className="input">
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
                <select value={chapter} onChange={e => { setChapter(e.target.value); setIndex(0); }} className="input chapter-input">
                  {chapters.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input
                  value={query}
                  onChange={e => { setQuery(e.target.value); setIndex(0); }}
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
                      <select value={chapter} onChange={e => { setChapter(e.target.value); setIndex(0); }} className="input">
                        {chapters.map(c => <option key={c} value={c}>{c}</option>)}
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

              {filtered.length ? (
              <div className="card-carousel">
                <button className="carousel-zone carousel-prev" onClick={previousWord} aria-label="Previous word"><span>←</span></button>
                <article className="flashcard">
                  <div className="card-meta">
                    <span>Card {filtered.length ? index + 1 : 0} of {filtered.length}</span>
                    <span>{current.chapter}</span>
                    {learned.includes(current.word) && <span className="learned">Learned</span>}
                  </div>
                  <div className="visual">{current.visual}</div>
                  <h2>{current.word}</h2>
                  <div className="answer-grid">
                    <Info label="Simple" text={current.simple} />
                    {/* <Info label="Hindi" text={current.hindi} /> */}
                    <Info label="Telugu" text={current.telugu} />
                    <Info label="Memory trick" text={current.trick} wide />
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
                {filtered.map((item, realIndex) => (
                  <QueueItem
                    key={`${item.bookNo}-${item.word}`}
                    item={item}
                    realIndex={realIndex}
                    isCurrent={realIndex === index}
                    setIndex={setIndex}
                    activeRef={realIndex === index ? activeQueueRef : null}
                  />
                ))}
              </div>
            </aside>
          </section>
        ) : (
          <section className="panel quiz-panel">
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
                    <div className="visual small">{quiz.visual}</div>
                    <h2>{quiz.simple}</h2>
                  </div>
                  <div className="quiz-meta">
                    <select value={chapter} onChange={e => { setChapter(e.target.value); setIndex(0); }} className="input quiz-filter" aria-label="Quiz chapter">
                      {chapters.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <div className="score-pill">{score.correct}/{score.total}</div>
                  </div>
                </div>

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

function Info({ label, text, wide = false }) {
  return (
    <div className={wide ? "info wide" : "info"}>
      <span>{label}</span>
      <p>{text}</p>
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
