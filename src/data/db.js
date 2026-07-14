// IndexedDB 영속화 레이어 (idb 라이브러리 사용)
// 앱 상태 슬라이스(logs, experiments, ...)를 key-value 형태로 저장한다.
// 저장된 값이 없으면(첫 실행) undefined를 돌려주고, App에서 시드 데이터를 그대로 쓴다.

import { openDB, deleteDB } from 'idb';

const DB_NAME = 'miroogi';
const DB_VERSION = 2;
const STORE = 'state';

export const STATE_KEYS = [
  'onboarded',
  'categories',
  'customReasons',
  'logs',
  'experiments',
  'suggestions',
];

const open = () =>
  openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    },
  });

// 기존 DB가 호환되지 않으면(다른 버전/구조) 지우고 새로 만든다.
// 이 앱의 데이터는 전부 이 스토어에만 있으므로 재생성이 곧 초기화다.
const dbPromise = open().catch(async () => {
  await deleteDB(DB_NAME);
  return open();
});

// 모든 슬라이스를 한 번에 읽어온다. 없는 키는 undefined.
export async function loadState() {
  const db = await dbPromise;
  const tx = db.transaction(STORE, 'readonly');
  const values = await Promise.all(STATE_KEYS.map((k) => tx.store.get(k)));
  await tx.done;
  return Object.fromEntries(STATE_KEYS.map((k, i) => [k, values[i]]));
}

export async function saveState(key, value) {
  try {
    const db = await dbPromise;
    await db.put(STORE, value, key);
  } catch {
    // 저장 실패(스토리지 차단 등)해도 앱 사용은 막지 않는다.
  }
}

// 저장된 데이터를 전부 지운다. (디버깅/초기화용)
export async function clearState() {
  const db = await dbPromise;
  await db.clear(STORE);
}
