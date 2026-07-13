import { useState } from 'react';
import { CAT_COLORS, PRESET_REASONS, fmtTime, isToday, todayLabel } from '../data/store';

export default function LogTab({ logs, addLog, categories, addCategory, customReasons }) {
  const [taskName, setTaskName] = useState('');
  const [selCat, setSelCat] = useState(categories[0]);
  const [selReason, setSelReason] = useState(null);
  const [showCustomReason, setShowCustomReason] = useState(false);
  const [customReasonText, setCustomReasonText] = useState('');
  const [showNewCat, setShowNewCat] = useState(false);
  const [newCatText, setNewCatText] = useState('');

  const allReasons = [...PRESET_REASONS, ...customReasons];
  const todayLogs = logs.filter((l) => isToday(l.ts));

  const submit = () => {
    if (!taskName.trim()) return;
    const isCustom = showCustomReason && !!customReasonText.trim();
    addLog({
      name: taskName.trim(),
      category: selCat,
      reason: isCustom ? customReasonText.trim() : selReason,
      custom: isCustom,
    });
    setTaskName('');
    setSelReason(null);
    setCustomReasonText('');
    setShowCustomReason(false);
  };

  const submitCategory = () => {
    const t = newCatText.trim();
    if (t) {
      addCategory(t);
      setSelCat(t);
    }
    setNewCatText('');
    setShowNewCat(false);
  };

  return (
    <>
      <div className="topbar">
        <h1>오늘</h1>
        <p>{todayLabel()}</p>
      </div>
      <div className="content">
        <p className="prompt">오늘 미룬 일이<br />있었나요?</p>

        <div className="field-row">
          <input
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="할 일을 입력하세요"
          />
          <button className="add-btn" onClick={submit} disabled={!taskName.trim()}>+</button>
        </div>

        <p className="tag-label">어떤 영역인가요</p>
        <div className="tags">
          {categories.map((c, i) => (
            <button key={c} className={`tag ${selCat === c ? 'on' : ''}`} onClick={() => setSelCat(c)}>
              <span className="dot-cat" style={{ background: CAT_COLORS[i % CAT_COLORS.length] }} />
              {c}
            </button>
          ))}
          <button className="tag dashed" onClick={() => setShowNewCat(!showNewCat)}>+ 새 카테고리</button>
        </div>
        {showNewCat && (
          <div className="inline-input">
            <input
              autoFocus
              value={newCatText}
              onChange={(e) => setNewCatText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitCategory()}
              placeholder="카테고리 이름"
            />
            <button onClick={submitCategory}>추가</button>
          </div>
        )}

        <p className="tag-label">왜 미뤘나요 (선택)</p>
        <div className="tags">
          {allReasons.map((r) => (
            <button
              key={r}
              className={`tag ${selReason === r && !showCustomReason ? 'on' : ''}`}
              onClick={() => {
                setSelReason(selReason === r ? null : r);
                setShowCustomReason(false);
              }}
            >
              {r}
            </button>
          ))}
          <button
            className="tag dashed"
            onClick={() => {
              setShowCustomReason(!showCustomReason);
              setSelReason(null);
            }}
          >
            ✎ 직접 입력
          </button>
        </div>
        {showCustomReason && (
          <div className="inline-input">
            <input
              autoFocus
              value={customReasonText}
              onChange={(e) => setCustomReasonText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              placeholder="지금 마음을 그대로 적어보세요"
            />
          </div>
        )}

        <div className="divider" />
        {todayLogs.length === 0 ? (
          <p className="empty">아직 기록이 없어요.<br />미룬 일이 없다면, 그것도 괜찮은 하루예요.</p>
        ) : (
          todayLogs.map((l) => (
            <div className="log-item" key={l.id}>
              <div>
                <div className="name">{l.name}</div>
                <div className="meta">{fmtTime(l.ts)} · {l.category}</div>
              </div>
              {l.reason && (
                <span className={`chip ${l.custom ? 'custom' : ''}`}>
                  {l.custom ? `✎ ${l.reason}` : l.reason}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}
