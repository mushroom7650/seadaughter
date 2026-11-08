// 界面主文件：标题、开局、剧情播放、主画面、日程、周末、结局、存档、记录殿堂。
// 周末活动（出门、小游戏、教词、送礼、商店、换装、房间、宠物）在 ui/weekend.js；梦境在 ui/dreams.js。
import * as G from './game.js';
import { ACTIVITIES, PETS, STATS, PERSONALITIES, ATTIC_MONTHS, personalityOf, nameForYou } from './data/core.js';
import { SPEAKERS, EVENTS } from './data/events.js';
import { TALK, WEEKEND_REPLY } from './data/talk.js';
import { ENDINGS, EPILOGUE, ENDING_HINTS } from './data/endings.js';
import { DREAMS, DREAM_SPEAKERS } from './data/dreams.js';
import { VOICE } from './data/voice.js';
import { ROOMS } from './data/rooms.js';
import { t, getLang, setLang } from './i18n.js';
import * as audio from './audio.js';
import { SLOTS, saveGame, loadGame, RecordsBackend } from './storage.js';
import { initWeekend, weekendMenu } from './ui/weekend.js';
import { initDreams, runDream } from './ui/dreams.js';
import { stopMinigame, duel } from './ui/minigames.js';
import { DUELS } from './data/monsters.js';

const app = document.getElementById('app');
let S = null;            // 当前存档状态
let current = () => {};  // 当前画面，切换语言时重绘
const DATA = { wardrobe: null, furniture: null, items: null, lines: null };
// 另外几个助手生成的清单（衣橱坐标、家具、礼物、整句配音）；没有时相关功能自动隐藏
// 清单里的文件名统一成相对 assets/img/ 的写法
function fixFiles(d) { if (d) for (const v of Object.values(d)) if (v && v.file) v.file = v.file.replace(/^assets\/img\//, ''); return d; }
const loadJSON = (url) => fetch(url).then((r) => (r.ok ? r.json() : null)).catch(() => null);
const dataReady = Promise.all([
  loadJSON('assets/img/wardrobe.json').then((d) => { DATA.wardrobe = d; }),
  loadJSON('assets/img/furniture.json').then((d) => { DATA.furniture = fixFiles(d); }),
  loadJSON('assets/img/items.json').then((d) => { DATA.items = fixFiles(d); }),
  loadJSON('assets/audio/lines/index.json').then((d) => { DATA.lines = d; }),
  G.randomReady,
]);

// ---------- 小工具 ----------
const esc = (x) => String(x).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function show(fn) {
  stopMinigame(); current = fn; fn(); window.scrollTo(0, 0);
  if (S && !S.ending) saveGame('auto', S); // 自动存档：每换一个画面存一次（S.phase 记住这一周进行到哪一步）
  placePets();
}
function html(str) { app.innerHTML = str; }
function on(sel, fn, sound = 'click') { app.querySelectorAll(sel).forEach((el) => el.addEventListener('click', (e) => { if (sound) audio.sfx(sound); fn(e, el); })); }
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg; el.classList.add('show');
  clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('show'), 2200);
}
function fill(text) {
  if (!S) return text;
  return text.replaceAll('{you}', t(nameForYou(S))).replaceAll('{name}', S.playerName);
}
const T = (zh, en) => t({ zh, en });
const actName = (id) => fill(t(ACTIVITIES[id].name));
const statName = (k) => (k === 'silver' ? t('silver') : t(STATS[k]));
function deltaHtml(delta) {
  return Object.entries(delta).filter(([k]) => k in STATS || k === 'silver').map(([k, v]) => {
    const good = k === 'stress' ? v < 0 : v > 0;
    return `<span class="${good ? 'up' : 'down'}">${esc(statName(k))} ${v > 0 ? '+' : ''}${v}</span>`;
  }).join(' ');
}

// ---------- 场景、立绘、表情、语音 ----------
export const FACES = ['calm', 'happy', 'sad', 'angry', 'surprised', 'shy', 'thinking', 'smirk', 'wary', 'tearful', 'scared', 'determined', 'pout', 'laugh', 'sleepy'];
const DEFAULT_FACE = { hedgehog: 'wary', cold: 'calm', cheerful: 'happy', gentle: 'calm', stubborn: 'smirk', clingy: 'shy', independent: 'thinking', rebel: 'smirk', devout: 'calm', calm: 'calm' };
function moodFace() {
  if (!S) return 'calm';
  if (S.stats.stress >= 70) return 'sad';
  return DEFAULT_FACE[personalityOf(S)] || 'calm';
}
function replyFace(pers, kind) {
  const tough = ['hedgehog', 'stubborn', 'rebel'].includes(pers);
  if (pers === 'hedgehog' && kind !== 'scold') return 'wary';
  if (kind === 'praise') return tough ? 'smirk' : pers === 'cold' ? 'shy' : 'happy';
  if (kind === 'scold') return tough ? 'angry' : 'sad';
  if (kind === 'encourage') return pers === 'cheerful' ? 'happy' : tough ? 'angry' : 'calm';
  return pers === 'clingy' ? 'sad' : 'thinking';
}
const bgUrl = (id) => `assets/img/${/^(bg|cg|act|dream|room)_/.test(id) ? id : 'bg_' + id}.webp`;
const hideBroken = `onerror="this.remove()"`;
function speaker(who) { return SPEAKERS[who] || DREAM_SPEAKERS[who] || SPEAKERS.narrator; }
function portraitOf(who) {
  if (DREAM_SPEAKERS[who]) return `assets/img/hist_${who}.webp`;
  if (who === 'mentor') return `assets/img/npc_mentor_${S?.mentor || 'm'}.webp`;
  const sp = SPEAKERS[who];
  return sp && sp.portrait ? `assets/img/npc_${who}.webp` : null;
}
// 换装后的伊俄涅（同一姿势的底图 + 发饰 + 项链）；没有衣橱数据时退回普通立绘
function dressedHtml(look, extraClass = '') {
  const W = DATA.wardrobe;
  if (!W || !W.outfits || !W.outfits[look.outfit]) return `<img class="ione f-calm ${extraClass}" src="assets/img/ione_chiton_calm.webp" alt="">`;
  const [cw, ch] = W.canvas;
  const part = (spec, anchorName) => {
    if (!spec) return '';
    const a = W.anchors[spec.anchor || anchorName]; if (!a) return '';
    const w = spec.w || a[2], x = a[0] + (spec.dx || 0), y = a[1] + (spec.dy || 0);
    return `<img src="assets/img/${spec.file}" style="left:${(x - w / 2) / cw * 100}%;top:${y / ch * 100}%;width:${w / cw * 100}%;transform:translateY(-50%)" alt="">`;
  };
  return `<div class="dressed ${extraClass}" data-testid="dressed" style="aspect-ratio:${cw}/${ch}">
    <img class="base" src="assets/img/${W.outfits[look.outfit].file}" alt="">
    ${part(W.neck && W.neck[look.neck], 'neck')}${part(W.hair && W.hair[look.hair], 'clip')}</div>`;
}
// 换了衣服时，剧情对话里也穿这身：每套衣服有 6 个常用表情，其他表情用最接近的一个
const OUTFIT_FACE = { calm: 'calm', thinking: 'calm', sleepy: 'calm', wary: 'calm', determined: 'calm', happy: 'happy', laugh: 'happy', smirk: 'happy', tearful: 'happy',
  sad: 'sad', angry: 'angry', pout: 'angry', surprised: 'surprised', scared: 'surprised', shy: 'shy' };
