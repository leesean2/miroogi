import { useMemo, useState } from 'react';

const DAY_NAMES = ['월', '화', '수', '목', '금', '토', '일'];
const DAY_FULL = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];
const WEEKS = 6;

export default function PatternTab({ logs, categories, onMakeExperiment }) {
  const [filter, setFilter] = useState('전체');

  const heatData = useMemo(() => {
    const filtered = filter === '전체' ? logs : logs.filter((l) => l.category === filter);
    const grid = Array.from({ length: WEEKS }, () => Array(7).fill(0));
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    filtered.forEach((l) => {
      const logDayStart = new Date(l.ts).setHours(0, 0, 0, 0);
      const diffDays = Math.floor((todayStart - logDayStart) / 86400000);
      if (diffDays < 0 || diffDays >= WEEKS * 7) return;
      const week = Math.floor(diffDays / 7);
      let dow = new Date(l.ts).getDay(); // 0=일
      dow = dow === 0 ? 6 : dow - 1; // 월=0 … 일=6
      grid[week][dow]++;
    });
    return grid;
  }, [logs, filter]);

  const maxHeat = Math.max(1, ...heatData.flat());

  const observation = useMemo(() => {
    const dowCount = Array(7).fill(0);
    heatData.forEach((week) => week.forEach((v, d) => (dowCount[d] += v)));
    const max = Math.max(...dowCount);
    if (max === 0) return null;
    return `${DAY_FULL[dowCount.indexOf(max)]}에 유독 무언가를 미루는 경향이 보여요`;
  }, [heatData]);

  return (
    <>
      <div className="topbar">
        <h1>패턴</h1>
        <p>최근 {WEEKS}주</p>
      </div>
      <div className="content">
        <div className="filter-row">
          {['전체', ...categories].map((c) => (
            <button key={c} className={`filter ${filter === c ? 'on' : ''}`} onClick={() => setFilter(c)}>
              {c}
            </button>
          ))}
        </div>
        <p className="heat-caption">색이 짙을수록 그 요일에<br />회피가 잦았어요 · 위가 최근 주</p>
        <div className="heatmap">
          {DAY_NAMES.map((d) => (
            <div key={d} className="daylabel">{d}</div>
          ))}
          {heatData.map((week, w) =>
            week.map((v, d) => (
              <div
                key={`${w}-${d}`}
                className="cell"
                style={{
                  background: `rgba(124,152,133,${v === 0 ? 0.04 : Math.min(0.15 + (v / maxHeat) * 0.7, 0.85)})`,
                }}
                title={v > 0 ? `${v}건` : ''}
              />
            )),
          )}
        </div>
        {observation && (
          <div className="obs-card">
            <span className="k">관찰</span>
            <p>{observation}</p>
            <div style={{ marginTop: 12 }}>
              <button className="btn primary" onClick={() => onMakeExperiment(observation)}>
                실험으로 만들기 →
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
