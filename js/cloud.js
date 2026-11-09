// 云端（Supabase）：共享记录殿堂 + 云存档。
// 下面的 publishable key 是 Supabase 设计上就公开放在网页里的"前台钥匙"，只能做数据库规则允许的事
// （见 tools/supabase/setup.sql）。绝不要把 secret key / service_role key 放进这里。
export const CLOUD = {
  url: 'https://ltjtysbrvneprbhcnide.supabase.co',
  key: 'sb_publishable_0BoAKrgUy5dyQ9ytSWqFBQ_hBo06cyb',
};

async function call(path, { method = 'GET', body, keepalive = false, timeout = 8000 } = {}) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), timeout);
  try {
    const r = await fetch(`${CLOUD.url}/rest/v1/${path}`, {
      method, keepalive, signal: ctl.signal,
      headers: { apikey: CLOUD.key, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (!r.ok) throw new Error(`cloud ${r.status}`);
    const txt = await r.text();
    return txt ? JSON.parse(txt) : null;
  } finally { clearTimeout(timer); }
}

// 记录殿堂
export const cloudRecords = {
  async top(n = 20) { return call(`records?select=name,ending,personality,score,created_at&order=score.desc,created_at.asc&limit=${n}`); },
  async endings() { return call('records?select=ending&limit=10000'); },
  async add(rec) {
    return call('records', { method: 'POST', body: {
      name: String(rec.name || '?').slice(0, 24) || '?',
      ending: rec.ending, personality: rec.personality || null,
      score: Math.max(0, Math.min(100000, Math.round(Number(rec.score) || 0))),
      lang: rec.lang === 'en' ? 'en' : 'zh',
    } });
  },
};

// 云存档：按 10 位云存档码整包存取
export const cloudSaves = {
  async save(code, bundle, keepalive = false) { return call('rpc/cloud_save', { method: 'POST', body: { p_code: code, p_data: bundle }, keepalive }); },
  async load(code) { return call('rpc/cloud_load', { method: 'POST', body: { p_code: code } }); },
};