function outfitFace(face) {
  const o = S && S.look && S.look.outfit;
  if (!o || o === 'chiton' || !OUTFIT_FACE[face]) return { src: `assets/img/ione_chiton_${face}.webp`, cls: '' };
  const f = OUTFIT_FACE[face];
  return { src: `assets/img/ione_${o}_${f}.webp`, cls: f !== face ? ` f-${f}` : '' };
}
// opts: { cg, cgIone, npc, mentor, dressed, sprite:false }
function sceneHtml(scene, face, extra = '', opts = {}) {
  // 插图缺失时退回场景背景（两层背景，第一层加载失败就显示第二层）
  const bg = opts.cg ? `${bgUrl(opts.cg)}'), url('${bgUrl(scene)}` : bgUrl(scene);
  let ione = '';
  if (opts.dressed && S) ione = dressedHtml(S.look, 'ione-dressed');
  else if (face && FACES.includes(face) && !opts.cgIone) ione = `<img class="ione f-${face}${outfitFace(face).cls}" data-testid="ione" data-face="${face}" src="${outfitFace(face).src}" onerror="this.onerror=null;this.src='assets/img/ione_chiton_${face}.webp'" alt="${esc(t(SPEAKERS.ione))}">`;
  const npcSrc = opts.npc ? portraitOf(opts.npc) : null;
  const npc = npcSrc ? `<img class="npc" data-testid="npc" data-npc="${opts.npc}" src="${npcSrc}" alt="" ${hideBroken}>` : '';
  const cls = (npc ? ' has-npc' : '') + (opts.cg ? ' is-cg' : '');
  return `<div class="scene${cls}" data-testid="scene" data-scene="${opts.cg || scene}" style="background-image:url('${bg}')">${npc}${ione}${extra}</div>`;
}
const AMBIENT = ['shore', 'room', 'hall', 'kitchen', 'harbor', 'agora', 'temple', 'pasture', 'storm'];
function enterScene(scene) {
  document.body.classList.toggle('storm', scene === 'storm');
  document.body.classList.toggle('dream', scene.startsWith('dream_'));
  audio.ambient(AMBIENT.includes(scene) ? scene : scene.startsWith('dream_') ? null : 'room');
}
// 整句配音（有就播整句，没有就播一声语气）
let lastVoiced = null;
function lineKey(text) { let h = 0; for (const ch of text) h = (h * 31 + ch.codePointAt(0)) >>> 0; return h.toString(36); }
function speak(face, key, text) {
  if (key === lastVoiced) return;
  lastVoiced = key;
  const lang = getLang();
  if (text && DATA.lines && DATA.lines[lang]) {
    const seg = DATA.lines[lang][lineKey(text[lang] ?? text.zh)];
    if (seg) { audio.voiceSegment(`assets/audio/lines/${lang}_${seg[0]}.mp3`, seg[1], seg[2]); return; }
  }
  const n = face && (VOICE[lang] || {})[face];
  if (n) audio.voice(`assets/audio/voice/${lang}/${face}_${1 + Math.floor(Math.random() * n)}.mp3`);
}
FACES.forEach((f) => { const i = new Image(); i.src = `assets/img/ione_chiton_${f}.webp`; });

// ---------- 顶栏 ----------
const btnLang = document.getElementById('btn-lang'), btnMute = document.getElementById('btn-mute');
function renderTopbar() {
  btnLang.textContent = t('langBtn');
  btnMute.textContent = audio.isMuted() ? t('unmute') : t('mute');
  document.documentElement.lang = getLang() === 'zh' ? 'zh' : 'en';
  document.title = getLang() === 'zh' ? '伊萨卡的海之女' : 'Ione of Ithaca';
}
btnLang.addEventListener('click', () => { setLang(getLang() === 'zh' ? 'en' : 'zh'); renderTopbar(); current(); });
btnMute.addEventListener('click', () => { audio.setMuted(!audio.isMuted()); renderTopbar(); });
document.addEventListener('pointerdown', () => audio.unlock());

// ---------- 标题 ----------
function titleScreen() {
  S = null; enterScene('shore');
  html(`<div class="title-screen">
    ${sceneHtml('shore', 'calm', `<div class="title-text"><h1>${esc(t('title'))}</h1><h2>${esc(t('subtitle'))}</h2></div>`)}
    <div class="stack">
      ${autoInfo() ? `<button class="primary" data-testid="continue" id="b-cont">${esc(T('继续', 'Continue'))} <small>${esc(autoInfo())}</small></button>` : ''}
      <button class="${autoInfo() ? '' : 'primary'}" data-testid="new-game" id="b-new">${esc(t('newGame'))}</button>
      <button data-testid="load" id="b-load">${esc(t('load'))}</button>
      <button data-testid="gallery" id="b-gal">${esc(T('结局图鉴', 'Ending Gallery'))}</button>
      <button data-testid="records" id="b-rec">${esc(t('records'))}</button>
    </div></div>`);
  on('#b-new', () => show(setupScreen));
  on('#b-cont', () => resume(loadGame('auto').state));
  on('#b-load', () => show(() => slotScreen('load')));
  on('#b-rec', () => show(recordsScreen));
  on('#b-gal', () => galleryScreen());
}

