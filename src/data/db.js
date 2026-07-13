// IndexedDB 영속화 레이어 (idb 라이브러리 사용)
// 앱 상태 슬라이스(logs, experiments, ...)를 key-value 형태로 저장한다.
// 저장된 값이 없으면(첫 실행) undefined를 돌려주고, App에서 시드 데이터를 그대로 쓴다.

import { openDB } from 'idb';

const DB_NAME = 'miroogi';
const DB_VERSION = 1;
const STORE = 'state';

export const STATE_KEYS = [
  'onboarded',
  'categories',
  'customReasons',
  'logs',
  'experiments',
  'suggestions',
];

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    db.createObjectStore(STORE);
  },
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
  const db = await dbPromise;
  await db.put(STORE, value, key);
}

// 저장된 데이터를 전부 지운다. (디버깅/초기화용)
export async function clearState() {
  const db = await dbPromise;
  await db.clear(STORE);
}
