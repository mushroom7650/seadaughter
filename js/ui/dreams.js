// 梦境之旅：开场对话 → 小游戏或问答 → 结尾 → 奖励（衣服、家具）→ 醒来后她的感想。
import * as G from '../game.js';
import { personalityOf } from '../data/core.js';
import { WAKE } from '../data/dreams.js';
import { OUTFITS } from '../data/wardrobe_meta.js';
import { t } from '../i18n.js';
import * as audio from '../audio.js';
import * as MG from './minigames.js';

let c = null;
export function initDreams(ctx) { c = ctx; }
const T = (zh, en) => t({ zh, en });

// 每个城市有好几个故事：优先挑这个浏览器里还没看过的，都看过了就随机换一个（不和上次一样）
const SEEN_KEY = 'ione_dream_seen';
const seenList = () => { try { return JSON.parse(localStorage.getItem(SEEN_KEY) || '[]'); } catch { return []; } };
export function pickEpisode(d, rng = Math.random) {
  const seen = seenList(), eps = d.episodes;
  const fresh = eps.filter((e) => !seen.includes(e.id));
  let pool = fresh.length ? fresh : eps;
  if (!fresh.length && eps.length > 1) { const last = [...seen].reverse().find((id) => eps.some((e) => e.id === id)); pool = eps.filter((e) => e.id !== last); }
  return pool[Math.floor(rng() * pool.length)];
}
function markEpisode(ep) {
  const seen = seenList().filter((id) => id !== ep.id); seen.push(ep.id);
  try { localStorage.setItem(SEEN_KEY, JSON.stringify(seen)); } catch {}
}
const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
// 从题库随机抽题，并打乱每道题的选项顺序
function drawQuestions(pool, n) {
  return shuffle(pool).slice(0, n || pool.length).map((q) => {
    const order = shuffle(q.opts.map((_, k) => k));
    return { ...q, opts: order.map((k) => q.opts[k]), answer: order.indexOf(q.answer) };
  });
}

export function runDream(d, then) {
  const ep = pickEpisode(d);
  markEpisode(ep);
  if (c.S) { c.S.dreamEpisodes ??= []; c.S.dreamEpisodes.push(ep.id); }
  const scene = ep.bg;
  c.enterScene(scene); audio.sfx('wave');
  // 标题卡
  c.show(() => {
    c.html(`<div class="vn" data-episode="${ep.id}">${c.sceneHtml(scene, null, `<div class="dream-title"><div class="eyebrow">${c.esc(T('海螺在夜里响了……', 'The shell hums in the night...'))}</div><h2>${c.esc(t(ep.title))}</h2><p>${c.esc(t(ep.era))}</p></div>`)}
      <div class="card dialogue"><button class="primary" data-testid="next" id="b-next">${c.esc(t('next'))}</button></div></div>`);
    c.on('#b-next', () => c.playLines(ep.intro, () => playRound(d, ep, 0, [], then), scene), 'next');
  });
}
// 一关一关地玩；两关之间人物说一句话；最后取平均分
function playRound(d, ep, i, scores, then) {
  if (i >= ep.rounds.length) {
    const score = Math.round(scores.reduce((a, b) => a + b, 0) / Math.max(1, scores.length));
    return c.playLines(ep.outro, () => reward(d, ep, score, then), ep.bg, 0, null, {}, ep.figure);
  }
  const r = ep.rounds[i];
  const finish = (score) => {
    MG.stopMinigame();
    scores.push(score);
    if (i + 1 < ep.rounds.length && ep.mid) c.playLines(ep.mid, () => playRound(d, ep, i + 1, scores, then), ep.bg, 0, null, {}, ep.figure);
    else playRound(d, ep, i + 1, scores, then);
  };
  const label = `${t(ep.title)} · ${T(`第 ${i + 1}/${ep.rounds.length} 关`, `Round ${i + 1}/${ep.rounds.length}`)}`;
  c.show(() => {
    c.html(`<div class="mg-wrap dream-game" data-round="${i + 1}"></div><div class="row" style="margin-top:8px"><button data-testid="mg-skip" id="b-skip">${c.esc(T('醒过来（跳过）', 'Wake up (skip)'))}</button></div>`);
    const wrap = c.app.querySelector('.mg-wrap');
    if (r.game === 'quiz') MG.quiz(wrap, finish, drawQuestions(r.pool, r.n), label);
    else if (r.game === 'pairs') MG.pairs(wrap, finish, shuffle(r.pool).slice(0, r.n || r.pool.length), label);
    else if (r.game === 'lyre') MG.lyre(wrap, finish, { title: label, melody: r.melody, gap: r.gap || 520 });
    c.on('#b-skip', () => { MG.stopMinigame(); reward(d, ep, 0, then); });
  });
}
function reward(d, ep, score, then) {
  const got = G.finishDream(c.S, d, score);
  const F = c.DATA.furniture || {};
  const items = got ? [d.reward.outfit && OUTFITS[d.reward.outfit] ? t(OUTFITS[d.reward.outfit].name) : null, d.reward.furniture && F[d.reward.furniture] ? t(F[d.reward.furniture].name) : null].filter(Boolean) : [];
  const wake = () => {
    c.enterScene('room');
    c.playLines([{ who: 'ione', text: WAKE[personalityOf(c.S)] || WAKE.calm, face: 'sleepy' }], then, 'room');
  };
  c.show(() => {
    c.html(`<div class="card note-card" data-testid="dream-reward"><div class="eyebrow">${c.esc(t(ep.title))}</div>
      <p class="line">${c.esc(got ? T('她把梦里的东西带回来了：', 'She brought something back from the dream:') : T('梦醒了，什么也没带回来。下次再试试吧。', 'She woke with empty hands. Maybe next time.'))}</p>
      ${items.length ? `<ul>${items.map((x) => `<li>${c.esc(x)}</li>`).join('')}</ul>` : ''}
      ${ep.note ? `<div class="row between" style="margin-top:10px"><span class="eyebrow">${c.esc(T('小知识', 'History note'))}</span>${c.noteAudioHtml(ep.note)}</div><p class="note">${c.esc(t(ep.note))}</p>` : ''}
      <button class="primary" data-testid="next" id="b-next">${c.esc(t('next'))}</button></div>`);
    if (ep.note) c.bindNoteAudio(ep.note);
    c.on('#b-next', wake, 'next');
  });
}
