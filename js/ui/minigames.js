// 小游戏：射箭、做蜂蜜饼、织布记忆、竖琴节奏、配对、问答。
// 每个函数把游戏画进 el，结束时调用 done(得分 0-100)。手机触屏和电脑鼠标都能玩。
import { t } from '../i18n.js';
import * as audio from '../audio.js';

const esc = (x) => String(x).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const T = (zh, en) => t({ zh, en });
let stopCurrent = null; // 离开画面时停止动画
export function stopMinigame() { if (stopCurrent) stopCurrent(); stopCurrent = null; }
function loop(fn) {
  let id = 0, alive = true;
  const step = (ts) => { if (!alive) return; fn(ts); id = requestAnimationFrame(step); };
  id = requestAnimationFrame(step);
  stopCurrent = () => { alive = false; cancelAnimationFrame(id); };
  return stopCurrent;
}
function frame(el, title, help, body) {
  el.innerHTML = `<div class="card minigame" data-testid="minigame"><h3>${esc(title)}</h3><p class="muted">${esc(help)}</p>${body}</div>`;
  return el.querySelector('.minigame');
}

// ---------- 第一次玩某个小游戏时，先看"怎么玩"卡片 ----------
const S_ = (ico, zh, en) => ({ ico, text: { zh, en } });
const HOWTO = {
  archery: [S_('🎯', '靶子会左右移动，十字准星会轻轻晃。', 'The target slides left and right; the crosshair sways a little.'),
    S_('✛', '等十字准星正好落在靶心（中间金色）时，点"放箭"或按空格。', 'When the crosshair is right over the gold bullseye, tap "Loose" or press Space.'),
    S_('🏹', '一共 5 支箭。越靠近靶心分越高，前两支箭靶子会慢一点。', '5 arrows in all. Closer to the centre scores more; the first two arrows move slower.')],
  kitchen: [S_('↔', '指针会在长条上来回摆动。', 'A pointer swings back and forth along the bar.'),
    S_('🍯', '指针走到金色区域里时，点"停"或按空格。', 'Tap "Stop" or press Space while the pointer is inside the golden zone.'),
    S_('4', '一共 4 步，金色区域会越来越窄。', '4 steps in all; the golden zone gets narrower each time.')],
  loom: [S_('👀', '先看：四个格子会按顺序亮起来。', 'Watch: the four tiles light up in order.'),
    S_('👆', '再照着同样的顺序点一遍。', 'Then tap them in the same order.'),
    S_('➕', '每答对一轮就多一格，记得越长分越高。', 'Each round adds one more; the longer you remember, the higher the score.')],
  lyre: [S_('🎵', '蓝色音符从右往左滑向左边的金线。', 'Blue notes slide from right to left toward the golden line.'),
    S_('⏱', '音符碰到金线的那一刻，点"拨弦"或按空格。', 'Tap "Pluck" or press Space the moment a note touches the line.'),
    S_('✨', '越准越好：正好对上是"完美"。', 'The closer, the better — right on the line is "Perfect".')],
  duel: [S_('⚠', '怪物攻击前，画面上会出现大箭头，告诉你它从哪边攻过来。', 'Before it attacks, a big arrow shows which side the monster is coming from.'),
    S_('↔', '马上点同一个方向的"躲"按钮（或按方向键）。躲错或太慢会掉一颗心。', 'Quickly tap the matching "Dodge" button (or arrow key). Wrong or late costs a heart.'),
    S_('⚔', '躲开后会出现出手条：等指针走进金色区域，点"出手"（或空格）打中它。', 'After a dodge a strike bar appears: when the pointer is in the gold zone, tap "Strike" (or Space).'),
    S_('♥', '你有 3 颗心。把怪物的方块打完就赢了。前两回合是练习，会慢一点，正确的按钮会发光。', 'You have 3 hearts; empty the monster\'s blocks to win. The first two rounds are practice — slower, with the right button glowing.')],
};
function intro(el, key, title, start) {
  let seen = false;
  try { seen = localStorage.getItem('ione_howto_' + key) === '1'; } catch {}
  if (seen || !HOWTO[key]) return start();
  el.innerHTML = `<div class="card minigame howto" data-testid="howto"><div class="eyebrow">${esc(T('怎么玩', 'How to play'))}</div><h3>${esc(title)}</h3>
    <ol>${HOWTO[key].map((x) => `<li><span class="ico">${x.ico}</span><span>${esc(t(x.text))}</span></li>`).join('')}</ol>
    <button class="primary" data-testid="mg-start">${esc(T('明白了，开始！', 'Got it — start!'))}</button></div>`;
  el.querySelector('[data-testid=mg-start]').addEventListener('click', () => { try { localStorage.setItem('ione_howto_' + key, '1'); } catch {} audio.sfx('click'); start(); });
}

