// 游戏逻辑（不碰界面，方便测试）
import { ACTIVITIES, PETS, AXES, personalityOf } from './data/core.js';
import { EVENTS } from './data/events.js';
import { decideEnding, scoreOf } from './data/endings.js';
import { WORDS } from './data/words.js';
import { ROOMS, GAME_REWARDS, PET_FINDS, PET_MILESTONES } from './data/rooms.js';

export const TOTAL_WEEKS = 48;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
let RANDOM_EVENTS = [];
// 随机事件由另一个文件提供；文件还没有时游戏照常运行
export const randomReady = import('./data/random_events.js').then((m) => { RANDOM_EVENTS = (m.RANDOM_EVENTS || []).map((e) => ({ ...e, random: true })); }).catch(() => {});
export const randomEvents = () => RANDOM_EVENTS;

export function newGame(playerName, pet, mentor = 'm', rng = Math.random) {
  const s = {
    version: 2,
    playerName, pet, mentor,
    week: 1, // 1..48
    stats: { stamina: 30, martial: 5, wits: 10, eloquence: 5, sailing: 15, etiquette: 0, piety: 5, song: 5, farming: 5, courage: 15, stress: 20 },
    silver: 50,
    trust: 5,
    traits: { cheer: -30, gentle: -20, depend: -30, pious: -10 },
    flags: {}, promises: [], promisesKept: 0, promisesBroken: 0,
    runaways: 0, seenEvents: [], talkedThisWeek: false,
    finalChoice: null, ending: null,
    log: [],
  };
  migrate(s);
  const p = PETS[pet];
  if (p) applyEffects(s, { fx: p.fx, t: p.t });
  s.seed = Math.floor(rng() * 1e9);
  return s;
}

// 旧存档补上新字段
export function migrate(s) {
  s.mentor ??= 'm';
  s.look ??= { outfit: 'chiton', hair: 'shell', neck: 'shell' };
  s.closet ??= { outfit: ['chiton'], hair: ['shell'], neck: ['shell'] };
  s.items ??= {};
  s.furniture ??= { owned: ['bed_simple', 'chest', 'stool', 'amphora'], placed: { bed: 'bed_simple', left: 'chest', right: 'stool', corner: 'amphora' } };
  s.dreams ??= [];
  s.words ??= {};
  s.petLove ??= 0;
  s.randomSeen ??= [];
  s.minigameBest ??= {};
  s.ap ??= 0; // 周末行动点
  s.room ??= 'simple';
  s.roomsOwned ??= ['simple'];
  s.petMilestones ??= [];
  s.gameUnlocks ??= [];
  // 旧版家具里的梦境奖励换成对应的房间
  const OLD = { mosaic: 'athens', tapestry: 'florence', piano: 'vienna', lab_bench: 'paris' };
  for (const [f, r] of Object.entries(OLD)) if (s.furniture.owned.includes(f) && !s.roomsOwned.includes(r)) s.roomsOwned.push(r);
  s.version = 2;
  return s;
}

export const monthOf = (week) => Math.ceil(week / 4);
export const weekInMonth = (week) => ((week - 1) % 4) + 1;

export function applyEffects(s, e = {}) {
  if (e.fx) for (const [k, v] of Object.entries(e.fx)) {
    if (!(k in s.stats)) continue;
    s.stats[k] = k === 'stress' ? clamp(s.stats[k] + v, 0, 100) : clamp(s.stats[k] + v, 0, 999);
  }
  if (e.silver) s.silver = Math.max(0, s.silver + e.silver);
  if (e.trust) s.trust = clamp(s.trust + e.trust, 0, 100);
  if (e.t) for (const [k, v] of Object.entries(e.t)) if (k in s.traits) s.traits[k] = clamp(s.traits[k] + v, -100, 100);
  if (e.flag) s.flags[e.flag] = true;
  if (e.item) s.items[e.item] = (s.items[e.item] || 0) + 1;
  if (e.promise && !s.promises.includes(e.promise)) s.promises.push(e.promise);
  if (e.keep && s.promises.includes(e.keep)) { s.promisesKept++; s.promises = s.promises.filter((p) => p !== e.keep); }
  if (e.breakPromise && s.promises.includes(e.breakPromise)) {
    s.promisesBroken++; s.trust = clamp(s.trust - 12, 0, 100);
    s.promises = s.promises.filter((p) => p !== e.breakPromise);
    s.flags['broke_' + e.breakPromise] = true;
  }
  if (e.final) s.finalChoice = e.final;
}