function autoInfo() {
  const d = loadGame('auto'), st = d && d.state;
  return st && !st.ending ? `${st.playerName} · ${t('month', { m: G.monthOf(st.week) })} ${t('week', { w: G.weekInMonth(st.week) })}` : '';
}

// ---------- 开局：起名、你的样子、选宠物 ----------
let setup = { name: '', pet: null, mentor: 'm' };
function setupScreen() {
  html(`<div class="card setup">
    <p>${esc(t('yourName'))}</p>
    <input type="text" id="name" data-testid="name" maxlength="20" placeholder="${esc(t('defaultName'))}" value="${esc(setup.name)}">
    <p>${esc(T('你的样子（门托尔）：', 'How you appear (Mentor):'))}</p>
    <div class="mentors">${['m', 'f'].map((g) => `<button data-mentor="${g}" data-testid="mentor-${g}" class="${setup.mentor === g ? 'selected' : ''}">
      <img src="assets/img/npc_mentor_${g}.webp" alt="" ${hideBroken}><span>${esc(g === 'm' ? T('男', 'Man') : T('女', 'Woman'))}</span></button>`).join('')}</div>
    <p>${esc(t('choosePet'))}</p>
    <div class="pets">${Object.entries(PETS).map(([id, p]) =>
      `<button data-pet="${id}" data-testid="pet-${id}" class="${setup.pet === id ? 'selected' : ''}"><img src="assets/img/pet_${id}.webp" alt="" ${hideBroken}><span>${esc(t(p))}</span></button>`).join('')}</div>
    <div class="row"><button id="b-back">${esc(t('back'))}</button>
    <button class="primary" id="b-start" data-testid="start" ${setup.pet ? '' : 'disabled'}>${esc(t('start'))}</button></div>
  </div>`);
  const input = app.querySelector('#name');
  input.addEventListener('input', () => { setup.name = input.value; });
  on('[data-pet]', (e, el) => { setup.pet = el.dataset.pet; current(); });
  on('[data-mentor]', (e, el) => { setup.mentor = el.dataset.mentor; current(); });
  on('#b-back', () => show(titleScreen));
  on('#b-start', () => {
    S = G.newGame(setup.name.trim() || t('defaultName'), setup.pet, setup.mentor);
    setup = { name: '', pet: null, mentor: 'm' };
    audio.playMusic('day');
    runEvents([G.openingEvent()], () => tutorial(() => { S.tutorialSeen = true; autosave(); show(homeScreen); }));
  }, 'good');
}

// ---------- 对话与事件 ----------
// opts: { cg, cgIone, mentor }。她说话时显示对应表情；别人说话时显示那个人的立绘
function playLines(lines, done, scene = 'room', idx = 0, face = null, opts = {}, npc = null) {
  if (idx >= lines.length) return done(face, npc);
  const L = lines[idx];
  const f = L.who === 'ione' ? (L.face || moodFace()) : face;
  const n = L.who !== 'ione' && L.who !== 'narrator' && portraitOf(L.who) ? L.who : npc;
  // 插图（CG）只在开头的旁白里显示；有人开口说话后，换成场景背景和人物立绘
  if (opts.cg && (L.who === 'ione' || n)) opts = { ...opts, cg: null, cgIone: false };
  const key = `${scene}:${idx}:${L.text.zh}`;
  show(() => {
    const who = t(speaker(L.who));
    html(`<div class="vn">${sceneHtml(scene, f, '', { ...opts, npc: n })}
      <div class="card dialogue" data-testid="dialogue">
        ${who ? `<div class="speaker">${esc(who)}</div>` : ''}
        <div class="line">${esc(fill(t(L.text)))}</div>
        <div class="choices"><button class="primary" id="b-next" data-testid="next">${esc(t('next'))}</button></div>
      </div></div>`);
    if (L.who === 'ione') speak(f, key, L.text);
    on('#b-next', () => playLines(lines, done, scene, idx + 1, f, opts, n), 'next');
  });
}
function noteScreen(note, done) {
  show(() => {
    html(`<div class="card note-card" data-testid="history-note"><div class="eyebrow">${esc(T('小知识 · 历史与神话', 'History note'))}</div>
      <p class="line">${esc(t(note))}</p><button class="primary" data-testid="next" id="b-next">${esc(t('next'))}</button></div>`);
    on('#b-next', done, 'next');
  });
}
// 依次处理事件：台词 → 选项 → 回应台词 → 小知识；选项可以接着另一个事件（next）
function runEvents(events, done, i = 0) {
  if (i >= events.length) { enterScene('room'); return done(); }
  const ev = events[i];
  const scene = ev.scene || 'room';
  const opts = { cg: ev.cg, cgIone: ev.cgIone };
  enterScene(scene);
  if (scene === 'storm') audio.sfx('thunder');
  if (scene === 'shore') audio.sfx('wave');
  const after = (next) => {
    const rest = next && G.eventById(next) ? [...events.slice(0, i + 1), G.eventById(next), ...events.slice(i + 1)] : events;
    const go = () => runEvents(rest, done, i + 1);
    if (ev.note) noteScreen(ev.note, go); else go();
  };
  playLines(ev.lines, (face, npc) => {
    if (!ev.choices || !ev.choices.length) { G.markSeen(S, ev); return after(null); }
    show(() => {
      const last = ev.lines[ev.lines.length - 1];
      html(`<div class="vn">${sceneHtml(scene, face, '', { ...opts, npc: 'mentor' })}
        <div class="card dialogue">
        <div class="line muted">${esc(fill(t(last.text)))}</div>
        <div class="choices" data-testid="choices">${ev.choices.map((c, k) =>
          `<button data-choice="${k}" data-testid="choice-${k}">${esc(fill(t(c.text)))}</button>`).join('')}</div>
      </div></div>`);
      on('[data-choice]', (e, el) => {
        const idx = Number(el.dataset.choice);
        const res = G.chooseOption(S, ev, idx);
        if (res.duel) return duelScreen(res.duel, (score) => {
          const r = G.resolveDuel(S, ev, idx, score);
          audio.sfx(r.ok ? 'ending' : 'bad');
          enterScene(scene);
          playLines(r.lines || [], () => after(r.next), scene, 0, face, opts, npc);
        });
        audio.sfx(res.ok ? 'good' : 'bad');
        playLines(res.lines || [], () => after(res.next), scene, 0, face, opts, npc);
      }, null);
    });
  }, scene, 0, null, opts);
}

