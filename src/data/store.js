// 데이터 레이어: 상수 + 시간 유틸.
// 영속화는 src/data/db.js(IndexedDB, idb 라이브러리)가 담당한다.

export const CAT_COLORS = ['#7C9885', '#9B8FA6', '#B8A96A', '#8FA6B8', '#B88F8F'];

export const PRESET_REASONS = [
  '막막함',
  '에너지 부족',
  '우선순위 밀림',
  '두려움',
  '귀찮음',
  '늦잠',
];

export const DEFAULT_CATEGORIES = ['업무', '개인', '학업'];

// ── 시간 유틸 ──
export const fmtTime = (ts) => {
  const d = new Date(ts);
  const h = d.getHours();
  const ampm = h < 12 ? '오전' : '오후';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${ampm} ${h12}:${String(d.getMinutes()).padStart(2, '0')}`;
};

export const isToday = (ts) => {
  const a = new Date(ts);
  const b = new Date();
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

// 자정 기준으로 ts 이후 며칠이 지났는지 (당일이면 0)
export const daysSince = (ts) => {
  const a = new Date(ts);
  a.setHours(0, 0, 0, 0);
  const b = new Date();
  b.setHours(0, 0, 0, 0);
  return Math.round((b.getTime() - a.getTime()) / 86400000);
};

export const todayLabel = () => {
  const d = new Date();
  const w = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
  return `${d.getMonth() + 1}월 ${d.getDate()}일 ${w}요일`;
};
