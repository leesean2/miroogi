import { daysSince } from '../data/store';

export default function ExperimentTab({
  experiments,
  suggestions,
  onStart,
  onDismiss,
  onToggleDay,
}) {
  const active = experiments.filter((e) => e.status === 'active');
  const archived = experiments.filter((e) => e.status === 'archived');

  return (
    <>
      <div className="topbar">
        <h1>실험</h1>
        <p>진행 중 {active.length}건</p>
      </div>
      <div className="content">
        <p className="tag-label" style={{ marginTop: 10 }}>진행 중</p>
        {active.length === 0 && <p className="empty">진행 중인 실험이 없어요.</p>}
        {active.map((e) => {
          // 저장된 시작 시각으로 경과일 계산 (7일 실험이므로 도트는 0~6으로 제한)
          const elapsed = daysSince(e.startedAt);
          const dayIdx = Math.min(elapsed, 6);
          return (
          <div className="exp-card active" key={e.id}>
            <span className="mini" style={{ background: 'var(--sage)' }}>
              D+{elapsed} · 이번 주
            </span>
            <h3>{e.title}</h3>
            <p className="sub">{e.origin} 성공/실패가 아니라 그냥 해봤는지만 체크해요.</p>
            <div className="week-dots">
              {e.days.map((done, i) => {
                const isTodayDot = i === dayIdx;
                const isFuture = i > dayIdx;
                return (
                  <button
                    key={i}
                    className={`wd ${done ? 'done' : ''} ${isTodayDot && !done ? 'today' : ''}`}
                    disabled={isFuture}
                    onClick={() => onToggleDay(e.id, i)}
                    title={isFuture ? '' : done ? '해봤어요' : '탭해서 체크'}
                  />
                );
              })}
            </div>
          </div>
          );
        })}

        {suggestions.length > 0 && (
          <>
            <p className="tag-label section-gap">패턴에서 제안됨</p>
            {suggestions.map((s) => (
              <div className="exp-card" key={s.id}>
                <span className="mini" style={{ background: 'var(--clay)' }}>제안</span>
                <h3>{s.title}</h3>
                <p className="sub">{s.reason}</p>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button className="btn primary" onClick={() => onStart(s)}>실험 시작</button>
                  <button className="btn" onClick={() => onDismiss(s.id)}>다음에</button>
                </div>
              </div>
            ))}
          </>
        )}

        {archived.length > 0 && (
          <>
            <p className="tag-label section-gap">지난 실험</p>
            {archived.map((e) => (
              <div className="log-item" key={e.id}>
                <div>
                  <div className="name">{e.title}</div>
                  <div className="meta">{e.result}</div>
                </div>
                <span className="chip">보관됨</span>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}