// ---------- 射箭：靶子左右移动，准星轻轻晃动，看准了就放箭。5 支箭 ----------
export function archery(el, done) { intro(el, 'archery', T('射箭', 'Archery'), () => archeryGame(el, done)); }
function archeryGame(el, done) {
  const g = frame(el, T('射箭', 'Archery'), T('等十字准星落在金色靶心上再放箭（或按空格）。共 5 支箭。', 'Loose (or press Space) when the crosshair is over the gold bullseye. 5 arrows.'),
    `<canvas width="480" height="300" class="mg-canvas"></canvas><div class="row"><button class="primary" data-testid="mg-act">${esc(T('放箭', 'Loose'))}</button><span class="mg-score"></span></div>`);
  const cv = g.querySelector('canvas'), c = cv.getContext('2d'), info = g.querySelector('.mg-score');
  let arrows = 5, total = 0, last = null, hits = [], t0 = performance.now(), aim = { x: 240, y: 150 }, tgt = { x: 240, y: 150 };
  const R = 70;
  const draw = (ts) => {
    const k = (ts - t0) / 1000;
    const slow = arrows > 3 ? 0.55 : 1; // 前两支箭慢一点
    tgt.x = 240 + Math.sin(k * 1.3 * slow) * 150; tgt.y = 140 + Math.sin(k * 0.7 * slow) * 25;
    aim.x = 240 + Math.sin(k * 2.9 * slow) * 22 + Math.cos(k * 1.7 * slow) * 14; aim.y = 150 + Math.cos(k * 3.4 * slow) * 18;
    c.fillStyle = '#cfe6ee'; c.fillRect(0, 0, 480, 300); c.fillStyle = '#d9c79c'; c.fillRect(0, 230, 480, 70);
    ['#f6efe2', '#2c6aa0', '#f6efe2', '#b0413e', '#c99a3b'].forEach((col, i) => { c.beginPath(); c.arc(tgt.x, tgt.y, R * (1 - i * 0.2), 0, 7); c.fillStyle = col; c.fill(); c.strokeStyle = '#2b2420'; c.stroke(); });
    hits.forEach((h) => { c.fillStyle = '#2b2420'; c.beginPath(); c.arc(tgt.x + h.dx, tgt.y + h.dy, 4, 0, 7); c.fill(); });
    c.strokeStyle = '#2b2420'; c.lineWidth = 2; c.beginPath(); c.arc(aim.x, aim.y, 14, 0, 7); c.moveTo(aim.x - 22, aim.y); c.lineTo(aim.x + 22, aim.y); c.moveTo(aim.x, aim.y - 22); c.lineTo(aim.x, aim.y + 22); c.stroke(); c.lineWidth = 1;
    info.textContent = `${T('剩余', 'Left')}: ${arrows} · ${T('得分', 'Score')}: ${total}${last != null ? ` (+${last})` : ''}`;
  };
  const stop = loop(draw);
  const shoot = () => {
    if (arrows <= 0) return;
    const dx = aim.x - tgt.x, dy = aim.y - tgt.y, d = Math.hypot(dx, dy);
    last = Math.max(0, 10 - Math.floor(d / (R / 10))); total += last; arrows--;
    if (d < R) hits.push({ dx, dy });
    audio.sfx(last >= 7 ? 'good' : last > 0 ? 'click' : 'bad');
    if (arrows === 0) { stop(); setTimeout(() => done(Math.round(total * 2)), 600); }
  };
  g.querySelector('[data-testid=mg-act]').addEventListener('click', shoot);
  const key = (e) => { if (e.code === 'Space' && document.body.contains(cv)) { e.preventDefault(); shoot(); } else if (!document.body.contains(cv)) document.removeEventListener('keydown', key); };
  document.addEventListener('keydown', key);
}

