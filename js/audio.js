// 原创音乐：用 WebAudio 实时合成。音效、环境声和语音是用 fal.ai 生成的原创音频文件（assets/audio）。
let ctx = null, master = null, musicTimer = null, muted = false, lastTheme = null, narrating = false;
try { muted = localStorage.getItem('ione_muted') === '1'; } catch {}
// 背景声音开关（每个玩家自己的浏览器里记住）：竖琴音乐、场景环境声、大海、鸟鸣
const SOUND = { harp: true, scene: true, sea: false, birds: false };
try { Object.assign(SOUND, JSON.parse(localStorage.getItem('ione_sound') || '{}')); } catch {}
const BED_VOL = { scene: 0.35, sea: 0.3, birds: 0.22 };
const layerEls = {};
export function getSound() { return { ...SOUND }; }
export function setSound(k, on) {
  if (!(k in SOUND)) return;
  SOUND[k] = !!on;
  try { localStorage.setItem('ione_sound', JSON.stringify(SOUND)); } catch {}
  if (k === 'harp') { if (!on) stopMusic(); else if (lastTheme && !narrating) playMusic(lastTheme); }
  refreshBeds();
}
// 按开关、静音、是否在朗读，统一调整场景环境声和大海/鸟鸣的音量
function refreshBeds() {
  const duck = narrating;
  if (ambEl) {
    const a = ambEl;
    if (SOUND.scene && !muted) { if (a.paused) { const p = a.play(); if (p) p.catch(() => {}); } fade(a, duck ? 0.04 : BED_VOL.scene, 600); }
    else fade(a, 0, 400, () => { if (!(SOUND.scene && !muted)) a.pause(); });
  }
  for (const k of ['sea', 'birds']) {
    let a = layerEls[k];
    if (SOUND[k] && !muted) {
      if (!a) { try { a = layerEls[k] = new Audio(`assets/audio/layer_${k}.mp3`); a.loop = true; a.volume = 0; } catch { continue; } }
      if (a.paused) { const p = a.play(); if (p) p.catch(() => {}); }
      fade(a, duck ? 0.03 : BED_VOL[k], 700);
    } else if (a) fade(a, 0, 400, () => { if (!(SOUND[k] && !muted)) a.pause(); });
  }
}
export function soundLevels() { // 测试用
  const v = (a) => (a && !a.paused ? Math.round(a.volume * 100) / 100 : 0);
  return { harp: !!musicTimer, scene: v(ambEl), sea: v(layerEls.sea), birds: v(layerEls.birds) };
}

function ensure() {
  if (ctx) return true;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return false;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = muted ? 0 : 0.5;
  master.connect(ctx.destination);
  return true;
}

function note(freq, start, dur, type = 'triangle', vol = 0.15) {
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(vol, start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0008, start + dur);
  o.connect(g); g.connect(master);
  o.start(start); o.stop(start + dur + 0.05);
}

// 原创竖琴音乐。日常音乐随剧情推进分四段变化（按游戏周数）：
//  0 一到三月：D 多利亚调式的安静竖琴
//  1 四到六月：加入低音持续音和高八度的应和
//  2 七到九月：转成 D 小调（自然小调），加入轻轻的鼓点——危险越来越近
//  3 十到十二月：明亮的 D 大调英雄主题，更快，全部声部一起
const SCALE = [293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25, 587.33]; // D 多利亚
const MINOR = [293.66, 329.63, 349.23, 392.0, 440.0, 466.16, 523.25, 587.33]; // D 自然小调
const MAJOR = [293.66, 329.63, 369.99, 392.0, 440.0, 493.88, 554.37, 587.33]; // D 大调
const THEMES = {
  day:   [0, 2, 4, 7, 6, 4, 2, 3, 4, 2, 1, 0, 2, 4, 5, 4],
  storm: [0, 1, 0, 3, 2, 1, 0, -1, 0, 1, 3, 4, 3, 1, 0, 0],
  title: [4, 2, 0, 2, 4, 4, 4, 3, 2, 3, 4, 7, 6, 4, 2, 0],
};
const STAGES = [
  { scale: SCALE, seq: THEMES.day, step: 0.42 },
  { scale: SCALE, seq: [0, 2, 4, 7, 6, 4, 5, 3, 4, 2, 1, 0, 2, 4, 7, 4], step: 0.40, drone: true, echo: true },
  { scale: MINOR, seq: [0, 2, 3, 4, 5, 4, 3, 2, 3, 1, 0, -1, 0, 2, 4, 2], step: 0.38, drone: true, drum: true },
  { scale: MAJOR, seq: [0, 2, 4, 7, 7, 6, 4, 6, 7, 4, 2, 4, 5, 6, 7, 7], step: 0.34, drone: true, echo: true, drum: true },
];
let progressWeek = 1;
export function musicStage(week = progressWeek) { return week <= 12 ? 0 : week <= 24 ? 1 : week <= 36 ? 2 : 3; }
// 游戏告诉音乐现在第几周；进入新的一段时，下一小节开始换曲
export function setProgress(week) {
  const before = musicStage();
  progressWeek = week || 1;
  if (musicStage() !== before && musicTimer && lastTheme === 'day') playMusic('day');
}
function drum(t, vol = 0.12) {
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = 'sine'; o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(48, t + 0.18);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0008, t + 0.22);
  o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.25);
}

