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