// 怪物对峙小游戏画面
function duelScreen(id, done) {
  const D = DUELS[id];
  audio.sfx('thunder');
  show(() => {
    html(`<div class="mg-wrap"></div><div class="row" style="margin-top:8px"><button data-testid="mg-skip" id="b-skip">${esc(T('撤退', 'Retreat'))}</button></div>`);
    let finished = false;
    const fin = (score) => { if (finished) return; finished = true; stopMinigame(); done(score); };
    duel(app.querySelector('.mg-wrap'), fin, D);
    on('#b-skip', () => fin(0));
  });
}

// ---------- 开场引导：讲清玩法，但只给悬念、不剧透 ----------
const TUTORIAL = [
  { img: 'act_nighttalk', title: { zh: '你是门托尔', en: 'You are Mentor' },
    text: { zh: '接下来的一年——48 个星期——由你来陪伴、教导伊俄涅。她现在像一只刺猬，谁也不信。你说的每句话、做的每个选择，都会一点一点改变她。', en: 'For the coming year — 48 weeks — you will guide and teach Ione. Right now she is a hedgehog who trusts no one. Every word you say and every choice you make will slowly change her.' } },
  { img: 'act_archery', title: { zh: '每个星期日：安排一周', en: 'Every Sunday: plan the week' },
    text: { zh: '给她安排周一到周六做什么：射箭、航海、织布、放牧、学琴……不同的活动提高不同的能力，有的能赚银币，有的要花银币。\n留意"压力"：太累她会生病；如果她又累又不信任你，可能会偷偷驾船出海。', en: 'Choose what she does Monday to Saturday: archery, sailing, weaving, herding, the lyre... Each activity raises different abilities; some earn silver, some cost it.\nWatch her Stress: overwork makes her ill, and if she is exhausted and doesn\'t trust you, she may slip away to sea.' } },
  { img: 'bg_room', title: { zh: '周末：说一句话，再一起做点什么', en: 'Weekends: a word, then time together' },
    text: { zh: '周末先对她说一句话——夸奖、鼓励、责备，或者沉默。她的性格就是这样慢慢长出来的。\n然后有两次行动：出门、小游戏、教她一个词、送礼物、陪宠物……逛商店、换装、换房间风格不占行动。', en: 'At the weekend, first say something to her — praise, encourage, scold, or stay silent. This is how her personality grows.\nThen you get two actions: going out, mini-games, teaching a word, gifts, the pet... Shopping, dress-up and changing her room are free.' } },
  { img: 'bg_storm', title: { zh: '伊萨卡并不平静', en: 'Ithaca is not at peace' },
    text: { zh: '求婚者霸占着王宫，奥德修斯还没有回来。海里有个声音在叫她的名字。\n有些夜里，她枕边的海螺会嗡嗡作响……而山里和海上，也有不该存在的东西在游荡。', en: 'The suitors have seized the palace, and Odysseus has not come home. A voice in the sea is calling her name.\nOn some nights the shell by her pillow hums... and in the hills and the sea, things that should not exist are stirring.' } },
  { img: 'cg_end_heroine', blur: true, title: { zh: '一年后，她会成为谁？', en: 'Who will she be in a year?' },
    text: { zh: '英雄、诗人、航海家、祭司……或者回到大海。至少有 18 种未来在等着她，有些藏得很深。\n每达成一个结局，它都会作为一张留念收进"结局图鉴"。', en: 'A hero, a bard, a navigator, a priestess... or a daughter of the sea. At least 18 futures await her, and some are well hidden.\nEvery ending you reach is kept as a keepsake in the Ending Gallery.' } },
];
function tutorial(done, i = 0) {
  if (i >= TUTORIAL.length) return done();
  const c = TUTORIAL[i];
  show(() => {
    html(`<div class="card tutorial" data-testid="tutorial">
      <div class="tut-img${c.blur ? ' blur' : ''}" style="background-image:url('${bgUrl(c.img)}')"></div>
      <div class="eyebrow">${i + 1} / ${TUTORIAL.length}</div>
      <h2>${esc(t(c.title))}</h2>
      ${t(c.text).split('\n').map((x) => `<p>${esc(x)}</p>`).join('')}
      <div class="row between"><button id="b-skip" data-testid="tut-skip">${esc(T('跳过', 'Skip'))}</button>
      <button class="primary" id="b-next" data-testid="next">${esc(i === TUTORIAL.length - 1 ? T('开始这一年', 'Begin the year') : t('next'))}</button></div></div>`);
    on('#b-next', () => tutorial(done, i + 1), 'next');
    on('#b-skip', () => done());
  });
}