export function playMusic(theme = 'day') {
  lastTheme = theme;
  if (narrating || !SOUND.harp) return; // 小知识朗读时先不放音乐，读完再恢复
  if (!ensure()) return;
  stopMusic();
  const st = theme === 'day' ? STAGES[musicStage()] : { scale: SCALE, seq: THEMES[theme] || THEMES.day, step: theme === 'storm' ? 0.32 : 0.42 };
  const { scale, seq, step } = st;
  let i = 0;
  const tick = () => {
    const t = ctx.currentTime + 0.05;
    const deg = seq[i % seq.length];
    const f = deg < 0 ? scale[0] / 1.122 : scale[deg % 8];
    note(f, t, step * 2.2, 'triangle', 0.09);
    if (i % 4 === 0) note(scale[0] / 2, t, step * 4, 'sine', 0.07); // 低音
    if (st.drone && i % 8 === 0) note(scale[4] / 2, t, step * 8, 'sine', 0.035); // 持续的五度
    if (st.echo && i % 2 === 1) note(f * 2, t + step * 0.5, step * 1.2, 'sine', 0.025); // 高八度应和
    if (st.drum && i % 4 === 0) drum(t, 0.1);
    if (st.drum && i % 4 === 2) drum(t, 0.05);
    i++;
  };
  tick();
  musicTimer = setInterval(tick, step * 1000);
}
export function stopMusic() { if (musicTimer) clearInterval(musicTimer); musicTimer = null; }

// 音效：优先播放 assets/audio 里生成的音效文件，找不到时退回到合成音。
const SFX_FILES = { click: 'sfx_click', next: 'sfx_next', good: 'sfx_good', bad: 'sfx_bad', coin: 'sfx_coin', week: 'sfx_week', wave: 'sfx_wave', thunder: 'sfx_thunder', ending: 'sfx_ending' };
const SFX_VOL = { click: 0.5, next: 0.5, good: 0.6, bad: 0.6, coin: 0.6, week: 0.5, wave: 0.7, thunder: 0.7, ending: 0.7 };
function playFile(src, vol) {
  try { const a = new Audio(src); a.volume = vol; const p = a.play(); if (p) p.catch(() => {}); return a; } catch { return null; }
}
export function sfx(kind = 'click') {
  if (muted) return;
  if (SFX_FILES[kind]) { playFile(`assets/audio/${SFX_FILES[kind]}.mp3`, SFX_VOL[kind] ?? 0.6); return; }
  if (!ensure()) return;
  if (ctx.state === 'suspended') ctx.resume();
  const t = ctx.currentTime;
  note(880, t, 0.08, 'sine', 0.12);
}

