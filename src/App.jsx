import { useEffect, useState } from 'react';
import LogTab from './components/LogTab';
import PatternTab from './components/PatternTab';
import ExperimentTab from './components/ExperimentTab';
import Onboarding from './components/Onboarding';
import { DEFAULT_CATEGORIES } from './data/store';
import { loadState, saveState } from './data/db';

// 값이 바뀔 때마다 IndexedDB에 저장. ready 이전(로드 완료 전)에는 저장하지 않아
// 시드 데이터가 저장된 값을 덮어쓰는 걸 막는다.
function usePersist(key, value, ready) {
  useEffect(() => {
    if (ready) saveState(key, value);
  }, [key, value, ready]);
}

const TABS = [
  ['log', '기록'],
  ['pattern', '패턴'],
  ['exp', '실험'],
];

export default function App() {
  const [tab, setTab] = useState('log');
  const [ready, setReady] = useState(false);

  const [onboarded, setOnboarded] = useState(false);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [customReasons, setCustomReasons] = useState([]);
  const [logs, setLogs] = useState([]);
  const [experiments, setExperiments] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // 첫 마운트 시 IndexedDB에서 저장된 상태를 불러온다.
  // 저장된 값이 없는 키(첫 실행)는 초기값을 유지한다.
  useEffect(() => {
    let cancelled = false;
    loadState().then((saved) => {
      if (cancelled) return;
      if (saved.onboarded !== undefined) setOnboarded(saved.onboarded);
      if (saved.categories !== undefined) setCategories(saved.categories);
      if (saved.customReasons !== undefined) setCustomReasons(saved.customReasons);
      if (saved.logs !== undefined) setLogs(saved.logs);
      if (saved.experiments !== undefined) setExperiments(saved.experiments);
      if (saved.suggestions !== undefined) setSuggestions(saved.suggestions);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  usePersist('onboarded', onboarded, ready);
  usePersist('categories', categories, ready);
  usePersist('customReasons', customReasons, ready);
  usePersist('logs', logs, ready);
  usePersist('experiments', experiments, ready);
  usePersist('suggestions', suggestions, ready);

  // ── 기록 ──
  const addLog = ({ name, category, reason, custom }) => {
    setLogs((l) => [
      { id: `log-${Date.now()}`, name, category, reason: reason || null, custom, ts: Date.now() },
      ...l,
    ]);
    if (custom && reason && !customReasons.includes(reason)) {
      setCustomReasons((r) => [...r, reason]);
    }
  };

  const addCategory = (name) => {
    setCategories((c) => (c.includes(name) ? c : [...c, name]));
  };

  // ── 실험 ──
  const makeExperimentFromObservation = (observation) => {
    setSuggestions((s) => [
      {
        id: `sug-${Date.now()}`,
        title: '그 요일의 일정을 가볍게 잡아보기',
        reason: `${observation}. 한 주만 가볍게 실험해볼까요?`,
      },
      ...s.filter((x) => !x.reason.startsWith(observation)),
    ]);
    setTab('exp');
  };

  const startExperiment = (sug) => {
    setExperiments((e) => [
      {
        id: `exp-${Date.now()}`,
        title: sug.title,
        origin: sug.reason,
        startedAt: Date.now(),
        days: Array(7).fill(false),
        status: 'active',
      },
      ...e,
    ]);
    setSuggestions((s) => s.filter((x) => x.id !== sug.id));
  };

  const dismissSuggestion = (id) => setSuggestions((s) => s.filter((x) => x.id !== id));

  const toggleExpDay = (expId, dayIdx) => {
    setExperiments((exps) =>
      exps.map((e) => {
        if (e.id !== expId || e.status !== 'active') return e;
        const days = [...e.days];
        days[dayIdx] = !days[dayIdx];
        return { ...e, days };
      }),
    );
  };

  if (!ready) return null;

  if (!onboarded) {
    return (
      <div className="app-root">
        <Onboarding onStart={() => setOnboarded(true)} />
      </div>
    );
  }

  return (
    <div className="app-root">
      {tab === 'log' && (
        <LogTab
          logs={logs}
          addLog={addLog}
          categories={categories}
          addCategory={addCategory}
          customReasons={customReasons}
        />
      )}
      {tab === 'pattern' && (
        <PatternTab
          logs={logs}
          categories={categories}
          onMakeExperiment={makeExperimentFromObservation}
        />
      )}
      {tab === 'exp' && (
        <ExperimentTab
          experiments={experiments}
          suggestions={suggestions}
          onStart={startExperiment}
          onDismiss={dismissSuggestion}
          onToggleDay={toggleExpDay}
        />
      )}

      <nav className="navbar">
        {TABS.map(([key, label]) => (
          <button
            key={key}
            className={`navitem ${tab === key ? 'active' : ''}`}
            onClick={() => setTab(key)}
          >
            <div className={`nd ${tab === key ? '' : 'off'}`} />
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