// ---------- 奶妈的厨房：指针来回摆动，在甜蜜区停下。4 步 ----------
export function kitchen(el, done) { intro(el, 'kitchen', T('奶妈的蜂蜜饼', "Nurse's honey cakes"), () => kitchenGame(el, done)); }
function kitchenGame(el, done) {
  const steps = [T('揉面', 'Knead the dough'), T('浇蜂蜜', 'Pour the honey'), T('撒芝麻', 'Sprinkle sesame'), T('看火候', 'Watch the oven')];
  const g = frame(el, T('奶妈的蜂蜜饼', "Nurse's honey cakes"), T('指针来回摆动，在金色区域里按"停"（电脑上也可以按空格键）。区域会越来越窄。', 'The pointer swings back and forth — tap "Stop" (or press Space) inside the golden zone. It gets narrower.'),
    `<div class="mg-step"></div><div class="mg-bar"><div class="mg-zone"></div><div class="mg-ptr"></div></div><div class="row"><button class="primary" data-testid="mg-act">${esc(T('停', 'Stop'))}</button><span class="mg-score"></span></div>`);
  const zone = g.querySelector('.mg-zone'), ptr = g.querySelector('.mg-ptr'), stepEl = g.querySelector('.mg-step'), info = g.querySelector('.mg-score');
  let i = 0, total = 0, pos = 0, center = 50, width = 26, speed = 70, t0 = performance.now(), paused = false;
  const setup = () => { center = 20 + Math.random() * 60; width = 26 - i * 5; speed = 70 + i * 22; zone.style.left = `${center - width / 2}%`; zone.style.width = `${width}%`; stepEl.textContent = `${i + 1}/4 · ${steps[i]}`; t0 = performance.now(); };
  setup();
  loop((ts) => { if (paused) return; const k = ((ts - t0) / 1000) * speed; pos = 100 * Math.abs(((k / 100) % 2) - 1); ptr.style.left = `${pos}%`; });
  const stop = () => {
    if (paused || i >= 4) return;
    const off = Math.abs(pos - center), pts = off <= width / 2 ? Math.round(25 - (off / (width / 2)) * 10) : Math.max(0, Math.round(10 - (off - width / 2) / 3));
    total += pts; info.textContent = `+${pts}`; audio.sfx(pts >= 15 ? 'good' : 'bad');
    paused = true; i++;
    setTimeout(() => { if (i >= 4) { stopMinigame(); done(Math.min(100, total)); } else { paused = false; setup(); } }, 650);
  };
  g.querySelector('[data-testid=mg-act]').addEventListener('click', stop);
  // 电脑上按空格也可以"停"
  const key = (e) => { if (!document.body.contains(g)) return document.removeEventListener('keydown', key); if (e.code === 'Space') { e.preventDefault(); stop(); } };
  document.addEventListener('keydown', key);
}

