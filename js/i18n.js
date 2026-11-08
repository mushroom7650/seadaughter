// 界面文字（中英双语）。剧情、活动等数据里的文字直接写成 {zh, en}。
export const UI = {
  title: { zh: '伊萨卡的海之女', en: 'Ione of Ithaca' },
  subtitle: { zh: '一年的时光，一个从海里来的女孩', en: 'One year, one girl from the sea' },
  newGame: { zh: '新的开始', en: 'New Game' },
  load: { zh: '读取存档', en: 'Load' },
  save: { zh: '存档', en: 'Save' },
  records: { zh: '记录殿堂', en: 'Hall of Records' },
  back: { zh: '返回', en: 'Back' },
  langBtn: { zh: 'English', en: '中文' },
  mute: { zh: '静音', en: 'Mute' },
  unmute: { zh: '开声音', en: 'Sound' },
  yourName: { zh: '你是门托尔，奥德修斯的老友。请写下你的名字：', en: 'You are Mentor, old friend of Odysseus. Write your name:' },
  defaultName: { zh: '门托尔', en: 'Mentor' },
  choosePet: { zh: '王宫里有几只小动物，选一只陪伴她：', en: 'Choose a companion animal for her:' },
  start: { zh: '开始', en: 'Begin' },
  week: { zh: '第{w}周', en: 'Week {w}' },
  month: { zh: '{m}月', en: 'Month {m}' },
  schedule: { zh: '安排这一周', en: 'Plan the Week' },
  talk: { zh: '聊天', en: 'Talk' },
  status: { zh: '状态', en: 'Status' },
  menu: { zh: '菜单', en: 'Menu' },
  run: { zh: '开始这一周', en: 'Start the Week' },
  days: { zh: ['周一', '周二', '周三', '周四', '周五', '周六'], en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] },
  pickActivity: { zh: '选择活动', en: 'Choose activity' },
  notEnoughSilver: { zh: '银币不够', en: 'Not enough silver' },
  weekendTitle: { zh: '周末。你要对她说什么？', en: 'The weekend. What do you say to her?' },
  praise: { zh: '夸奖她', en: 'Praise her' },
  encourage: { zh: '鼓励她再努力', en: 'Encourage her' },
  scold: { zh: '责备她', en: 'Scold her' },
  silent: { zh: '什么都不说', en: 'Say nothing' },
  next: { zh: '继续', en: 'Continue' },
  sick: { zh: '她病倒了，只能卧床休息。', en: 'She fell ill and had to stay in bed.' },
  ranAway: { zh: '她不见了！码头少了一条小船……直到夜里她才湿淋淋地回来。', en: 'She is gone! A small boat is missing from the harbor... she returns soaked late at night.' },
  stats: { zh: '能力', en: 'Abilities' },
  silver: { zh: '银币', en: 'Silver' },
  personality: { zh: '性格', en: 'Personality' },
  callsYou: { zh: '她叫你', en: 'She calls you' },
  slot: { zh: '存档{n}', en: 'Slot {n}' },
  autoSlot: { zh: '自动存档', en: 'Autosave' },
  empty: { zh: '（空）', en: '(empty)' },
  saved: { zh: '已存档', en: 'Saved' },
  ending: { zh: '结局', en: 'Ending' },
  score: { zh: '得分', en: 'Score' },
  toTitle: { zh: '回到标题', en: 'Back to Title' },
  rank: { zh: '排行榜', en: 'Leaderboard' },
  gallery: { zh: '结局图鉴', en: 'Ending Gallery' },
  times: { zh: '{n}次', en: '{n}×' },
  noRecords: { zh: '还没有记录。', en: 'No records yet.' },
  portraitTodo: { zh: '立绘制作中', en: 'Portrait in progress' },
};

let lang = (() => { try { return localStorage.getItem('ione_lang') || 'zh'; } catch { return 'zh'; } })();

export function getLang() { return lang; }
export function setLang(l) { lang = l; try { localStorage.setItem('ione_lang', l); } catch {} }

// t('week', {w: 3}) 或 t({zh:'..', en:'..'})
export function t(key, vars = {}) {
  const entry = typeof key === 'string' ? UI[key] : key;
  if (!entry) return String(key);
  let s = entry[lang] ?? entry.zh;
  if (typeof s === 'string') for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, v);
  return s;
}
