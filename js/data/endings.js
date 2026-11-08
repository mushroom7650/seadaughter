// 结局判定与文本
export const ENDINGS = {
  defeat:     { name: { zh: '败北', en: 'Fallen' }, text: { zh: '大厅的战斗结束了，伊萨卡重获自由，可她没能看到这一天。海浪轻轻带走了她的贝壳。', en: 'The battle ends and Ithaca is free, but she does not live to see it. The waves gently carry away her shell.' } },
  sailedAway: { name: { zh: '出海不归', en: 'Gone to Sea' }, text: { zh: '某个清晨，码头上又少了一条小船。这一次，她没有回来。只有你知道，她早就在等这样一个早晨。', en: 'One morning another small boat is missing from the harbor. This time she does not return. Only you knew she had long been waiting for such a morning.' } },
  returnSea:  { name: { zh: '回归大海', en: 'Return to the Sea' }, text: { zh: '她走进浪里，一步一步，直到海水没过她的长发。此后每逢风平浪静，渔夫们说能听见海上有人唱歌。', en: 'She walks into the waves, step by step, until the water closes over her hair. Ever after, on calm days, fishermen say they hear singing on the sea.' } },
  defier:     { name: { zh: '抗神者', en: 'Defier of Gods' }, text: { zh: '她举起奥德修斯的长矛，对着巨浪说"不"。浪头悬在半空，最终退回了大海。从此人们说，伊萨卡有个连海神都拿她没办法的姑娘。', en: 'She raises the spear of Odysseus and tells the great wave "no." It hangs in the air, then falls back into the sea. Ever after, people say Ithaca has a girl even the sea god cannot command.' } },
  family:     { name: { zh: '家人', en: 'Family' }, text: { zh: '她没有成为英雄，也没有成为传说。她只是每天傍晚坐在你身边，把一天的事情讲给你听。"我回来了，"她说，"家人。"', en: 'She became no hero and no legend. She simply sits by you every evening and tells you about her day. "I\'m home," she says. "Family."' } },
  athena:     { name: { zh: '雅典娜之选', en: "Athena's Choice" }, text: { zh: '那天夜里，"你"脱下凡人的模样，露出灰色的眼睛。"一年来教导你的，一直是我，"女神说，"现在，跟我去学更多的东西吧。"', en: 'That night, "you" shed your mortal guise and reveal grey eyes. "It was I who taught you all this year," says the goddess. "Now come, and learn more."' } },
  navigator:  { name: { zh: '航海家', en: 'Navigator' }, text: { zh: '她有了自己的船，船头刻着一枚贝壳。她要去看世界的尽头。', en: 'She has a ship of her own, a shell carved on its prow. She sails to see the edge of the world.' } },
  archer:     { name: { zh: '神射手', en: 'Master Archer' }, text: { zh: '整个希腊都在传颂伊萨卡的少女射手，她的箭比海鸥还快。', en: 'All Greece sings of the archer girl of Ithaca, whose arrows outfly the gulls.' } },
  bard:       { name: { zh: '吟游诗人', en: 'Bard' }, text: { zh: '她把这一年的故事编成了歌，从一个港口唱到另一个港口。', en: 'She turns this year into song and carries it from harbor to harbor.' } },
  priestess:  { name: { zh: '神庙祭司', en: 'Temple Priestess' }, text: { zh: '雅典娜神庙的祭火由她看守。人们说，她的祈祷连大海都会听。', en: "She keeps the fire at Athena's temple. They say even the sea listens to her prayers." } },
  herder:     { name: { zh: '牧人', en: 'Herder' }, text: { zh: '欧迈俄斯老了，山上的羊群交给了她。她最喜欢在山顶看海。', en: 'Eumaeus grows old and the hill flocks pass to her. Her favorite place is the hilltop above the sea.' } },
  envoy:      { name: { zh: '外交使节', en: 'Envoy' }, text: { zh: '她代表伊萨卡出使各国，用口才化解了一场又一场纷争。', en: 'She serves as Ithaca\'s envoy, ending quarrel after quarrel with her words.' } },
  guardian:   { name: { zh: '王宫守护者', en: 'Palace Guardian' }, text: { zh: '奥德修斯把王宫卫队交给了她。从此再没有人敢在这座大厅里撒野。', en: 'Odysseus gives her command of the palace guard. No one dares run riot in that hall again.' } },
  heroine:    { name: { zh: '伊萨卡的女英雄', en: 'Heroine of Ithaca' }, text: { zh: '哈耳庇厄、巨野猪、塞壬、斯库拉、海神的海怪——她一个一个迎了上去。吟游诗人开始唱一首新的歌：不是关于国王，也不是关于王子，而是关于一个从海里来的女孩。从此伊萨卡的孩子们玩"打怪物"的游戏时，人人都抢着当伊俄涅。', en: 'Harpies, the giant boar, the Sirens, Scylla, the sea god\'s serpent — she met them one by one. The bards begin a new song: not of a king, nor of a prince, but of a girl who came from the sea. Ever after, when Ithaca\'s children play at fighting monsters, everyone wants to be Ione.' } },
  blessed:    { name: { zh: '神眷之人', en: 'Blessed of the Gods' }, text: { zh: '某个黎明，雅典娜在神庙里向她伸出手。从那天起，她不再完全是凡人：受伤的人被她碰一下就会好转，迷航的水手会在夜里看见她发光的身影。人们说，伊萨卡有了自己的守护者。', en: 'One dawn, Athena holds out her hand to her in the temple. From that day she is no longer wholly mortal: the wounded mend at her touch, and lost sailors see her shining figure in the night. People say Ithaca has its own guardian now.' } },
  monster:    { name: { zh: '海上的塞壬', en: 'Siren of the Sea' }, text: { zh: '塞壬的歌一直留在她心里。她拒绝了众神，也拒绝了人们，最后自己走向了那片开满花的礁石。如今海上的渔夫说，那里多了一个塞壬，她的歌声最美、也最悲伤，而且……她从来不让伊萨卡的船靠近礁石。', en: 'The Sirens\' song never left her heart. She turned from the gods and from people, and at last walked to the flowering rocks herself. Fishermen now say there is a new Siren there, whose song is the most beautiful and the saddest of all — and who never lets Ithaca\'s ships near the rocks.' } },
  assassin:   { name: { zh: '王后的暗刃', en: "The Queen's Hidden Blade" }, text: { zh: '没有人在白天见过她。但是求婚者的密谋总在实施前一晚失败，往伊萨卡派来的探子总会悄悄消失。王后只在深夜接见一个披着斗篷的少女，她从不说名字，只留下一枚贝壳作为记号。', en: 'No one ever sees her by day. Yet every plot against the house fails the night before it is carried out, and the spies sent to Ithaca quietly vanish. Late at night the queen receives a cloaked girl who never gives her name — she leaves only a seashell as her sign.' } },
  ordinary:   { name: { zh: '普通的伊萨卡少女', en: 'An Ordinary Girl of Ithaca' }, text: { zh: '她没有成为什么了不起的人。她在集市上讨价还价，在节日里跳舞，在风暴夜里不再害怕。', en: 'She became no one remarkable. She haggles at the market, dances at festivals, and no longer fears stormy nights.' } },
};