// ---------- 织布机：记住回纹格子亮起的顺序，再照着点一遍 ----------
export function loom(el, done) { intro(el, 'loom', T('珀涅罗珀的织布机', "Penelope's loom"), () => loomGame(el, done)); }
function loomGame(el, done) {
  const COLORS = ['#2c6aa0', '#b0413e', '#c99a3b', '#2f8a4f'], NOTES = [293.66, 349.23, 440, 523.25];
  const g = frame(el, T('珀涅罗珀的织布机', "Penelope's loom"), T('看格子亮起的顺序，然后照着点一遍。每次多一格。', 'Watch the order the tiles light up, then repeat it. One more each round.'),
    `<div class="mg-loom">${COLORS.map((c, i) => `<button class="mg-tile" data-i="${i}" data-testid="tile-${i}" style="--c:${c}" aria-label="${i + 1}"></button>`).join('')}</div><div class="row"><span class="mg-score"></span></div>`);
  const tiles = [...g.querySelectorAll('.mg-tile')], info = g.querySelector('.mg-score');
  let seq = [Math.floor(Math.random() * 4)], input = [], busy = true, best = 0;
  const flash = (i) => { tiles[i].classList.add('lit'); audio.tone(NOTES[i], 0.3); setTimeout(() => tiles[i].classList.remove('lit'), 320); };
  const play = () => { busy = true; input = []; info.textContent = `${T('长度', 'Length')}: ${seq.length}`; seq.forEach((v, k) => setTimeout(() => flash(v), 500 + k * 520)); setTimeout(() => { busy = false; }, 500 + seq.length * 520); };
  stopCurrent = () => { busy = true; };
  tiles.forEach((b) => b.addEventListener('click', () => {
    if (busy) return;
    const i = +b.dataset.i; flash(i); input.push(i);
    if (seq[input.length - 1] !== i) { audio.sfx('bad'); busy = true; setTimeout(() => done(Math.min(100, Math.round(best / 7 * 100))), 500); return; }
    if (input.length === seq.length) { best = seq.length; if (best >= 8) { audio.sfx('good'); busy = true; setTimeout(() => done(100), 500); return; } seq.push(Math.floor(Math.random() * 4)); setTimeout(play, 500); }
  }));
  play();
}

// ---------- 竖琴：音符滑到线上时按"拨弦"。可传入自定义旋律（莫扎特梦境） ----------
export function lyre(el, done, opts = {}) { intro(el, 'lyre', opts.title || T('跟菲米乌斯学竖琴', 'Lyre with Phemius'), () => lyreGame(el, done, opts)); }
function lyreGame(el, done, opts = {}) {
  const melody = opts.melody || [0, 2, 4, 2, 4, 5, 4, 2, 0, 2, 4, 7, 6, 4, 2, 0];
  const gap = opts.gap || 620, travel = 1800, HIT = 70;
  const g = frame(el, opts.title || T('跟菲米乌斯学竖琴', 'Lyre with Phemius'), T('音符滑到左边的金线时按"拨弦"（或空格）。越准越好。', 'Tap "Pluck" (or Space) when a note reaches the golden line. The closer the better.'),
    `<canvas width="480" height="140" class="mg-canvas"></canvas><div class="row"><button class="primary" data-testid="mg-act">${esc(T('拨弦', 'Pluck'))}</button><span class="mg-score"></span></div>`);
  const cv = g.querySelector('canvas'), c = cv.getContext('2d'), info = g.querySelector('.mg-score');
  const start = performance.now() + 900;
  const notes = melody.map((deg, i) => ({ deg, at: start + travel + i * gap, hit: null }));
  let score = 0, msg = '';
  const xOf = (n, now) => HIT + ((n.at - now) / travel) * (480 - HIT);
  const stop = loop((now) => {
    c.fillStyle = '#fffaf0'; c.fillRect(0, 0, 480, 140);
    for (let s = 0; s < 5; s++) { c.strokeStyle = '#eadfcc'; c.beginPath(); c.moveTo(0, 30 + s * 20); c.lineTo(480, 30 + s * 20); c.stroke(); }
    c.fillStyle = '#c99a3b'; c.fillRect(HIT - 2, 10, 4, 120);
    for (const n of notes) {
      if (n.hit) continue;
      const x = xOf(n, now); if (x < -20) { n.hit = 'miss'; msg = T('漏了', 'Miss'); continue; } if (x > 500) continue;
      c.fillStyle = '#2c6aa0'; c.beginPath(); c.arc(x, 110 - (n.deg % 8) * 10, 9, 0, 7); c.fill();
    }
    info.textContent = `${T('得分', 'Score')}: ${score} ${msg}`;
    if (notes.every((n) => n.hit)) { stop(); setTimeout(() => done(Math.round((score / (notes.length * 3)) * 100)), 400); }
  });
  const pluck = () => {
    const now = performance.now();
    const n = notes.filter((x) => !x.hit).sort((a, b) => Math.abs(a.at - now) - Math.abs(b.at - now))[0];
    if (!n) return;
    const d = Math.abs(n.at - now);
    if (d > 300) { msg = T('太早了', 'Too early'); return; }
    n.hit = d < 110 ? 'perfect' : 'good'; score += n.hit === 'perfect' ? 3 : 1; msg = n.hit === 'perfect' ? T('完美！', 'Perfect!') : T('不错', 'Good');
    audio.tone(audio.SCALE_HZ[n.deg % 8], 0.5);
  };
  g.querySelector('[data-testid=mg-act]').addEventListener('click', pluck);
  const key = (e) => { if (e.code === 'Space' && document.body.contains(cv)) { e.preventDefault(); pluck(); } else if (!document.body.contains(cv)) document.removeEventListener('keydown', key); };
  document.addEventListener('keydown', key);
}

