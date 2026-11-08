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

export function runDream(d, then) {
  const scene = d.bg;
  c.enterScene(scene); audio.sfx('wave');
  // 标题卡
  c.show(() => {
    c.html(`<div class="vn">${c.sceneHtml(scene, null, `<div class="dream-title"><div class="eyebrow">${c.esc(T('海螺在夜里响了……', 'The shell hums in the night...'))}</div><h2>${c.esc(t(d.title))}</h2><p>${c.esc(t(d.era))}</p></div>`)}
      <div class="card dialogue"><button class="primary" data-testid="next" id="b-next">${c.esc(t('next'))}</button></div></div>`);
    c.on('#b-next', () => c.playLines(d.intro, () => play(d, then), scene), 'next');
  });
}
function play(d, then) {
  const finish = (score) => {
    MG.stopMinigame();
    c.playLines(d.outro, () => reward(d, score, then), d.bg, 0, null, {}, d.figure);
  };
  c.show(() => {
    c.html(`<div class="mg-wrap dream-game"></div><div class="row" style="margin-top:8px"><button data-testid="mg-skip" id="b-skip">${c.esc(T('醒过来（跳过）', 'Wake up (skip)'))}</button></div>`);
    const wrap = c.app.querySelector('.mg-wrap');
    if (d.game === 'quiz') MG.quiz(wrap, finish, d.questions, t(d.title));
    else if (d.game === 'pairs') MG.pairs(wrap, finish, d.pairs, t(d.title));
    else if (d.game === 'lyre') MG.lyre(wrap, finish, { title: t(d.title), melody: [0, 2, 4, 4, 5, 4, 2, 0, 1, 3, 5, 7, 5, 4, 2, 0], gap: 520 });
    c.on('#b-skip', () => { MG.stopMinigame(); reward(d, 0, then); });
  });
}
function reward(d, score, then) {
  const got = G.finishDream(c.S, d, score);
  const F = c.DATA.furniture || {};
  const items = got ? [d.reward.outfit && OUTFITS[d.reward.outfit] ? t(OUTFITS[d.reward.outfit].name) : null, d.reward.furniture && F[d.reward.furniture] ? t(F[d.reward.furniture].name) : null].filter(Boolean) : [];
  const wake = () => {
    c.enterScene('room');
    c.playLines([{ who: 'ione', text: WAKE[personalityOf(c.S)] || WAKE.calm, face: 'sleepy' }], then, 'room');
  };
  c.show(() => {
    c.html(`<div class="card note-card" data-testid="dream-reward"><div class="eyebrow">${c.esc(t(d.title))}</div>
      <p class="line">${c.esc(got ? T('她把梦里的东西带回来了：', 'She brought something back from the dream:') : T('梦醒了，什么也没带回来。下次再试试吧。', 'She woke with empty hands. Maybe next time.'))}</p>
      ${items.length ? `<ul>${items.map((x) => `<li>${c.esc(x)}</li>`).join('')}</ul>` : ''}
      ${d.note ? `<p class="note">${c.esc(t(d.note))}</p>` : ''}
      <button class="primary" data-testid="next" id="b-next">${c.esc(t('next'))}</button></div>`);
    c.on('#b-next', wake, 'next');
  });
}
