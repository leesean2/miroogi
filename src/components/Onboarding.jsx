// 첫 실행 시 한 번만 보여주는 온보딩 화면.
// "시작하기"를 누르면 onboarded 플래그가 저장되어 다시 나타나지 않는다.

const STEPS = [
  ['기록', '미룬 일을 판단 없이 그대로 적어요. 이유는 적어도, 안 적어도 괜찮아요.'],
  ['패턴', '기록이 쌓이면 어떤 요일, 어떤 이유에 자주 미루는지 보이기 시작해요.'],
  ['실험', '패턴에서 발견한 걸 일주일짜리 작은 실험으로 가볍게 시도해봐요.'],
];

export default function Onboarding({ onStart }) {
  return (
    <div className="onboarding">
      <p className="ob-eyebrow">MIROOGI</p>
      <h1 className="ob-title">
        미루는 나를,<br />미워하지 않고<br />관찰하기
      </h1>
      <p className="ob-sub">
        고치려고 다그치기 전에, 먼저 패턴을 알아차리는 것부터.
      </p>

      <div className="ob-steps">
        {STEPS.map(([title, desc], i) => (
          <div className="ob-step" key={title}>
            <span className="ob-num">{i + 1}</span>
            <div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="btn primary ob-start" onClick={onStart}>
        시작하기
      </button>
      <p className="ob-note">모든 기록은 이 기기 안에만 저장돼요.</p>
    </div>
  );
}