// 同一结局按性格不同的尾声（通用版本；后续可为特定结局细化）
export const EPILOGUE = {
  hedgehog:    { zh: '临别时她只说了一句"……走了"，可你看见她把你送的东西紧紧攥在手里。', en: 'At parting she only says "...Bye," but you see her clutching what you gave her.' },
  cold:        { zh: '她没有回头。很久以后，你才在窗台上发现她留下的一枚贝壳。', en: 'She does not look back. Much later you find a shell she left on the windowsill.' },
  cheerful:    { zh: '"一起来嘛！"她大笑着向你伸出手。', en: '"Come with me!" she laughs, holding out her hand.' },
  gentle:      { zh: '她每个月都会托人给你捎来一罐蜂蜜，罐子上画着一只小小的猫头鹰。', en: 'Every month she sends you a jar of honey with a little owl painted on it.' },
  stubborn:    { zh: '"别担心我，"她说，"我说到做到。"', en: '"Don\'t worry about me," she says. "I keep my word."' },
  clingy:      { zh: '"你要每天想我，"她说，"我也会每天想你。"', en: '"Think of me every day," she says. "I will think of you every day too."' },
  independent: { zh: '清晨你醒来，桌上只有一封信："谢谢你。我会自己走下去。"', en: 'You wake at dawn to find only a letter: "Thank you. I will walk on by myself."' },
  rebel:       { zh: '"神也好，人也好，"她说，"以后我只听我自己的。"', en: '"Gods or men," she says, "from now on I listen only to myself."' },
  devout:      { zh: '她在神庙里为你点了一盏永不熄灭的灯。', en: 'She lights a lamp for you in the temple that never goes out.' },
  calm:        { zh: '她笑着说："这一年，真好。"', en: 'She smiles. "This year was good."' },
};

const CAREER = { sailing: 'navigator', martial: 'archer', song: 'bard', piety: 'priestess', farming: 'herder', eloquence: 'envoy', wits: 'envoy', etiquette: 'envoy', courage: 'guardian' };

