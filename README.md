# 미루기 패턴 트래커

할 일 "완료"가 아니라 "회피"를 기록하는 앱. 평가가 아니라 관찰.
점수·스트릭·비교 없음.

## 실행

```bash
npm install
npm run dev      # 개발 서버 (localhost:5173)
npm run build    # 프로덕션 빌드 → dist/
```

## 구조

```
src/
  App.jsx                 # 탭 라우팅 + 전역 상태
  index.css               # 디자인 토큰 (paper/sage/clay 팔레트)
  data/store.js           # 데이터 레이어 (상수·시드·유틸) ← IndexedDB 교체 지점
  components/
    LogTab.jsx            # 기록: 3초 로그, 커스텀 카테고리/사유
    PatternTab.jsx        # 패턴: 6주 히트맵, 관찰 → 실험 연결
    ExperimentTab.jsx     # 실험: 주간 도트 체크, 제안 카드
```

## 다음 단계 (예정)

- [ ] IndexedDB 영속화 (`idb` 라이브러리, data/store.js 인터페이스 유지)
- [ ] 시드 데이터 제거 → 온보딩 빈 상태 설계
- [ ] PWA (manifest + service worker)
- [ ] Vercel 배포
