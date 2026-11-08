// 数值、性格、活动、宠物等基础数据

export const STATS = {
  stamina:   { zh: '体力', en: 'Stamina' },
  martial:   { zh: '武艺', en: 'Martial' },
  wits:      { zh: '智谋', en: 'Wits' },
  eloquence: { zh: '口才', en: 'Eloquence' },
  sailing:   { zh: '航海', en: 'Sailing' },
  etiquette: { zh: '礼仪', en: 'Etiquette' },
  piety:     { zh: '虔敬', en: 'Piety' },
  song:      { zh: '歌艺', en: 'Song' },
  farming:   { zh: '农牧', en: 'Herding' },
  courage:   { zh: '勇气', en: 'Courage' },
  stress:    { zh: '压力', en: 'Stress' },
};

// 四组可见名字的隐藏倾向（-100..100）；信赖 trust 单独 0..100
// cheer: 开朗(+)↔沉默(-)  gentle: 温柔(+)↔刚烈(-)  depend: 依赖(+)↔独立(-)  pious: 敬神(+)↔叛逆(-)
export const AXES = ['cheer', 'gentle', 'depend', 'pious'];

export const PERSONALITIES = {
  hedgehog:    { zh: '刺猬', en: 'Hedgehog' },
  cold:        { zh: '冷淡', en: 'Aloof' },
  cheerful:    { zh: '开朗', en: 'Cheerful' },
  gentle:      { zh: '温柔', en: 'Gentle' },
  stubborn:    { zh: '倔强', en: 'Stubborn' },
  clingy:      { zh: '依恋', en: 'Attached' },
  independent: { zh: '独立', en: 'Independent' },
  rebel:       { zh: '叛逆', en: 'Rebellious' },
  devout:      { zh: '虔诚', en: 'Devout' },
  calm:        { zh: '平和', en: 'Serene' },
};

export function personalityOf(s) {
  if (s.trust < 25) return 'hedgehog';
  const pairs = [
    ['cheer', 'cheerful', 'cold'], ['gentle', 'gentle', 'stubborn'],
    ['depend', 'clingy', 'independent'], ['pious', 'devout', 'rebel'],
  ];
  let best = null, bestAbs = 29;
  for (const [axis, pos, neg] of pairs) {
    const v = s.traits[axis];
    if (Math.abs(v) > bestAbs) { bestAbs = Math.abs(v); best = v > 0 ? pos : neg; }
  }
  return best || 'calm';
}

// 对你的称呼，随信赖变化
export function nameForYou(s) {
  const n = s.playerName;
  if (s.trust < 25) return { zh: '那个老头', en: 'that old man' };
  if (s.trust < 55) return { zh: n, en: n };
  if (s.trust < 85) return { zh: '老师', en: 'Teacher' };
  return { zh: '家人', en: 'family' };
}

// 活动：每天的效果。t = 倾向推动
export const ACTIVITIES = {
  archery:  { name: { zh: '练习射箭', en: 'Archery' }, fx: { martial: 4, courage: 1, stamina: -1, stress: 4 }, t: { gentle: -1 } },
  wrestle:  { name: { zh: '角力', en: 'Wrestling' }, fx: { martial: 3, stamina: 2, courage: 2, stress: 5 }, t: { gentle: -1, cheer: 0.5 } },
  herd:     { name: { zh: '跟欧迈俄斯放牧', en: 'Herding with Eumaeus' }, fx: { farming: 4, stamina: 1, stress: 2 }, silver: 6, t: { cheer: 0.5, gentle: 0.5 } },
  hunt:     { name: { zh: '上山打猎', en: 'Hunting' }, fx: { martial: 2, courage: 3, stamina: 1, stress: 4 }, silver: 3, t: { depend: -1 } },
  sail:     { name: { zh: '港口学航海', en: 'Sailing at the Harbor' }, fx: { sailing: 4, courage: 1, stress: 4 }, t: { depend: -1, pious: -0.5 } },
  sacrifice:{ name: { zh: '神庙献祭', en: 'Temple Offering' }, fx: { piety: 4, etiquette: 1, stress: -2 }, cost: 8, t: { pious: 1.5 } },
  assembly: { name: { zh: '旁听议事', en: 'Attend the Assembly' }, fx: { eloquence: 3, wits: 2, stress: 4 }, t: { cheer: -0.5 } },
  lyre:     { name: { zh: '跟菲米乌斯学琴', en: 'Lyre with Phemius' }, fx: { song: 4, etiquette: 1, stress: 1 }, cost: 6, t: { cheer: 1, gentle: 0.5 } },
  weave:    { name: { zh: '帮珀涅罗珀织布', en: 'Weaving with Penelope' }, fx: { etiquette: 3, wits: 1, stress: 3 }, t: { gentle: 1, depend: 0.5 } },
  kitchen:  { name: { zh: '奶妈的厨房', en: "Nurse's Kitchen" }, fx: { stamina: 2, etiquette: 1, stress: -1 }, t: { gentle: 1, depend: 1 } },
  trade:    { name: { zh: '码头做买卖', en: 'Trading at the Docks' }, fx: { eloquence: 3, wits: 1, stress: 5 }, silver: 10, t: { depend: -0.5 } },
  nighttalk:{ name: { zh: '与{you}夜谈', en: 'Evening talk with {you}' }, fx: { wits: 2, stress: -4 }, trust: 1.5, t: { depend: 1 } },
  rest:     { name: { zh: '休息', en: 'Rest' }, fx: { stamina: 3, stress: -10 }, t: {} },
};

export const PETS = {
  owl:      { zh: '猫头鹰', en: 'Owl', t: { pious: 5 }, fx: { wits: 10 } },
  hound:    { zh: '小猎犬（阿尔戈斯的后代）', en: "Puppy (Argos's pup)", t: { cheer: 5 }, fx: { courage: 10 } },
  cat:      { zh: '猫', en: 'Cat', t: { depend: -5 }, fx: { etiquette: 10 } },
  dolphin:  { zh: '海豚（在港口见面）', en: 'Dolphin (meets at the harbor)', t: { pious: -3 }, fx: { sailing: 10 } },
  tortoise: { zh: '陆龟', en: 'Tortoise', t: { gentle: 5 }, fx: { stress: -10 } },
  goat:     { zh: '小山羊', en: 'Little Goat', t: { cheer: 3, gentle: -3 }, fx: { farming: 10 } },
};

// 古雅典历月名（细节点缀）
export const ATTIC_MONTHS = ['Hekatombaion', 'Metageitnion', 'Boedromion', 'Pyanepsion', 'Maimakterion', 'Posideon', 'Gamelion', 'Anthesterion', 'Elaphebolion', 'Mounichion', 'Thargelion', 'Skirophorion'];
