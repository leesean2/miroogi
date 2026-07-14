// 각 탭 상단의 공통 제목 영역. sub에는 날짜·건수 같은 부가 정보가 들어간다.
export default function TopBar({ title, sub }) {
  return (
    <div className="topbar">
      <h1>{title}</h1>
      <p>{sub}</p>
    </div>
  );
}