// ---------- 结局图鉴：每个达成过的结局是一张留念 ----------
async function galleryData() {
  const all = await RecordsBackend.list();
  const by = {};
  for (const r of all) { (by[r.ending] ||= []).push(r); }
  return by;
}
async function galleryScreen(back = titleScreen) {
  const by = await galleryData();
  const ids = Object.keys(ENDINGS), got = ids.filter((id) => by[id]).length;
  show(() => {
    html(`<div class="card" data-testid="gallery-screen"><div class="row between"><h2>${esc(T('结局图鉴', 'Ending Gallery'))}</h2><b class="muted">${got} / ${ids.length}</b></div>
      <div class="gallery-grid">${ids.map((id) => {
        const rs = by[id];
        if (!rs) return `<div class="gal-card locked" data-testid="gal-${id}"><div class="gal-img" style="background-image:url('assets/img/cg_end_${id}.webp')"></div><b>？？？</b><small>${esc(t(ENDING_HINTS[id]))}</small></div>`;
        const first = rs[0];
        return `<button class="gal-card" data-gal="${id}" data-testid="gal-${id}"><div class="gal-img" style="background-image:url('assets/img/cg_end_${id}.webp')"></div><b>${esc(t(ENDINGS[id].name))}</b><small>${esc(first.date)} · ${esc(t('times', { n: rs.length }))}</small></button>`;
      }).join('')}</div>
      <div class="row" style="margin-top:14px"><button data-testid="back" id="b-back">${esc(t('back'))}</button></div></div>`);
    on('[data-gal]', (e, el) => keepsake(el.dataset.gal, by[el.dataset.gal], () => galleryScreen(back)));
    on('#b-back', () => show(back));
  });
}
// 一张留念：大图、结局文字、那一局她的性格和尾声、日期
function keepsake(id, recs, back) {
  const last = recs[recs.length - 1];
  show(() => {
    const E = ENDINGS[id];
    html(`<div class="keepsake" data-testid="keepsake">
      <div class="ks-img" style="background-image:url('assets/img/cg_end_${id}.webp')"><div class="ks-stamp">${esc(T('留念', 'Keepsake'))}<br><small>${esc(last.date)}</small></div></div>
      <div class="card ks-text"><div class="eyebrow">${esc(T('结局', 'Ending'))}</div><h2>${esc(t(E.name))}</h2>
        <p class="line">${esc(t(E.text))}</p>
        ${EPILOGUE[last.personality] ? `<p class="line muted">${esc(t(EPILOGUE[last.personality]))}</p>` : ''}
        <p class="muted">${esc(last.name)} · ${esc(t(PERSONALITIES[last.personality] || { zh: '', en: '' }))} · ${esc(t('score'))} ${last.score}</p>
        <div class="row"><button data-testid="back" id="b-back">${esc(t('back'))}</button></div></div></div>`);
    on('#b-back', back);
  });
}