// 事件条件：flags / notFlags / minTrust / maxTrust / stats / pet
export function condOk(s, c) {
  if (!c) return true;
  if (c.flags && !c.flags.every((f) => s.flags[f])) return false;
  if (c.notFlags && c.notFlags.some((f) => s.flags[f])) return false;
  if (c.minTrust != null && s.trust < c.minTrust) return false;
  if (c.maxTrust != null && s.trust > c.maxTrust) return false;
  if (c.stats && !Object.entries(c.stats).every(([k, v]) => (s.stats[k] || 0) >= v)) return false;
  if (c.pet && c.pet !== s.pet) return false;
  if (c.personality && !c.personality.includes(personalityOf(s))) return false;
  return true;
}

export function canAfford(s, plan) {
  const cost = plan.reduce((sum, a) => sum + (ACTIVITIES[a]?.cost || 0), 0);
  return cost <= s.silver;
}

// 执行一周（6天）。返回每天的结果，供界面逐日播放
export function runWeek(s, plan, rng = Math.random, furnitureBonus = null) {
  const days = [];
  let sick = false;
  for (let i = 0; i < 6; i++) {
    const before = snapshot(s);
    let act = plan[i] || 'rest';
    let note = null;
    if (sick) { act = 'rest'; note = 'sick'; }
    const a = ACTIVITIES[act];
    if (a.cost && s.silver < a.cost) act = 'rest';
    const A = ACTIVITIES[act];
    const eff = s.stats.stamina < 10 ? 0.5 : 1; // 体力低时效果打折
    const fx = {};
    for (const [k, v] of Object.entries(A.fx)) fx[k] = k === 'stress' ? v : (v > 0 ? Math.round(v * eff) : v);
    applyEffects(s, { fx, t: A.t, trust: A.trust, silver: (A.silver || 0) - (A.cost || 0) });
    if (!sick && s.stats.stress >= 100) { sick = true; note = 'sick'; s.stats.stress = 70; }
    if (!sick && note === null && s.stats.stress >= 80 && s.trust < 30 && rng() < 0.25) {
      s.runaways++; note = 'ranAway'; applyEffects(s, { fx: { stress: -30, sailing: 5 }, t: { depend: -5 } });
    }
    days.push({ act, note, delta: diff(before, snapshot(s)) });
  }
  if (furnitureBonus) applyEffects(s, { fx: furnitureBonus }); // 房间家具的每周加成
  s.talkedThisWeek = false;
  s.ap = 2; // 周末有两次行动
  return days;
}

// 周末回应
export function weekendResponse(s, kind) {
  const stressed = s.stats.stress >= 60;
  const E = {
    praise:    { trust: 3, t: { cheer: 3, depend: 1 }, fx: { stress: -5 } },
    encourage: { trust: stressed ? -2 : 1, t: { gentle: -1, depend: -1 }, fx: { stress: stressed ? 5 : 0, courage: 2 } },
    scold:     { trust: -4, t: { cheer: -3, gentle: -2, pious: 1 }, fx: { stress: 6, etiquette: 2 } },
    silent:    { trust: stressed ? -1 : 0, t: { depend: -2 } },
  }[kind];
  applyEffects(s, E);
}

export function talk(s) {
  if (s.talkedThisWeek) return false;
  s.talkedThisWeek = true;
  applyEffects(s, { trust: 2, t: { cheer: 1 }, fx: { stress: -3 } });
  return true;
}