// ---------- 配对：翻开两张牌，名字和说明配成一对 ----------
export function pairs(el, done, list, title) {
  const cards = list.flatMap((p, i) => [{ i, text: p[0] }, { i, text: p[1] }]).sort(() => Math.random() - 0.5);
  const g = frame(el, title || T('配对', 'Match the pairs'), T('翻开两张牌，把名字和对应的说明配成一对。', 'Flip two cards to match each name with its description.'),
    `<div class="mg-pairs">${cards.map((c, k) => `<button class="mg-card" data-k="${k}" data-testid="card-${k}" data-pair="${c.i}"><span>${esc(t(c.text))}</span></button>`).join('')}</div><div class="row"><span class="mg-score"></span></div>`);
  const btns = [...g.querySelectorAll('.mg-card')], info = g.querySelector('.mg-score');
  let open = [], moves = 0, found = 0, lock = false;
  btns.forEach((b) => b.addEventListener('click', () => {
    if (lock || b.classList.contains('up')) return;
    b.classList.add('up'); open.push(b);
    if (open.length < 2) return;
    moves++; const [a, c] = open; open = [];
    if (a.dataset.pair === c.dataset.pair) { a.classList.add('done'); c.classList.add('done'); found++; audio.sfx('good'); if (found === list.length) setTimeout(() => done(Math.max(30, Math.min(100, Math.round(100 - (moves - list.length) * 6)))), 500); }
    else { lock = true; audio.sfx('bad'); setTimeout(() => { a.classList.remove('up'); c.classList.remove('up'); lock = false; }, 900); }
    info.textContent = `${T('步数', 'Moves')}: ${moves}`;
  }));
}

// ---------- 问答：每题答完显示一段解释 ----------
export function quiz(el, done, questions, title) {
  let i = 0, right = 0;
  const ask = () => {
    const q = questions[i];
    const g = frame(el, `${title || T('问答', 'Quiz')} · ${i + 1}/${questions.length}`, '', `<p class="line">${esc(t(q.q))}</p><div class="choices">${q.opts.map((o, k) => `<button data-k="${k}" data-testid="quiz-${k}">${esc(t(o))}</button>`).join('')}</div><div class="mg-why"></div>`);
    g.querySelectorAll('[data-k]').forEach((b) => b.addEventListener('click', () => {
      if (g.dataset.answered) return; g.dataset.answered = '1';
      const ok = +b.dataset.k === q.answer; if (ok) right++;
      audio.sfx(ok ? 'good' : 'bad');
      g.querySelectorAll('[data-k]').forEach((x) => { x.disabled = true; if (+x.dataset.k === q.answer) x.classList.add('right'); });
      if (!ok) b.classList.add('wrong');
      g.querySelector('.mg-why').innerHTML = `<p class="note">${esc(ok ? T('答对了！', 'Correct!') : T('不太对。', 'Not quite.'))} ${esc(t(q.why))}</p><button class="primary" data-testid="next">${esc(T('继续', 'Continue'))}</button>`;
      g.querySelector('[data-testid=next]').addEventListener('click', () => { i++; if (i < questions.length) ask(); else done(Math.round(right / questions.length * 100)); });
    }));
  };
  ask();
}