// ---------- 主画面 ----------
function dateHtml() {
  const m = G.monthOf(S.week), w = G.weekInMonth(S.week);
  return `<div class="date" data-testid="date">${esc(t('month', { m }))} · ${esc(t('week', { w }))}<small>${ATTIC_MONTHS[m - 1]}</small></div>`;
}
function statsHtml() {
  return `<div class="stats" data-testid="stats">${Object.keys(STATS).map((k) =>
    `<div class="stat ${k === 'stress' ? 'stress' : ''}"><span>${esc(t(STATS[k]))}</span><b>${S.stats[k]}</b></div>`).join('')}
    <div class="stat"><span>${esc(t('silver'))}</span><b data-testid="silver">${S.silver}</b></div></div>`;
}
// 她的房间：当前房间风格的整张画（旧的 bg_room 作为后备）
function roomHtml(inner = '', extraCls = '') {
  const R = (S && ROOMS[S.room]) || ROOMS.simple;
  return `<div class="scene room ${extraCls}" data-testid="scene" data-scene="room" style="background-image:url('assets/img/${R.file}.webp'), url('assets/img/bg_room.webp')">${inner}</div>`;
}
function roomBonusText() {
  const b = G.roomBonus(S) || {};
  const txt = Object.entries(b).map(([k, v]) => `${esc(statName(k))}${v > 0 ? '+' : ''}${v}`).join(' ');
  return txt || esc(T('无加成（周末可以去"木匠和装饰"换风格）', 'no bonus (change the style at the carpenter on weekends)'));
}
function furnitureBonus() { const b = S ? G.roomBonus(S) : null; return b && Object.keys(b).length ? b : null; }
// 宠物站在房间里（海豚住在海里，用圆形动图）；点它会冒爱心
function petHtml() {
  if (!S) return '';
  const name = esc(t(PETS[S.pet]));
  if (S.pet === 'dolphin') return `<button class="pet-corner" data-testid="pet" title="${name}"><img src="assets/img/pet_dolphin_anim.webp" alt="${name}" onerror="this.onerror=null;this.src='assets/img/pet_dolphin.webp'"></button>`;
  return `<button class="pet-sprite pet-${S.pet}" data-testid="pet" title="${name}"><img src="assets/img/pet_${S.pet}_sprite.webp" alt="${name}" onerror="this.parentNode.classList.add('fallback');this.onerror=null;this.src='assets/img/pet_${S.pet}_anim.webp'"></button>`;
}
// 猫头鹰停在窗台上：窗台在房间图（4:3）里大约 x=80%、y=54%；按背景 cover 裁切换算成画面坐标
const SILL = { default: [0.8, 0.54], florence: [0.64, 0.5], vienna: [0.74, 0.54] };
function placePets() {
  document.querySelectorAll('.scene .pet-owl').forEach((owl) => {
    const box = owl.closest('.scene'); if (!box) return;
    const cw = box.clientWidth, ch = box.clientHeight; if (!cw || !ch) return;
    const sc = Math.max(cw / 1600, ch / 1200), iw = 1600 * sc, ih = 1200 * sc, ox = (cw - iw) / 2, oy = (ch - ih) / 2;
    const [fx, fy] = SILL[S && S.room] || SILL.default;
    let x = ox + fx * iw; const y = oy + fy * ih;
    x = Math.min(cw - 0.06 * ih, Math.max(0.06 * ih, x)); // 画面被裁掉时，留在画面里
    Object.assign(owl.style, { left: `${x}px`, top: `${y}px`, right: 'auto', bottom: 'auto', height: `${0.15 * ih}px`, transform: 'translate(-50%, -96%)' });
  });
}
window.addEventListener('resize', () => placePets());
function hearts(el) {
  const box = el.closest('.scene') || el.parentNode;
  for (let i = 0; i < 5; i++) {
    const h = document.createElement('span'); h.className = 'heart'; h.textContent = '♥';
    const r = el.getBoundingClientRect(), b = box.getBoundingClientRect();
    h.style.left = `${r.left - b.left + r.width / 2 + (Math.random() - 0.5) * r.width}px`; h.style.top = `${r.top - b.top + 10}px`;
    h.style.animationDelay = `${i * 0.12}s`; box.appendChild(h); setTimeout(() => h.remove(), 1600);
  }
}
let homeFace = null;
function homeScreen() {
  enterScene('room');
  const pers = personalityOf(S);
  const outfitOn = S.look.outfit !== 'chiton' && DATA.wardrobe;
  const figure = homeFace && !outfitOn
    ? `<img class="ione f-${homeFace}" data-testid="ione" data-face="${homeFace}" src="assets/img/ione_chiton_${homeFace}.webp" alt="">`
    : (DATA.wardrobe ? dressedHtml(S.look, 'ione-dressed') : `<img class="ione f-${moodFace()}" data-testid="ione" data-face="${moodFace()}" src="assets/img/ione_chiton_${moodFace()}.webp" alt="">`);
  html(`<div class="home">
    <div class="portrait" data-testid="portrait">${roomHtml(figure + petHtml())}</div>
    <div class="card">
      ${dateHtml()}
      <p class="muted">${esc(t('personality'))}：<b data-testid="personality">${esc(t(PERSONALITIES[pers]))}</b> ·
        ${esc(t('callsYou'))}：<b>${esc(t(nameForYou(S)))}</b></p>
      <p class="muted" data-testid="room-bonus">${esc(T('房间', 'Room'))}：<b>${esc(t((ROOMS[S.room] || ROOMS.simple).name))}</b> · ${esc(T('每周', 'weekly'))} ${roomBonusText()}</p>
      ${statsHtml()}
      <div class="row" style="margin-top:16px">
        <button class="primary" id="b-plan" data-testid="plan">${esc(t('schedule'))}</button>
        <button id="b-talk" data-testid="talk">${esc(t('talk'))}</button>
        <button id="b-save" data-testid="save">${esc(t('save'))}</button>
        <button id="b-title" data-testid="to-title">${esc(t('toTitle'))}</button>
        <button id="b-help" data-testid="help" title="${esc(T('游戏说明', 'How to play'))}">?</button>
      </div>
      <p id="talk-line" class="line" data-testid="talk-line">${esc(homeScreen.talkLine || '')}</p>
    </div></div>`);
  on('#b-plan', () => { homeFace = null; homeScreen.talkLine = ''; show(planScreen); });
  on('#b-talk', () => {
    const p = personalityOf(S);
    const lines = TALK[p];
    const ok = G.talk(S);
    const line = ok ? lines[Math.floor(Math.random() * lines.length)] : { zh: '（她今天已经不想再聊了。）', en: "(She doesn't feel like talking more today.)" };
    homeFace = ok ? (p === 'cheerful' ? 'happy' : DEFAULT_FACE[p]) : 'thinking';
    homeScreen.talkLine = `${t(SPEAKERS.ione)}：${fill(t(line))}`;
    current();
    if (ok) speak(homeFace, `talk:${S.week}:${line.zh}`, line);
  });
  on('[data-testid=pet]', (e, el) => {
    hearts(el); audio.sfx('good');
    el.classList.remove('jump'); void el.offsetWidth; el.classList.add('jump'); setTimeout(() => el.classList.remove('jump'), 750);
    // 每周摸一次，亲密度 +2
    if (S.pettedWeek !== S.week) { S.pettedWeek = S.week; S.petLove = Math.min(100, S.petLove + 2); }
    toast(fill(t(PET_PAT[S.pet] || PET_PAT.cat)));
  }, null);
  on('#b-save', () => show(() => slotScreen('save')));
  on('#b-help', () => tutorial(() => show(homeScreen)));
  on('#b-title', () => { homeFace = null; homeScreen.talkLine = ''; show(titleScreen); });
}
const PET_PAT = {
  owl: { zh: '猫头鹰歪了歪头，"咕"了一声。', en: 'The owl tilts its head and hoots softly.' },
  hound: { zh: '小猎犬扑过来舔你的手，尾巴摇成了风车。', en: 'The puppy licks your hand, tail spinning like a windmill.' },
  cat: { zh: '猫眯起眼睛，勉强让你摸了一下。', en: 'The cat narrows its eyes and allows exactly one pat.' },
  dolphin: { zh: '远处的海面上，一道银色的弧线跃起又落下。', en: 'Far out on the water, a silver arc leaps and falls.' },
  tortoise: { zh: '陆龟慢慢地、慢慢地把头伸了出来。', en: 'The tortoise slowly, slowly pokes its head out.' },
  goat: { zh: '小山羊用角顶了顶你的膝盖，想要无花果。', en: 'The little goat butts your knee, asking for figs.' },
};

// ---------- 安排日程 ----------
let plan = ['rest', 'rest', 'rest', 'rest', 'rest', 'rest'];
function planScreen() {
  const days = t('days');
  const cost = plan.reduce((sum, a) => sum + (ACTIVITIES[a].cost || 0), 0);
  html(`<div class="card">
    ${dateHtml()}
    <h3>${esc(t('schedule'))}</h3>
    <div class="plan">${days.map((d, i) => `<label>${esc(d)}
      <select data-day="${i}" data-testid="day-${i}">${Object.keys(ACTIVITIES).map((id) => {
        const a = ACTIVITIES[id];
        const extra = a.cost ? ` (−${a.cost})` : a.silver ? ` (+${a.silver})` : '';
        return `<option value="${id}" ${plan[i] === id ? 'selected' : ''}>${esc(actName(id) + extra)}</option>`;
      }).join('')}</select><span class="fx" data-fx="${i}">${fxHtml(plan[i])}</span></label>`).join('')}</div>
    <p class="muted" data-testid="plan-cost">${esc(t('silver'))}：${S.silver} · −${cost}</p>
    <div class="row">
      <button id="b-back">${esc(t('back'))}</button>
      <button class="primary" id="b-run" data-testid="run">${esc(t('run'))}</button>
    </div></div>`);
  // 改选项时不重画整个画面（有的手机重画后下拉框会显示不出选中的内容），只更新效果和花费
  app.querySelectorAll('select').forEach((sel) => {
    sel.value = plan[+sel.dataset.day];
    sel.addEventListener('change', () => {
      plan[+sel.dataset.day] = sel.value;
      app.querySelector(`[data-fx="${sel.dataset.day}"]`).innerHTML = fxHtml(sel.value);
      const cost2 = plan.reduce((sum, a) => sum + (ACTIVITIES[a].cost || 0), 0);
      app.querySelector('[data-testid=plan-cost]').textContent = `${t('silver')}：${S.silver} · −${cost2}`;
    });
  });
  on('#b-back', () => show(homeScreen));
  on('#b-run', () => {
    if (!G.canAfford(S, plan)) { audio.sfx('bad'); toast(t('notEnoughSilver')); return; }
    audio.sfx('week');
    const days = G.runWeek(S, plan, Math.random, furnitureBonus());
    S.phase = 'respond'; // 这周已经过完，等周末回应
    if (days.some((d) => (d.delta.silver || 0) > 0)) setTimeout(() => audio.sfx('coin'), 700);
    if (days.some((d) => d.note)) setTimeout(() => audio.sfx('bad'), 400);
    show(() => weekResultScreen(days));
  }, null);
}