// ---------- 周末活动 ----------
export function teachWord(s, cat) {
  const C = WORDS[cat];
  const n = s.words[cat] || 0;
  s.words[cat] = n + 1;
  applyEffects(s, C.effect);
  return C.words[n % C.words.length];
}
export function giveGift(s, id, item, pers) {
  if (!s.items[id]) return null;
  s.items[id]--;
  const like = (item.likes && item.likes[pers]) || 0;
  const trust = 2 + like;
  const fx = item.kind === 'medicine' ? { stress: -25 } : item.kind === 'food' ? { stress: -8, stamina: 3 } : { stress: -5 };
  applyEffects(s, { trust, fx });
  return like > 0 ? 'love' : like < 0 ? 'dislike' : 'ok';
}
export function buy(s, price, kind, id) {
  if (s.silver < price) return false;
  s.silver -= price;
  if (kind === 'item') s.items[id] = (s.items[id] || 0) + 1;
  else if (kind === 'furniture') { if (!s.furniture.owned.includes(id)) s.furniture.owned.push(id); }
  else if (kind === 'room') { if (!s.roomsOwned.includes(id)) s.roomsOwned.push(id); }
  else if (!s.closet[kind].includes(id)) s.closet[kind].push(id);
  return true;
}
// 陪宠物玩：亲密度上升；有时带回小惊喜；到 30/60/90 有里程碑。返回发生了什么，给界面显示
export function playWithPet(s, kind = 'play', rng = Math.random) {
  const gain = { feed: 6, groom: 7, play: 9 }[kind] || 8;
  s.petLove = Math.min(100, s.petLove + gain);
  applyEffects(s, { fx: { stress: kind === 'play' ? -10 : -7 }, t: kind === 'play' ? { cheer: 2 } : { gentle: 2 } });
  const out = { find: null, milestone: null };
  const F = PET_FINDS[s.pet];
  if (F && rng() < 0.3) { if (F.silver) applyEffects(s, { silver: F.silver }); if (F.item) applyEffects(s, { item: F.item }); out.find = F; }
  for (const m of [30, 60, 90]) {
    if (s.petLove >= m && !s.petMilestones.includes(m)) {
      s.petMilestones.push(m);
      const M = PET_MILESTONES[m];
      applyEffects(s, { fx: M.fx, trust: M.trust });
      let gift = null;
      if (M.gift && M.gift[s.pet]) { const [k, id] = M.gift[s.pet]; if (!s.closet[k].includes(id)) s.closet[k].push(id); gift = { kind: k, id }; }
      out.milestone = { level: m, ...M, gift };
      break;
    }
  }
  return out;
}
// 小游戏奖励
export function gameRewards(s, game, score) {
  const R = GAME_REWARDS[game]; if (!R) return {};
  const out = {};
  if (score >= 60 && R.good) { if (R.good.silver) { applyEffects(s, { silver: R.good.silver }); out.silver = R.good.silver; } if (R.good.item) { applyEffects(s, { item: R.good.item }); out.item = R.good.item; } }
  if (score >= 85 && R.great && !s.gameUnlocks.includes(game)) {
    s.gameUnlocks.push(game);
    const { kind, id } = R.great;
    if (!s.closet[kind].includes(id)) s.closet[kind].push(id);
    out.unlock = R.great;
  }
  return out;
}
export const roomBonus = (s) => (ROOMS[s.room] || ROOMS.simple).bonus;
// 小游戏得分（0-100）转成数值成长
const GAME_FX = {
  archery: { martial: 8, courage: 3 }, kitchen: { stamina: 4, etiquette: 3 }, loom: { etiquette: 6, wits: 3 },
  lyre: { song: 8, etiquette: 2 }, style: { etiquette: 3, eloquence: 2 },
};
export function minigameResult(s, game, score) {
  const k = score / 100;
  const base = GAME_FX[game] || {};
  const fx = {};
  for (const [st, v] of Object.entries(base)) fx[st] = Math.round(v * (0.3 + k));
  fx.stress = score >= 60 ? -6 : 2;
  applyEffects(s, { fx, trust: score >= 60 ? 2 : 0 });
  s.minigameBest[game] = Math.max(s.minigameBest[game] || 0, score);
  return fx;
}
export function finishDream(s, dream, score) {
  if (!s.dreams.includes(dream.id)) s.dreams.push(dream.id);
  applyEffects(s, dream.effect || {});
  if (score >= 50) {
    if (dream.reward.outfit && !s.closet.outfit.includes(dream.reward.outfit)) s.closet.outfit.push(dream.reward.outfit);
    if (dream.reward.room && !s.roomsOwned.includes(dream.reward.room)) s.roomsOwned.push(dream.reward.room);
    return true;
  }
  return false;
}

