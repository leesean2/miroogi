import { daysSince } from '../data/store';
import TopBar from './TopBar';

// 진행 중인 실험 카드. 저장된 시작 시각으로 경과일을 계산하고,
// 7일 실험이므로 오늘 도트는 0~6으로 제한한다. 미래 도트는 비활성.
function ActiveExperimentCard({ exp, onToggleDay }) {
  const elapsed = daysSince(exp.startedAt);
  const dayIdx = Math.min(elapsed, 6);
  return (
    <div className="exp-card active">
      <span className="mini sage">D+{elapsed} · 이번 주</span>
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

// 패턴에서 제안된 실험 카드. 시작하거나 다음으로 미룰 수 있다.
function SuggestionCard({ suggestion, onStart, onDismiss }) {
  return (
    <div className="exp-card">
      <span className="mini clay">제안</span>
      <h3>{suggestion.title}</h3>
      <p className="sub">{suggestion.reason}</p>
      <div className="exp-actions">
        <button className="btn primary" onClick={() => onStart(suggestion)}>실험 시작</button>
        <button className="btn" onClick={() => onDismiss(suggestion.id)}>다음에</button>
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
        <p className="tag-label tag-label-top">진행 중</p>
        {active.length === 0 && <p className="empty">진행 중인 실험이 없어요.</p>}
        {active.map((e) => (
          <ActiveExperimentCard key={e.id} exp={e} onToggleDay={onToggleDay} />
        ))}

        {suggestions.length > 0 && (
          <>
            <p className="tag-label section-gap">패턴에서 제안됨</p>
            {suggestions.map((s) => (
              <SuggestionCard key={s.id} suggestion={s} onStart={onStart} onDismiss={onDismiss} />
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