export function decideEnding(s) {
  const f = s.flags;
  if (f.defeated) return 'defeat';
  if (s.runaways >= 2) return 'sailedAway';
  if (s.finalChoice === 'sea') return 'returnSea';
  if (s.finalChoice === 'defy') return s.stats.courage >= 150 ? 'defier' : 'returnSea';
  if (s.trust >= 90 && s.promisesKept >= 1 && s.promisesBroken === 0) return 'family';
  // 堕落：被塞壬诱惑过、背弃众神、和你也不亲近
  if ((f.sirenTempted || f.sirenWhisper) && s.traits.pious <= -40 && s.trust < 40 && s.finalChoice !== 'land') return 'monster';
  if (s.traits.pious >= 40 && s.stats.wits >= 250 && f.savedTelemachus && f.trustedBeggar) return 'athena';
  // 英雄：打赢至少 4 只怪物，而且足够勇敢
  const beaten = ['harpies', 'boar', 'sirens', 'scylla', 'ketos'].filter((m) => f['beat_' + m]).length;
  if (beaten >= 4 && s.stats.courage >= 150) return 'heroine';
  // 神眷：非常虔诚，并且在怪物面前得到过神的帮助或至少战胜过两只怪物
  if (s.traits.pious >= 50 && s.stats.piety >= 200 && (beaten >= 2 || f.athenaAid || f.calmedKetos)) return 'blessed';
  // 刺客：智谋和武艺都高，性格独立而沉默
  if (s.stats.wits >= 180 && s.stats.martial >= 150 && s.traits.depend <= -40 && s.traits.cheer <= -20) return 'assassin';
  let top = null, topV = 0;
  for (const k of Object.keys(CAREER)) if (s.stats[k] > topV) { topV = s.stats[k]; top = k; }
  if (topV >= 250) return CAREER[top];
  return 'ordinary';
}

export function scoreOf(s, ending) {
  let sum = 0;
  for (const [k, v] of Object.entries(s.stats)) if (k !== 'stress') sum += v;
  const bonus = { family: 800, athena: 800, heroine: 700, blessed: 700, defier: 500, assassin: 400, monster: -100, defeat: -300 }[ending] || 0;
  return Math.max(0, Math.round(sum + s.trust * 5 + s.silver / 2 + bonus));
}

// 图鉴里还没解锁的结局：只给一句模糊的提示，保留悬念
export const ENDING_HINTS = {
  heroine: { zh: '山里和海上都有怪物在等着……要有人迎上去。', en: 'Monsters wait in the hills and the sea... someone has to face them.' },
  blessed: { zh: '众神一直在看着。虔诚的人，也许会被选中。', en: 'The gods are always watching. The devout may be chosen.' },
  monster: { zh: '有些歌声，不该去听。', en: 'Some songs should never be heeded.' },
  assassin: { zh: '夜里也有守护伊萨卡的人。安静、独立、又聪明。', en: 'Ithaca has guardians in the night too. Quiet, independent, clever.' },
  defeat: { zh: '最后的大厅里，需要力量、勇气和智慧。', en: 'The final hall demands strength, courage and wits.' },
  sailedAway: { zh: '如果她总是想逃离……', en: 'If she keeps wanting to run away...' },
  returnSea: { zh: '海一直在叫她的名字。', en: 'The sea keeps calling her name.' },
  defier: { zh: '对神说"不"，需要非常大的勇气。', en: 'Saying "no" to a god takes great courage.' },
  family: { zh: '一直信任她，并且从不食言。', en: 'Always trust her, and never break a promise.' },
  athena: { zh: '信神、聪明，并且帮助了该帮助的人。也许"你"并不只是你。', en: 'Be pious and wise, and help those who need it. Perhaps "you" are not only you.' },
  navigator: { zh: '海平线那边，有一条属于她的船。', en: 'Beyond the horizon, a ship of her own.' },
  archer: { zh: '她的箭比海鸥还快。', en: 'Her arrows outfly the gulls.' },
  bard: { zh: '把这一年唱成一首歌。', en: 'Turn the year into a song.' },
  priestess: { zh: '神庙的火需要有人看守。', en: 'The temple fire needs a keeper.' },
  herder: { zh: '欧迈俄斯的羊群需要新的主人。', en: "Eumaeus's flocks need a new keeper." },
  envoy: { zh: '口才、智慧和礼仪，可以平息纷争。', en: 'Words, wisdom and courtesy can end quarrels.' },
  guardian: { zh: '勇敢的人，守护王宫的大门。', en: 'The brave guard the palace doors.' },
  ordinary: { zh: '平凡，也是一种幸福。', en: 'An ordinary life is a happy one too.' },
};
