# 미루기 패턴 트래커 (MIROOGI)

할 일 "완료"가 아니라 "회피"를 기록하는 앱. 평가가 아니라 관찰.
점수·스트릭·비교 없음. 모든 기록은 기기 안(IndexedDB)에만 저장된다.

**배포 주소: https://miroogi.vercel.app** (PWA — 홈 화면에 설치 가능)

## 실행

```bash
npm install
npm run dev      # 개발 서버 (localhost:5173)
npm run build    # 프로덕션 빌드 → dist/
npm run preview  # 빌드 결과 로컬 확인 (localhost:4173)
npm run lint     # oxlint
```

## 구조

```
src/
  main.jsx                # 엔트리
  App.jsx                 # 탭 라우팅 + 전역 상태 + IndexedDB 로드/저장 연결
  index.css               # 디자인 토큰 (paper/sage/clay 팔레트)
  data/
    store.js              # 상수(카테고리·사유·색상) + 시간 유틸
    db.js                 # IndexedDB 영속화 (idb) — 호환 안 되는 DB는 자동 재생성
  components/
    Onboarding.jsx        # 첫 실행 시 1회 노출, 시작하기 → onboarded 저장
    TopBar.jsx            # 탭 공통 상단 제목 영역
    LogTab.jsx            # 기록: 3초 로그, 커스텀 카테고리/사유
    PatternTab.jsx        # 패턴: 6주 요일 히트맵, 관찰 → 실험 연결
    ExperimentTab.jsx     # 실험: 주간 도트 체크, 제안 카드
```

## 기술

- Vite + React 19, `vite-plugin-pwa`(오프라인 캐시, 자동 업데이트), `idb`
- 서버·계정 없음. 상태는 슬라이스 단위로 IndexedDB `miroogi` DB에 저장

## 배포

GitHub `main` 브랜치에 푸시하면 Vercel이 자동으로 production 배포하고
`miroogi.vercel.app` 도메인에 연결한다. 별도 배포 명령은 필요 없다.
