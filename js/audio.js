// 原创音乐：用 WebAudio 实时合成。音效、环境声和语音是用 fal.ai 生成的原创音频文件（assets/audio）。
let ctx = null, master = null, musicTimer = null, muted = false;
try { muted = localStorage.getItem('ione_muted') === '1'; } catch {}

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

// D 多利亚调式的简单竖琴旋律（原创）
const SCALE = [293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25, 587.33];
const THEMES = {
  day:   [0, 2, 4, 7, 6, 4, 2, 3, 4, 2, 1, 0, 2, 4, 5, 4],
  storm: [0, 1, 0, 3, 2, 1, 0, -1, 0, 1, 3, 4, 3, 1, 0, 0],
  title: [4, 2, 0, 2, 4, 4, 4, 3, 2, 3, 4, 7, 6, 4, 2, 0],
};

export function playMusic(theme = 'day') {
  if (!ensure()) return;
  stopMusic();
  const seq = THEMES[theme] || THEMES.day;
  const step = theme === 'storm' ? 0.32 : 0.42;
  let i = 0;
  const tick = () => {
    const t = ctx.currentTime + 0.05;
    const deg = seq[i % seq.length];
    const f = deg < 0 ? SCALE[0] / 1.122 : SCALE[deg % 8];
    note(f, t, step * 2.2, 'triangle', 0.09);
    if (i % 4 === 0) note(SCALE[0] / 2, t, step * 4, 'sine', 0.07); // 低音
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
    if (!muted) { const p = a.play(); if (p) p.catch(() => {}); fade(a, 0.35, 800); }
  } catch {}
}
function fade(a, to, ms, done) {
  const from = a.volume, start = performance.now();
  const step = () => {
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
  if (ambEl) { if (m) ambEl.pause(); else { ambEl.volume = 0.35; const p = ambEl.play(); if (p) p.catch(() => {}); } }
  if (m) stopVoice();
}
export function unlock() {
  if (ensure() && ctx.state === 'suspended') ctx.resume();
  if (ambEl && !muted && ambEl.paused) { const p = ambEl.play(); if (p) p.catch(() => {}); fade(ambEl, 0.35, 800); }
}
