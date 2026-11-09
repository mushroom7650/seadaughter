// 存档（本机 + 云端同步）与记录殿堂。
import { cloudRecords, cloudSaves } from './cloud.js';

const KEY = (slot) => `ione_save_${slot}`;
const safe = (fn, fallback) => { try { return fn(); } catch { return fallback; } };
const localRecords = () => safe(() => JSON.parse(localStorage.getItem('ione_records') || '[]'), []);

export const SLOTS = ['auto', 1, 2, 3];

export function saveGame(slot, state) {
  const ok = safe(() => {
    if (state == null) localStorage.removeItem(KEY(slot));
    else localStorage.setItem(KEY(slot), JSON.stringify({ at: Date.now(), state }));
    if (state != null) cloudCode(true);
    return true;
  }, false);
  scheduleSync();
  return ok;
}
export function loadGame(slot) {
  return safe(() => JSON.parse(localStorage.getItem(KEY(slot)) || 'null'), null);
}

// 记录：本机（结局图鉴用，只算自己的）+ 云端共享排行榜
export const RecordsBackend = {
  async list() { return localRecords(); },
  async add(rec) {
    const all = localRecords(); all.push(rec);
    safe(() => localStorage.setItem('ione_records', JSON.stringify(all)));
    scheduleSync();
    try { await cloudRecords.add(rec); } catch {}
    return true;
  },
  // 共享殿堂：{ top, endings, shared }；连不上云端时退回本机记录
  async hall() {
    try {
      const [top, ends] = await Promise.all([cloudRecords.top(20), cloudRecords.endings()]);
      return { shared: true, top: top.map((r) => ({ ...r, date: String(r.created_at || '').slice(0, 10) })), endings: ends.map((r) => r.ending) };
    } catch {
      const all = localRecords();
      return { shared: false, top: [...all].sort((a, b) => b.score - a.score).slice(0, 20), endings: all.map((r) => r.ending) };
    }
  },
};

// ---------- 整包：所有存档位 + 本机记录 ----------
function bundle() {
  const saves = {};
  SLOTS.forEach((s) => { const d = loadGame(s); if (d) saves[s] = d; });
  return { v: 1, saves, records: localRecords() };
}
// 合并进来：每个存档位保留较新的；记录去重合并。返回导入/更新的存档数，格式不对返回 -1
function merge(data) {
  if (!data || data.v !== 1 || typeof data.saves !== 'object' || !data.saves) return -1;
  let n = 0;
  for (const s of SLOTS) {
    const inc = data.saves[s];
    if (!inc || !inc.state) continue;
    const cur = loadGame(s);
    if (!cur || (inc.at || 0) > (cur.at || 0)) safe(() => { localStorage.setItem(KEY(s), JSON.stringify(inc)); n++; });
  }
  if (Array.isArray(data.records) && data.records.length) {
    const all = localRecords();
    const seen = new Set(all.map((r) => JSON.stringify(r)));
    data.records.forEach((r) => { if (!seen.has(JSON.stringify(r))) { all.push(r); seen.add(JSON.stringify(r)); } });
    safe(() => localStorage.setItem('ione_records', JSON.stringify(all)));
  }
  return n;
}

// 存档码（手动搬家）
const PREFIX = 'IONE1:';
export function exportCode() { return PREFIX + btoa(unescape(encodeURIComponent(JSON.stringify(bundle())))); }
export function importCode(code) {
  const data = safe(() => {
    const raw = String(code || '').replace(/\s+/g, '');
    if (!raw.startsWith(PREFIX)) return null;
    return JSON.parse(decodeURIComponent(escape(atob(raw.slice(PREFIX.length)))));
  }, null);
  return merge(data);
}

// ---------- 云存档 ----------
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 去掉容易看混的 0 O 1 I
export const isCloudCode = (c) => /^[A-Z0-9]{10}$/.test(c);
export function normCode(c) { return String(c || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); }
export function cloudCode(create = false) {
  let c = safe(() => localStorage.getItem('ione_cloud_code'), null);
  if (!c && create) {
    const a = new Uint32Array(10); crypto.getRandomValues(a);
    c = Array.from(a, (x) => CODE_CHARS[x % CODE_CHARS.length]).join('');
    safe(() => localStorage.setItem('ione_cloud_code', c));
  }
  return c;
}
export const fmtCode = (c) => (c ? `${c.slice(0, 5)}-${c.slice(5)}` : '');

export const cloudState = { status: 'idle', at: 0 }; // idle | syncing | ok | offline
let timer = null;
function hasAnything() { const b = bundle(); return Object.keys(b.saves).length || b.records.length; }
export function scheduleSync(delay = 3000) {
  clearTimeout(timer);
  timer = setTimeout(() => { syncNow(); }, delay);
}
export async function syncNow(keepalive = false) {
  clearTimeout(timer);
  if (!hasAnything()) return false;
  const code = cloudCode(true);
  cloudState.status = 'syncing';
  try { await cloudSaves.save(code, bundle(), keepalive); cloudState.status = 'ok'; cloudState.at = Date.now(); return true; }
  catch { cloudState.status = 'offline'; return false; }
}
// 从云端拉下自己的存档并合并（打开游戏、打开读档界面时调用）
export async function pullCloud() {
  const code = cloudCode(false);
  if (!code) return 0;
  try { const r = await cloudSaves.load(code); cloudState.status = 'ok'; return r && r.data ? merge(r.data) : 0; }
  catch { cloudState.status = 'offline'; return 0; }
}
// 在新设备上输入云存档码：成功后这台设备以后也同步到这个码。返回导入数，码不存在返回 -1，连不上返回 -2
export async function useCloudCode(input) {
  const code = normCode(input);
  if (!isCloudCode(code)) return -1;
  let r;
  try { r = await cloudSaves.load(code); } catch { return -2; }
  if (!r || !r.data) return -1;
  const old = cloudCode(false);
  const n = merge(r.data);
  safe(() => localStorage.setItem('ione_cloud_code', code));
  if (old && old !== code) await syncNow(); // 把这台设备原来的进度也并进新码
  return n;
}
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && timer) syncNow(true); });
}