// 每个活动的主要效果，显示在下拉框下面
function fxHtml(id) {
  const A = ACTIVITIES[id]; if (!A) return '';
  return Object.entries(A.fx).map(([k, v]) => `<i class="${(k === 'stress' ? v < 0 : v > 0) ? 'up' : 'down'}">${esc(statName(k))}${v > 0 ? '+' : ''}${v}</i>`).join(' ');
}
function weekResultScreen(days) {
  const names = t('days');
  // 这周做得最多的活动，配一张她在做这件事的插图
  const count = {}; days.forEach((d) => { count[d.act] = (count[d.act] || 0) + 1; });
  const top = Object.entries(count).sort((a, b) => b[1] - a[1])[0][0];
  html(`<div class="card week-result">
    <div class="act-cg" style="background-image:url('assets/img/act_${top}.webp')" data-testid="act-cg"></div>
    ${dateHtml()}
    ${furnitureBonus() ? `<p class="muted">${esc(T('房间加成', 'Room bonus'))}（${esc(t((ROOMS[S.room] || ROOMS.simple).name))}）：${roomBonusText()}</p>` : ''}
    <ul class="daylog" data-testid="daylog">${days.map((d, i) => `<li><b>${esc(names[i])}</b> ${esc(actName(d.act))}
      ${d.note ? `<div class="${d.note === 'sick' ? 'down' : 'muted'}">${esc(t(d.note))}</div>` : ''}
      <div>${deltaHtml(d.delta)}</div></li>`).join('')}</ul>
    <button class="primary" id="b-next" data-testid="next">${esc(t('next'))}</button></div>`);
  on('#b-next', () => show(weekendScreen), 'next');
}

// ---------- 周末：先回应她，再看剧情，然后周末活动 ----------
function weekendScreen() {
  html(`<div class="vn">${sceneHtml('room', moodFace(), '', { npc: 'mentor' })}
    <div class="card dialogue">
    ${dateHtml()}
    <p class="line">${esc(t('weekendTitle'))}</p>
    <div class="choices">${['praise', 'encourage', 'scold', 'silent'].map((k) =>
      `<button data-resp="${k}" data-testid="resp-${k}">${esc(t(k))}</button>`).join('')}</div></div></div>`);
  on('[data-resp]', (e, el) => {
    const kind = el.dataset.resp;
    const pers = personalityOf(S);
    S.phase = 'story';
    G.weekendResponse(S, kind);
    const reply = { who: 'ione', text: WEEKEND_REPLY[pers][kind], face: replyFace(pers, kind) };
    playLines([reply], () => weekendStory(), 'room');
  });
}
function weekendStory() {
  const main = G.pendingEvents(S);
  const m = G.monthOf(S.week), w = G.weekInMonth(S.week);
  const dream = DREAMS.find((d) => d.month === m && d.week === w && !S.dreams.includes(d.id));
  const rnd = !main.length && !dream ? G.pickRandomEvent(S) : null;
  const then = () => { S.phase = 'menu'; return S.flags.defeated ? endOfWeek() : show(() => weekendMenu()); };
  runEvents([...main, ...(rnd ? [rnd] : [])], () => (dream ? runDream(dream, then) : then()));
}
function endOfWeek() {
  S.phase = 'plan';
  if (S.flags.defeated || G.advanceWeek(S)) return finishGame();
  autosave();
  show(homeScreen);
}

// ---------- 结局 ----------
const ENDING_SCENE = { defeat: 'hall', sailedAway: 'shore', returnSea: 'shore', defier: 'storm', family: 'room', athena: 'temple', navigator: 'harbor', archer: 'hall', bard: 'agora', priestess: 'temple', herder: 'pasture', envoy: 'agora', guardian: 'hall', ordinary: 'agora' };
const ENDING_FACE = { defeat: null, sailedAway: null, returnSea: 'tearful', defier: 'determined', family: 'tearful' };
async function finishGame() {
  G.finish(S);
  const rec = { name: S.playerName, ending: S.ending, personality: S.personality, score: S.score, date: new Date().toISOString().slice(0, 10) };
  const isNew = !(await RecordsBackend.list()).some((r) => r.ending === S.ending);
  await RecordsBackend.add(rec);
  saveGame('auto', null);
  const done = S;
  const scene = ENDING_SCENE[done.ending] || 'agora';
  const face = done.ending in ENDING_FACE ? ENDING_FACE[done.ending] : (done.personality === 'hedgehog' ? 'smirk' : 'happy');
  enterScene(scene);
  audio.sfx('ending');
  // 先全屏揭晓结局插图和名字，点"继续"再看结局文字
  const E0 = ENDINGS[done.ending];
  show(() => {
    html(`<div class="ending-reveal" data-testid="ending-reveal" style="background-image:url('assets/img/cg_end_${done.ending}.webp'), url('${bgUrl(scene)}')">
      <div class="reveal-text"><div class="eyebrow">${esc(T('结局', 'Ending'))}</div><h1>${esc(t(E0.name))}</h1></div>
      <button class="primary reveal-next" data-testid="next" id="b-next">${esc(t('next'))}</button></div>`);
    on('#b-next', () => show(endingText), 'next');
  });
  function endingText() {
    const E = ENDINGS[done.ending];
    html(`<div class="vn">${sceneHtml(scene, face, '', { cg: `cg_end_${done.ending}`, cgIone: true })}
      <div class="card ending" data-testid="ending">
      <p class="muted">${esc(t('ending'))}</p>
      <h2 data-testid="ending-name">${esc(t(E.name))}</h2>
      <p class="line">${esc(t(E.text))}</p>
      <p class="line">${esc(t(EPILOGUE[done.personality]))}</p>
      <p>${esc(t('personality'))}：<b>${esc(t(PERSONALITIES[done.personality]))}</b> · ${esc(t('score'))}：<b data-testid="score">${done.score}</b></p>
      ${isNew ? `<div class="unlock new-ending" data-testid="new-ending"><img src="assets/img/cg_end_${done.ending}.webp" alt=""><div><b>${esc(T('新结局！已收入结局图鉴', 'New ending! Added to the Ending Gallery'))}</b></div></div>` : ''}
      <div class="row"><button class="primary" id="b-gal" data-testid="gallery">${esc(T('结局图鉴', 'Ending Gallery'))}</button>
      <button id="b-rec" data-testid="records">${esc(t('records'))}</button>
      <button id="b-title" data-testid="to-title">${esc(t('toTitle'))}</button></div></div></div>`);
    on('#b-rec', () => show(recordsScreen));
    on('#b-gal', () => galleryScreen(titleScreen));
    on('#b-title', () => show(titleScreen));
  }
}

