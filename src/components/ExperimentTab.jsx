import { daysSince } from '../data/store';
import TopBar from './TopBar';

// 진행 중인 실험 카드. 저장된 시작 시각으로 경과일을 계산하고,
// 7일 실험이므로 오늘 도트는 0~6으로 제한한다. 미래 도트는 비활성.
function ActiveExperimentCard({ exp, onToggleDay }) {
  const elapsed = daysSince(exp.startedAt);
  const dayIdx = Math.min(elapsed, 6);
  return (
    <div className="exp-card active">
      <span className="mini" style={{ background: 'var(--sage)' }}>
        D+{elapsed} · 이번 주
      </span>
      <h3>{exp.title}</h3>
      <p className="sub">{exp.origin} 성공/실패가 아니라 그냥 해봤는지만 체크해요.</p>
      <div className="week-dots">
        {exp.days.map((done, i) => {
          const isTodayDot = i === dayIdx;
          const isFuture = i > dayIdx;
          return (
            <button
              key={i}
              className={`wd ${done ? 'done' : ''} ${isTodayDot && !done ? 'today' : ''}`}
              disabled={isFuture}
              onClick={() => onToggleDay(exp.id, i)}
              title={isFuture ? '' : done ? '해봤어요' : '탭해서 체크'}
            />
          );
        })}
      </div>
    </div>
  );
}

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
      <TopBar title="실험" sub={`진행 중 ${active.length}건`} />
      <div className="content">
        <p className="tag-label" style={{ marginTop: 10 }}>진행 중</p>
        {active.length === 0 && <p className="empty">진행 중인 실험이 없어요.</p>}
        {active.map((e) => (
          <ActiveExperimentCard key={e.id} exp={e} onToggleDay={onToggleDay} />
        ))}

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