// 环境声：每个场景一段可无缝循环的环境音，切换场景时淡入淡出。
let ambEl = null, ambName = null;
export function ambient(name) {
  if (name === ambName) return;
  ambName = name;
  const old = ambEl;
  if (old) fade(old, 0, 600, () => old.pause());
  ambEl = null;
  if (!name) return;
  try {
    const a = new Audio(`assets/audio/amb_${name}.mp3`);
    a.loop = true; a.volume = 0;
    ambEl = a;
    refreshBeds();
  } catch {}
}
function fade(a, to, ms, done) {
  const from = a.volume, start = performance.now(), id = (a._fade = (a._fade || 0) + 1);
  const step = () => {
    if (a._fade !== id) return; // 有新的淡入淡出接手了
    const k = Math.min(1, (performance.now() - start) / ms);
    a.volume = from + (to - from) * k;
    if (k < 1) requestAnimationFrame(step); else if (done) done();
  };
  step();
}

// 伊俄涅的情感语音：assets/audio/voice/<语言>/<表情>_<n>.mp3，清单在 data/voice.js
let voiceEl = null, segTimer = null;
const packs = {};
export function voice(src) {
  if (muted || !src) return;
  stopVoice();
  voiceEl = playFile(src, 0.9);
}
function stopVoice() { clearTimeout(segTimer); if (voiceEl) voiceEl.pause(); }
// 从打包的大音频里播放一段（整句配音）：跳到开始时间，到时长后停下
export function voiceSegment(src, start, dur) {
  if (muted || !src) return;
  stopVoice();
  try {
    let a = packs[src];
    if (!a) { a = packs[src] = new Audio(src); a.preload = 'auto'; }
    a.volume = 0.9; voiceEl = a;
    const go = () => {
      a.currentTime = start;
      const p = a.play(); if (p) p.catch(() => {});
      segTimer = setTimeout(() => a.pause(), dur * 1000 + 120);
    };
    if (a.readyState >= 1) go(); else a.addEventListener('loadedmetadata', go, { once: true });
  } catch {}
}

// 小游戏里的音符（竖琴、织布机）
export function tone(freq, dur = 0.35, type = 'triangle', vol = 0.14) {
  if (!ensure() || muted) return;
  if (ctx.state === 'suspended') ctx.resume();
  note(freq, ctx.currentTime + 0.01, dur, type, vol);
}
export const SCALE_HZ = SCALE;

export function isMuted() { return muted; }
export function setMuted(m) {
  muted = m;
  try { localStorage.setItem('ione_muted', m ? '1' : '0'); } catch {}
  if (master) master.gain.value = m ? 0 : 0.5;
  if (ctx && ctx.state === 'suspended') ctx.resume();
  refreshBeds();
  if (m) { stopVoice(); stopNarration(); }
}
export function unlock() {
  if (ensure() && ctx.state === 'suspended') ctx.resume();
  refreshBeds();
}

// 小知识朗读：播放时暂停音乐、把环境声压到很小、停掉其他语音；读完或停止后恢复
let narEl = null, narTimer = null, narEnd = null;
export function isNarrating() { return narrating; }
export function narrate(src, start, dur, onEnd) {
  stopNarration(false);
  if (muted || !src) return false;
  narrating = true; narEnd = onEnd || null;
  stopVoice();
  const hadMusic = !!musicTimer; stopMusic(); narrate.hadMusic = hadMusic;
  refreshBeds();
  try {
    let a = packs[src];
    if (!a) { a = packs[src] = new Audio(src); a.preload = 'auto'; }
    a.volume = 1; narEl = a;
    const go = () => {
      if (narEl !== a) return;
      a.currentTime = start;
      const p = a.play(); if (p) p.catch(() => stopNarration());
      narTimer = setTimeout(() => stopNarration(), dur * 1000 + 150);
    };
    if (a.readyState >= 1) go(); else a.addEventListener('loadedmetadata', go, { once: true });
  } catch { stopNarration(); return false; }
  return true;
}
export function stopNarration(restore = true) {
  if (!narrating) return;
  clearTimeout(narTimer); narTimer = null;
  if (narEl) narEl.pause();
  narEl = null; narrating = false;
  const cb = narEnd; narEnd = null;
  if (restore) {
    refreshBeds();
    if (narrate.hadMusic && lastTheme) playMusic(lastTheme);
  }
  if (cb) cb();
}