// ---------- 怪物对峙：看清它从哪边攻过来，及时闪避；闪开后在金色区域出手 ----------
// D = { name, hp, speed, moves, tell, sprite }。她有 3 颗心；把怪物的 hp 打完就赢
const DODGE_NAME = { left: { zh: '向左躲', en: 'Dodge left' }, up: { zh: '低头躲', en: 'Duck' }, right: { zh: '向右躲', en: 'Dodge right' } };
export function duel(el, done, D) { intro(el, 'duel', t(D.name), () => duelGame(el, done, D)); }
function duelGame(el, done, D) {
  const ARROW = { left: '←', up: '↑', right: '→' };
  const g = frame(el, t(D.name), T('看它从哪边攻过来，马上按同方向的闪避键（或方向键）；闪开后在金色区域按"出手"（或空格）。', 'Watch where it attacks from and press that dodge (or arrow key) in time; once you dodge, strike in the golden zone (or Space).'),
    `<div class="duel">
      <div class="duel-stage"><img class="duel-mon" src="assets/img/${D.sprite}.webp" alt=""><div class="duel-tell" aria-live="polite"></div><div class="duel-arrow"></div><div class="duel-round"></div></div>
      <div class="duel-bars"><span>${esc(T('伊俄涅', 'Ione'))} <b class="duel-hearts"></b></span><span>${esc(t(D.name))} <b class="duel-mhp"></b></span></div>
      <div class="mg-bar duel-strike hidden"><div class="mg-zone"></div><div class="mg-ptr"></div></div>
      <div class="duel-keys">${D.moves.map((m) => `<button data-move="${m}" data-testid="dodge-${m}">${ARROW[m]} <small>${esc(t(DODGE_NAME[m]))}</small></button>`).join('')}
        <button class="primary" data-testid="mg-act" disabled>⚔ ${esc(T('出手！', 'Strike!'))}</button></div>
    </div>`);
  const mon = g.querySelector('.duel-mon'), tell = g.querySelector('.duel-tell'), hearts = g.querySelector('.duel-hearts'), mhp = g.querySelector('.duel-mhp');
  const bigArrow = g.querySelector('.duel-arrow'), roundEl = g.querySelector('.duel-round');
  let round = 0; const PRACTICE = 2; // 前两回合是练习：更慢，正确按钮会发光
  const glow = (m) => g.querySelectorAll('[data-move]').forEach((b) => b.classList.toggle('hint', round <= PRACTICE && b.dataset.move === m));
  const bar = g.querySelector('.duel-strike'), zone = bar.querySelector('.mg-zone'), ptr = bar.querySelector('.mg-ptr'), act = g.querySelector('[data-testid=mg-act]');
  let life = 3, hp = D.hp, phase = 'wait', want = null, timer = null, t0 = 0, pos = 0, center = 50, alive = true;
  const draw = () => { hearts.textContent = '♥'.repeat(life) + '♡'.repeat(3 - life); mhp.textContent = '■'.repeat(hp) + '□'.repeat(D.hp - hp); };
  const end = () => { alive = false; clearTimeout(timer); const won = hp <= 0; const score = won ? 60 + life * 13 : Math.round((D.hp - hp) / D.hp * 50); setTimeout(() => done(Math.min(100, score)), 700); };
  const next = () => {
    if (!alive) return;
    if (hp <= 0 || life <= 0) { tell.textContent = hp <= 0 ? T('赢了！', 'Victory!') : T('撑不住了……', 'Can\'t hold on...'); return end(); }
    phase = 'wait'; bar.classList.add('hidden'); act.disabled = true; act.classList.remove('hint'); tell.textContent = '…'; mon.className = 'duel-mon'; bigArrow.className = 'duel-arrow'; glow(null);
    round++;
    roundEl.textContent = round <= PRACTICE ? T(`练习 ${round}/${PRACTICE}`, `Practice ${round}/${PRACTICE}`) : '';
    const speed = (D.speed + 250) * (round <= PRACTICE ? 2 : 1);
    timer = setTimeout(() => {
      want = D.moves[Math.floor(Math.random() * D.moves.length)];
      phase = 'dodge'; tell.textContent = `${ARROW[want]} ${t(D.tell[want])}`; mon.className = `duel-mon lunge-${want}`;
      bigArrow.textContent = ARROW[want]; bigArrow.className = `duel-arrow show from-${want}`; glow(want);
      timer = setTimeout(() => { if (phase === 'dodge') { phase = 'hit'; life--; audio.sfx('bad'); tell.textContent = T(`太慢了！要点"${t(DODGE_NAME[want])}"`, `Too slow! Tap "${t(DODGE_NAME[want])}"`); draw(); timer = setTimeout(next, 1100); } }, speed);
    }, 800 + Math.random() * 700);
  };
  const dodge = (m) => {
    if (phase !== 'dodge') return;
    clearTimeout(timer);
    if (m !== want) { phase = 'hit'; life--; audio.sfx('bad'); tell.textContent = T(`躲错方向了！它是从${ARROW[want]}来的`, `Wrong way! It came from ${ARROW[want]}`); draw(); timer = setTimeout(next, 1100); return; }
    phase = 'strike'; audio.sfx('click'); tell.textContent = T('闪开了！等指针进金色区域，点"出手"！', 'Dodged! When the pointer is in the gold zone, Strike!'); mon.className = 'duel-mon'; bigArrow.className = 'duel-arrow'; glow(null);
    center = 25 + Math.random() * 50; zone.style.left = `${center - 15}%`; zone.style.width = '30%'; bar.classList.remove('hidden'); act.disabled = false; act.classList.toggle('hint', round <= PRACTICE); t0 = performance.now();
    timer = setTimeout(() => { if (phase === 'strike') { tell.textContent = T('错过了机会。', 'Missed the opening.'); next(); } }, 2300);
  };
  const strike = () => {
    if (phase !== 'strike') return;
    clearTimeout(timer); phase = 'wait';
    if (Math.abs(pos - center) <= 15) { hp--; audio.sfx('good'); tell.textContent = T('打中了！', 'A hit!'); mon.className = 'duel-mon struck'; }
    else { audio.sfx('bad'); tell.textContent = T('偏了！指针在金色区域里才算。', 'Missed! The pointer must be in the gold zone.'); }
    draw(); timer = setTimeout(next, 650);
  };
  loop((ts) => { if (phase === 'strike') { const k = ((ts - t0) / 1000) * 80; pos = 100 * Math.abs(((k / 100) % 2) - 1); ptr.style.left = `${pos}%`; } });
  const stopLoop = stopCurrent; stopCurrent = () => { alive = false; clearTimeout(timer); stopLoop && stopLoop(); };
  g.querySelectorAll('[data-move]').forEach((b) => b.addEventListener('click', () => dodge(b.dataset.move)));
  act.addEventListener('click', strike);
  const key = (e) => {
    if (!document.body.contains(g)) return document.removeEventListener('keydown', key);
    const k = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up' }[e.key];
    if (k && D.moves.includes(k)) { e.preventDefault(); dodge(k); } else if (e.code === 'Space') { e.preventDefault(); strike(); }
  };
  document.addEventListener('keydown', key);
  draw(); next();
}
