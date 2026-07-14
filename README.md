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

## 배포 (웹)

GitHub `main` 브랜치에 푸시하면 Vercel이 자동으로 production 배포하고
`miroogi.vercel.app` 도메인에 연결한다. 별도 배포 명령은 필요 없다.

## 안드로이드 APK

Capacitor로 웹 빌드를 안드로이드 앱(`app.miroogi.tracker`)으로 감싼다.
웹 자산이 APK 안에 번들되므로 오프라인에서도 도메인 없이 동작한다.

필요 환경: JDK 21, Android SDK(platform 36 / build-tools 36 / platform-tools).
빌드 시 `JAVA_HOME`은 JDK 21을, `ANDROID_HOME`은 SDK 경로를 가리켜야 한다
(시스템 기본 JDK가 22 이상이면 AGP 빌드가 실패하므로 JDK 21 사용).

```bash
npm run build                 # 웹 빌드 → dist/
npx cap sync android          # dist/를 android 프로젝트로 복사
cd android
./gradlew assembleDebug       # → app/build/outputs/apk/debug/app-debug.apk
```

- 산출물 `app-debug.apk`는 디버그 키로 서명되어 사이드로드 설치가 가능하다.
- 앱 아이콘은 `assets/`의 소스에서 `npx capacitor-assets generate --android`로 생성한다.
- `android/local.properties`의 `sdk.dir` 경로는 슬래시(`/`)로 적어야 한다
  (백슬래시는 Java properties가 유니코드 이스케이프로 오해해 빌드가 깨진다).