// ---------- 存档 ----------
function autosave() { saveGame('auto', S); }
function slotLabel(slot) { return slot === 'auto' ? t('autoSlot') : t('slot', { n: slot }); }
function slotScreen(mode) {
  const rows = SLOTS.filter((s) => mode === 'load' || s !== 'auto').map((slot) => {
    const data = loadGame(slot), st = data && data.state;
    const info = st ? `${st.playerName} · ${t('month', { m: G.monthOf(st.week) })} ${t('week', { w: G.weekInMonth(st.week) })}` : t('empty');
    return `<button data-slot="${slot}" data-testid="slot-${slot}" ${mode === 'load' && !st ? 'disabled' : ''}>${esc(slotLabel(slot))} — ${esc(info)}</button>`;
  }).join('');
  html(`<div class="card"><h3>${esc(t(mode === 'save' ? 'save' : 'load'))}</h3>
    <div class="choices">${rows}</div>
    <div class="row" style="margin-top:16px"><button id="b-back" data-testid="back">${esc(t('back'))}</button></div></div>`);
  on('[data-slot]', (e, el) => {
    const slot = el.dataset.slot === 'auto' ? 'auto' : Number(el.dataset.slot);
    if (mode === 'save') { saveGame(slot, S); toast(t('saved')); current(); }
    else resume(loadGame(slot).state);
  });
  on('#b-back', () => show(mode === 'save' ? homeScreen : titleScreen));
}

function resume(state) {
  S = G.migrate(state); audio.playMusic('day');
  const ph = S.phase || 'plan';
  if (ph === 'respond') show(weekendScreen);
  else if (ph === 'story') weekendStory();
  else if (ph === 'menu') show(() => weekendMenu());
  else show(homeScreen);
}

// ---------- 记录殿堂 ----------
let recordsCache = [];
function recordsScreen() {
  RecordsBackend.list().then((all) => { recordsCache = all; drawRecords(); });
  drawRecords();
}
function drawRecords() {
  const all = recordsCache;
  const top = [...all].sort((a, b) => b.score - a.score).slice(0, 20);
  const counts = {}; all.forEach((r) => { counts[r.ending] = (counts[r.ending] || 0) + 1; });
  html(`<div class="card" data-testid="hall">
    <h2>${esc(t('records'))}</h2>
    <h3>${esc(t('rank'))}</h3>
    ${top.length ? `<div class="table-wrap"><table data-testid="leaderboard"><tr><th>#</th><th></th><th>${esc(t('ending'))}</th><th>${esc(t('personality'))}</th><th>${esc(t('score'))}</th><th></th></tr>
      ${top.map((r, i) => `<tr><td>${i + 1}</td><td>${esc(r.name)}</td><td>${esc(t(ENDINGS[r.ending]?.name || { zh: r.ending, en: r.ending }))}</td>
      <td>${esc(t(PERSONALITIES[r.personality] || { zh: '', en: '' }))}</td><td>${r.score}</td><td class="muted">${esc(r.date)}</td></tr>`).join('')}</table></div>`
      : `<p class="muted">${esc(t('noRecords'))}</p>`}
    <h3>${esc(t('gallery'))}</h3>
    <table data-testid="gallery">${Object.entries(ENDINGS).map(([id, E]) =>
      `<tr><td>${counts[id] ? esc(t(E.name)) : '？？？'}</td><td class="muted">${esc(t('times', { n: counts[id] || 0 }))}</td></tr>`).join('')}</table>
    <div class="row" style="margin-top:16px"><button id="b-title" data-testid="to-title">${esc(t('toTitle'))}</button></div></div>`);
  on('#b-title', () => show(titleScreen));
}

// ---------- 交给周末和梦境模块用的工具 ----------
const ctx = {
  get S() { return S; }, DATA, app, esc, T, show, html, on, toast, fill, sceneHtml, roomHtml, dressedHtml, enterScene, speak, playLines,
  runEvents, noteScreen, moodFace, endOfWeek, homeScreen, dateHtml, current: () => current(), autosave, petHtml, portraitOf, hearts,
};
initWeekend(ctx);
initDreams(ctx);

// ---------- 启动 ----------
renderTopbar();
show(titleScreen);
dataReady.then(() => { if (!S) current(); });
// 测试和调试用：读取状态、直接载入一个存档状态并回到主画面
window.__ione = {
  get state() { return S; }, EVENTS, DATA, ready: dataReady,
  load(state) { S = G.migrate(JSON.parse(JSON.stringify(state))); audio.playMusic('day'); show(homeScreen); },
  newState(name = 'T', pet = 'owl', mentor = 'm') { return G.newGame(name, pet, mentor); },
};
