// 存档（本机）与记录殿堂。
// 记录殿堂目前存在本机浏览器里；等确定发布方式后，只需替换 RecordsBackend 的实现即可变成全网共享。
const KEY = (slot) => `ione_save_${slot}`;
const safe = (fn, fallback) => { try { return fn(); } catch { return fallback; } };

export const SLOTS = ['auto', 1, 2, 3];

export function saveGame(slot, state) {
  return safe(() => { localStorage.setItem(KEY(slot), JSON.stringify({ at: Date.now(), state })); return true; }, false);
}
export function loadGame(slot) {
  return safe(() => JSON.parse(localStorage.getItem(KEY(slot)) || 'null'), null);
}

export const RecordsBackend = {
  async list() { return safe(() => JSON.parse(localStorage.getItem('ione_records') || '[]'), []); },
  async add(rec) {
    const all = await this.list();
    all.push(rec);
    safe(() => localStorage.setItem('ione_records', JSON.stringify(all)));
    return true;
  },
};

// 存档码：把本机所有存档和记录殿堂打包成一段文字，方便换网址/换设备时搬家。
const PREFIX = 'IONE1:';
export function exportCode() {
  const saves = {};
  SLOTS.forEach((s) => { const d = loadGame(s); if (d) saves[s] = d; });
  const records = safe(() => JSON.parse(localStorage.getItem('ione_records') || '[]'), []);
  const json = JSON.stringify({ v: 1, saves, records });
  return PREFIX + btoa(unescape(encodeURIComponent(json)));
}
// 返回导入的存档数，格式不对返回 -1。存档位按"较新的覆盖较旧的"合并，记录殿堂去重合并。
export function importCode(code) {
  const data = safe(() => {
    const raw = String(code || '').replace(/\s+/g, '');
    if (!raw.startsWith(PREFIX)) return null;
    return JSON.parse(decodeURIComponent(escape(atob(raw.slice(PREFIX.length)))));
  }, null);
  if (!data || data.v !== 1 || typeof data.saves !== 'object') return -1;
  let n = 0;
  for (const s of SLOTS) {
    const inc = data.saves[s];
    if (!inc || !inc.state) continue;
    const cur = loadGame(s);
    if (!cur || (inc.at || 0) >= (cur.at || 0)) {
      safe(() => { localStorage.setItem(KEY(s), JSON.stringify(inc)); n++; });
    }
  }
  if (Array.isArray(data.records) && data.records.length) {
    const all = safe(() => JSON.parse(localStorage.getItem('ione_records') || '[]'), []);
    const seen = new Set(all.map((r) => JSON.stringify(r)));
    data.records.forEach((r) => { if (!seen.has(JSON.stringify(r))) all.push(r); });
    safe(() => localStorage.setItem('ione_records', JSON.stringify(all)));
  }
  return n;
}