// 本周末应触发的主线事件（按顺序），条件不满足的跳过
export function pendingEvents(s) {
  const m = monthOf(s.week), w = weekInMonth(s.week);
  return EVENTS.filter((e) => e.month === m && e.week === w && !s.seenEvents.includes(e.id) && condOk(s, e.cond));
}
export const eventById = (id) => EVENTS.find((e) => e.id === id) || RANDOM_EVENTS.find((e) => e.id === id);
// 没有主线事件的周末，有一定几率发生随机事件
export function pickRandomEvent(s, rng = Math.random, chance = 0.4) {
  if (rng() >= chance) return null;
  const m = monthOf(s.week);
  const pool = RANDOM_EVENTS.filter((e) => (!e.months || (m >= e.months[0] && m <= e.months[1]))
    && !(e.once !== false && s.randomSeen.includes(e.id)) && condOk(s, e.cond));
  if (!pool.length) return null;
  let r = rng() * pool.reduce((a, e) => a + (e.weight || 1), 0);
  for (const e of pool) { r -= e.weight || 1; if (r <= 0) return e; }
  return pool[pool.length - 1];
}
export const openingEvent = () => EVENTS.find((e) => e.week === 0);

// 处理一个事件选项，返回要显示的回应台词，以及要接着播放的事件
export function chooseOption(s, ev, idx) {
  const c = ev.choices[idx];
  if (c.duel) return { duel: c.duel }; // 先玩对峙小游戏，再用 resolveDuel 结算
  if (ev.random) { if (!s.randomSeen.includes(ev.id)) s.randomSeen.push(ev.id); }
  else if (!s.seenEvents.includes(ev.id)) s.seenEvents.push(ev.id);
  const check = c.check || (c.success ? ev.check : null);
  if (check) {
    const total = check.stats.reduce((sum, k) => sum + s.stats[k], 0);
    const ok = total >= check.need;
    if (ok) applyEffects(s, { ...c, flag: c.flag, trust: (c.trust || 0) + 3 });
    else applyEffects(s, { t: c.t, trust: c.trust, flag: c.failFlag, fx: { stress: 8 } });
    return { ok, lines: ok ? c.success : c.fail, next: c.next };
  }
  applyEffects(s, c);
  return { ok: true, lines: c.reply || [], next: c.next };
}
// 对峙结算：60 分以上算打赢
export function resolveDuel(s, ev, idx, score) {
  const c = ev.choices[idx];
  markSeen(s, ev);
  const won = score >= 60;
  applyEffects(s, { t: c.t, trust: c.trust });
  if (won) { s.flags['beat_' + c.duel] = true; applyEffects(s, c.win || {}); }
  else applyEffects(s, c.lose || {});
  return { ok: won, lines: won ? c.success : c.fail, next: c.next };
}
// 没有选项的事件（只有台词）也要记为已看过
// 宠物要等到第一个宠物事件（1 月第 3 周周末）才来到伊俄涅身边
export const petArrived = (s) => !!s && (s.seenEvents.includes(`pet_${s.pet}_1`) || s.week > 3);
export function markSeen(s, ev) {
  if (ev.random) { if (!s.randomSeen.includes(ev.id)) s.randomSeen.push(ev.id); }
  else if (!s.seenEvents.includes(ev.id)) s.seenEvents.push(ev.id);
}

// 推进到下一周；返回 true 表示游戏结束
export function advanceWeek(s) {
  if (s.week >= TOTAL_WEEKS) return true;
  s.week++;
  return false;
}

export function finish(s) {
  s.ending = decideEnding(s);
  s.personality = personalityOf(s);
  s.score = scoreOf(s, s.ending);
  return s;
}

function snapshot(s) { return { ...s.stats, silver: s.silver }; }
function diff(a, b) { const d = {}; for (const k in b) if (b[k] !== a[k]) d[k] = b[k] - a[k]; return d; }
export { AXES };
