// 怪物对峙：一年里 5 次遇到希腊神话里的怪物。她可以像英雄一样迎战（对峙小游戏），也可以用智慧、歌声或祈祷化解。
// 选项里的 duel: '<怪物>' 表示进入对峙小游戏；打赢写入 flag beat_<怪物>，计入"英雄"结局。
const L = (who, zh, en, face) => ({ who, text: { zh, en }, ...(face ? { face } : {}) });
const N = (zh, en) => ({ zh, en });

export const MONSTER_SPEAKERS = {
  harpy: { zh: '哈耳庇厄', en: 'Harpy' },
  siren: { zh: '塞壬', en: 'Siren' },
  fisher: { zh: '老渔夫', en: 'Old Fisherman' },
};

// 对峙小游戏的怪物参数：hp = 要打中几次；speed = 出招提示的时间（毫秒，越小越快）；moves = 可能的出招方向
export const DUELS = {
  harpies: { name: N('哈耳庇厄', 'The Harpies'), hp: 3, speed: 1100, moves: ['left', 'right', 'up'], sprite: 'mon_harpies', bg: 'hall',
    tell: { left: N('从左边俯冲！', 'Diving from the left!'), right: N('从右边俯冲！', 'Diving from the right!'), up: N('从头顶扑下来！', 'Swooping from above!') } },
  boar: { name: N('涅里同山的巨野猪', 'The Giant Boar of Neriton'), hp: 4, speed: 1000, moves: ['left', 'right'], sprite: 'mon_boar', bg: 'pasture',
    tell: { left: N('它往左冲过来了！', 'It charges to the left!'), right: N('它往右冲过来了！', 'It charges to the right!') } },
  sirens: { name: N('塞壬', 'The Sirens'), hp: 4, speed: 950, moves: ['left', 'right', 'up'], sprite: 'mon_sirens', bg: 'cg_mon_sirens',
    tell: { left: N('左边的歌声缠上来了——躲开！', 'The song coils in from the left — dodge!'), right: N('右边的歌声——躲开！', 'The song from the right — dodge!'), up: N('高音从头顶压下来！', 'A high note crashes from above!') } },
  scylla: { name: N('斯库拉', 'Scylla'), hp: 5, speed: 850, moves: ['left', 'right', 'up'], sprite: 'mon_scylla', bg: 'cg_mon_scylla',
    tell: { left: N('左边的狗头咬过来！', 'A dog-head snaps from the left!'), right: N('右边的狗头咬过来！', 'A dog-head snaps from the right!'), up: N('两个头一起从上面扑下！', 'Two heads lunge from above!') } },
  ketos: { name: N('海神的海怪', "Poseidon's Sea Serpent"), hp: 6, speed: 780, moves: ['left', 'right', 'up'], sprite: 'mon_ketos', bg: 'cg_mon_ketos',
    tell: { left: N('尾巴从左边扫过来！', 'Its tail sweeps from the left!'), right: N('尾巴从右边扫过来！', 'Its tail sweeps from the right!'), up: N('巨浪从头顶砸下！', 'A great wave crashes from above!') } },
};

export const MONSTER_EVENTS = [
  {
    id: 'mon_harpies', month: 3, week: 1, scene: 'hall', cg: 'cg_mon_harpies', cgIone: true,
    lines: [
      L('narrator', '求婚者的宴会正闹得最凶的时候，屋顶的天窗忽然暗了下来。两个长着女人面孔、鸟翅膀和铁爪子的怪物俯冲进大厅。', 'At the height of the suitors\' feast, the light from the roof-opening suddenly darkens. Two creatures with women\'s faces, bird wings and iron talons dive into the hall.'),
      L('nurse', '哈耳庇厄！是"抢夺者"！快护住孩子们！', 'Harpies! The Snatchers! Protect the children!'),
      L('narrator', '面包、烤肉、金杯——它们抓起什么就叼走什么。安提诺俄斯钻到了桌子底下。', 'Bread, roast meat, golden cups — they seize whatever they can. Antinous dives under a table.'),
      L('ione', '它们要把奶妈的厨房也抢光了！……{you}，把弓给我！', 'They\'ll strip Nurse\'s kitchen bare too! ...{you}, give me a bow!', 'determined'),
    ],
    choices: [
      { text: N('把弓递给她："瞄准翅膀！"', 'Hand her the bow: "Aim for the wings!"'), duel: 'harpies', t: { gentle: -2, depend: -2 },
        win: { fx: { martial: 8, courage: 8 }, trust: 4 }, lose: { fx: { stress: 8, courage: 3 } },
        success: [L('narrator', '一支箭擦过翅膀，哈耳庇厄尖叫着丢下金杯，从天窗逃走了。满堂求婚者目瞪口呆。', 'An arrow grazes a wing; the Harpies shriek, drop the golden cup and flee through the roof. The suitors gape.'), L('ione', '哼，下次别来了！', 'Hmph, don\'t come back!', 'smirk')],
        fail: [L('narrator', '哈耳庇厄太快了。它们抓走了一半的宴席，还在她手臂上划了一道口子。', 'The Harpies are too fast. They carry off half the feast and leave a scratch on her arm.'), L('ione', '……下次我一定射中。', '...Next time I\'ll hit them.', 'pout')] },
      { text: N('"敲响铜盘，用声音吓走它们！"', '"Bang the bronze platters — scare them off with noise!"'), check: { stats: ['wits', 'courage'], need: 60 }, flag: 'scaredHarpies', fx: { wits: 6 },
        success: [L('narrator', '她和侍女们一起把铜盘敲得震天响。哈耳庇厄捂着耳朵逃走了。', 'She and the maids beat the platters until the hall rings. The Harpies flee, clutching their ears.'), L('ione', '原来它们怕吵！', 'So they hate noise!', 'laugh')],
        fail: [L('narrator', '声音不够大，怪物抢够了才慢悠悠地飞走。', 'The noise isn\'t enough; the creatures leave only when they\'ve had their fill.')] },
      { text: N('"先护着奶妈躲到厨房去！"', '"First get Nurse safe in the kitchen!"'), t: { gentle: 4, depend: 2 }, trust: 3,
        reply: [L('nurse', '好孩子……你自己也要小心。', 'Good child... you be careful too.'), L('ione', '我才不怕它们。……但是奶妈不能有事。', 'I\'m not scared of them. ...But nothing can happen to Nurse.', 'shy')] },
    ],
    note: N('哈耳庇厄（Harpies）意思是"抢夺者"。《奥德赛》第二十卷提到它们卷走了潘达瑞俄斯的女儿；在阿尔戈英雄的故事里，她们不停抢走盲眼预言家菲纽斯的食物。古希腊人用她们来解释突然消失的人和突如其来的狂风。',
      'The Harpies were "the Snatchers". Odyssey Book 20 says they swept away the daughters of Pandareus; in the Argonauts\' tale they kept stealing the blind seer Phineus\'s food. Greeks used them to explain sudden gusts and people who vanished without a trace.'),
  },
  {
    id: 'mon_boar', month: 4, week: 4, scene: 'pasture', cg: 'cg_mon_boar', cgIone: true,
    lines: [
      L('eumaeus', '涅里同山上来了一头巨野猪，一夜之间踩烂了三块田，还撞死了我两头猪。', 'A giant boar has come down from Mount Neriton. In one night it trampled three fields and killed two of my pigs.'),
      L('eumaeus', '主人年轻时也遇到过这样一头。在帕尔纳索斯山上，獠牙划破了他的膝盖，留下一道长长的疤。', 'The master met one like it when he was young. On Mount Parnassus its tusk tore open his knee and left a long scar.'),
      L('ione', '……女孩子也能去猎野猪吗？', '...Can a girl hunt a boar?', 'thinking'),
      L('eumaeus', '哈！你听过阿塔兰忒吗？卡吕冬猎野猪的时候，一屋子的英雄，第一个射中野猪的就是她。', 'Ha! Have you heard of Atalanta? At the great Calydonian boar hunt, with a crowd of heroes, she was the first to draw its blood.'),
    ],
    choices: [
      { text: N('"我们一起去。我在你身边。"', '"We go together. I\'ll be beside you."'), duel: 'boar', t: { gentle: -2, depend: -3 },
        win: { fx: { martial: 10, courage: 10, farming: 4 }, trust: 5 }, lose: { fx: { stress: 10, courage: 4 } },
        success: [L('narrator', '野猪撞上她低低架起的长矛，轰然倒下。欧迈俄斯扔掉帽子大喊："阿塔兰忒回来了！"', 'The boar runs onto her low-braced spear and crashes down. Eumaeus throws his cap in the air: "Atalanta has come back!"'), L('ione', '我……我做到了？我做到了！', 'I... I did it? I did it!', 'laugh')],
        fail: [L('narrator', '野猪把她撞翻在草丛里，转身逃回了山林。她没受重伤，但气得直跺脚。', 'The boar knocks her into the grass and bolts back to the woods. She isn\'t badly hurt, but she stamps with frustration.'), L('ione', '它跑了！下次它跑不掉。', 'It got away! Next time it won\'t.', 'angry')] },
      { text: N('"不硬拼。我们在它的必经之路挖陷阱。"', '"Don\'t fight it head-on. We dig a pit on its trail."'), check: { stats: ['wits', 'farming'], need: 70 }, flag: 'trappedBoar', fx: { wits: 6, farming: 6 },
        success: [L('narrator', '第二天清晨，巨野猪掉进了陷阱，欧迈俄斯的田保住了。', 'At dawn the boar falls into the pit, and Eumaeus\'s fields are saved.'), L('ione', '聪明也是一种勇敢，对吧？', 'Being clever is a kind of brave too, right?', 'smirk')],
        fail: [L('narrator', '野猪绕开了陷阱。不过它好像也被吓到了，没再下山。', 'The boar skirts the pit. But it seems spooked, and stays up the mountain.')] },
      { text: N('"太危险了，交给猎人吧。"', '"Too dangerous. Leave it to the hunters."'), t: { depend: 3 }, trust: -1,
        reply: [L('ione', '……阿塔兰忒就不会这么说。', '...Atalanta wouldn\'t say that.', 'pout')] },
    ],
    note: N('《奥德赛》第十九卷讲到奥德修斯少年时在帕尔纳索斯山猎野猪，膝上留下伤疤，后来奶妈正是凭这道疤认出了他。卡吕冬野猪狩猎中，女猎手阿塔兰忒第一个射中野猪，获得了野猪皮作为荣誉——在希腊神话里，女孩子同样可以是英雄。',
      'Odyssey Book 19 tells how young Odysseus hunted a boar on Mount Parnassus and got the knee scar by which his nurse later knew him. At the Calydonian boar hunt, the huntress Atalanta drew first blood and won the boar\'s hide as the prize of honor — in Greek myth a girl could be a hero too.'),
  },
  {
    id: 'mon_sirens', month: 6, week: 1, scene: 'harbor', cg: 'cg_mon_sirens', cgIone: true,
    lines: [
      L('narrator', '她和狄翁划船去远处的礁石下网。风停了，海面平得像镜子。然后，歌声从开满花的岩石上飘了过来。', 'She and Dion row out to the far rocks to set their nets. The wind dies; the sea goes glassy. Then a song drifts from the flowering rocks.'),
      L('siren', '伊俄涅……伊俄涅……到我们这里来。我们知道你从哪里来，知道你的母亲是谁……', 'Ione... Ione... come to us. We know where you come from. We know who your mother is...'),
      L('dion', '伊俄涅！别听！我爹说过，听了塞壬的歌，船就会撞上礁石——快，用蜡塞住耳朵！', 'Ione! Don\'t listen! My father said whoever hears the Sirens wrecks on the rocks — quick, stop your ears with wax!'),
      L('ione', '可是……她们知道我的母亲……', 'But... they know my mother...', 'tearful'),
    ],
    choices: [
      { text: N('（在她心里响起你的声音）"用你自己的歌盖过她们！"', '(Your voice in her heart) "Drown them out with your own song!"'), duel: 'sirens', t: { pious: 2, depend: -2 },
        win: { fx: { song: 10, courage: 8 }, trust: 4, flag: 'resistedSirens' }, lose: { fx: { stress: 12 }, flag: 'sirenWhisper' },
        success: [L('narrator', '她站在船头放声歌唱，唱的是奶妈哄她睡觉的歌。塞壬的歌声一点点变弱，最后只剩下海浪声。', 'She stands at the prow and sings with all her strength — the lullaby Nurse sings her. The Sirens\' song grows weaker and weaker until only the waves remain.'), L('ione', '我的母亲……我会自己去找。不用你们告诉我。', 'My mother... I\'ll find her myself. I don\'t need you to tell me.', 'determined')],
        fail: [L('narrator', '狄翁拼命把船划开了。她一路沉默，耳朵里还回响着那句"我们知道你的母亲"。', 'Dion rows them away with all his strength. She says nothing the whole way back, the words "we know your mother" still ringing in her ears.')] },
      { text: N('"像奥德修斯那样——把我绑在桅杆上！"', '"Like Odysseus — tie me to the mast!"'), check: { stats: ['courage', 'wits'], need: 90 }, flag: 'resistedSirens', fx: { courage: 6, wits: 4 },
        success: [L('narrator', '狄翁把她牢牢绑住。她听完了整首歌，挣扎、哭喊，但船平安地驶了过去。', 'Dion ties her fast. She hears the whole song, struggling and crying out, but the boat passes safely by.'), L('ione', '……我听到了。她们其实什么都不知道。只是想让人留下。', '...I heard it all. They don\'t really know anything. They just want you to stay.', 'thinking')],
        fail: [L('narrator', '绳子松了。狄翁扑过来按住她，才没让她跳下海。', 'The rope slips. Only Dion throwing himself on her stops her jumping into the sea.')] },
      { text: N('（什么都不做）', '(Do nothing)'), flag: 'sirenTempted', t: { pious: -6, depend: -4 }, fx: { stress: 10 }, trust: -3,
        reply: [L('narrator', '她慢慢站起来，朝岩石伸出手。狄翁一把把她拽回船里，调头就划。', 'She rises slowly and reaches toward the rocks. Dion yanks her back into the boat and rows away hard.'), L('ione', '……她们说的是真的吗？……我是不是本来就属于那里？', '...Was it true? ...Do I belong over there?', 'scared')] },
    ],
    note: N('《奥德赛》第十二卷：女巫基尔克告诉奥德修斯，用蜂蜡塞住水手的耳朵，再把自己绑在桅杆上，就能听塞壬的歌而不丧命。古希腊陶瓶上的塞壬是鸟身女首，和后来"美人鱼"的形象不同。传说俄耳甫斯曾用自己的琴声盖过了塞壬的歌。',
      'Odyssey Book 12: Circe tells Odysseus to stop his men\'s ears with beeswax and have himself bound to the mast, so he can hear the Sirens and live. On Greek vases Sirens are bird-bodied women — not the mermaids of later stories. Orpheus is said to have drowned out their song with his own music.'),
  },
  {
    id: 'mon_scylla', month: 8, week: 4, scene: 'storm', cg: 'cg_mon_scylla', cgIone: true,
    lines: [
      L('narrator', '报信回来的路上，风暴把小船卷进了一道窄窄的海峡。一边是能吞下整条船的漩涡，一边是高耸的悬崖，崖上有个黑洞洞的山洞。', 'On the way back from warning the prince, a storm drives their little boat into a narrow strait. On one side, a whirlpool that could swallow a ship; on the other, a towering cliff with a black cave.'),
      L('dion', '那……那是卡律布狄斯！另一边是——', 'That... that\'s Charybdis! And the other side is—', ),
      L('narrator', '山洞里伸出了六条长长的脖子，每条脖子上都是一颗狂吠的狗头。', 'Six long necks uncoil from the cave, each ending in a baying dog\'s head.'),
      L('ione', '斯库拉……！狄翁，你只管划船，我来引开它！', 'Scylla...! Dion, just row — I\'ll draw it off!', 'determined'),
    ],
    choices: [
      { text: N('"点燃火把，把它的头都引到你那边！"', '"Light the torch — draw every head toward you!"'), duel: 'scylla', t: { gentle: -3, depend: -3 },
        win: { fx: { courage: 12, martial: 6, sailing: 6 }, trust: 5 }, lose: { fx: { stress: 12, courage: 5 } },
        success: [L('narrator', '火把在她手里划出一道道火光，狗头们畏缩着缩回了洞里。小船冲出了海峡。', 'The torch traces arcs of fire in her hands; the dog-heads flinch back into the cave. The boat bursts out of the strait.'), L('dion', '你……你真的是人类吗？', 'Are you... are you even human?'), L('ione', '我是伊俄涅。这样就够了。', 'I\'m Ione. That\'s enough.', 'smirk')],
        fail: [L('narrator', '一颗狗头叼走了船桨，小船差点翻了。他们最后是被浪推出海峡的，两个人都吓得说不出话。', 'A dog-head snatches an oar and the boat nearly capsizes. A wave finally flings them out of the strait, both too shaken to speak.')] },
      { text: N('"贴着悬崖，用最快的速度划过去！"', '"Hug the cliff and row through as fast as you can!"'), check: { stats: ['sailing', 'courage'], need: 140 }, flag: 'passedScylla', fx: { sailing: 8 },
        success: [L('narrator', '小船像一支箭一样从狗头下面钻了过去。', 'The boat shoots beneath the dog-heads like an arrow.')],
        fail: [L('narrator', '船慢了一步，一颗狗头擦过她的肩膀。她咬着牙没有松开桨。', 'The boat is a moment too slow; a dog-head grazes her shoulder. She grits her teeth and doesn\'t let go of the oar.')] },
      { text: N('"向雅典娜祈祷！"', '"Pray to Athena!"'), check: { stats: ['piety'], need: 80 }, flag: 'athenaAid', t: { pious: 5 }, fx: { piety: 6 },
        success: [L('narrator', '一只猫头鹰从风暴里飞出来，在船前盘旋。浓雾升起，斯库拉的狗头在雾里扑了个空。', 'An owl flies out of the storm and circles the prow. A thick mist rises, and Scylla\'s heads snap at nothing.')],
        fail: [L('narrator', '没有回应。最后是狄翁拼命划桨，他们才逃了出来。', 'No answer comes. Only Dion\'s desperate rowing gets them out.')] },
    ],
    note: N('《奥德赛》第十二卷：斯库拉住在海峡一侧的山洞里，有六个头；对面是吞吐海水的漩涡卡律布狄斯。奥德修斯选择靠近斯库拉，失去了六个同伴，却保住了船。"在斯库拉和卡律布狄斯之间"至今仍是"进退两难"的说法。',
      'Odyssey Book 12: Scylla lives in a cave on one side of a strait, with six heads; opposite her is the swallowing whirlpool Charybdis. Odysseus chose to pass near Scylla, losing six men but saving the ship. "Between Scylla and Charybdis" still means having to choose between two dangers.'),
  },
  {
    id: 'mon_ketos', month: 11, week: 4, scene: 'storm', cg: 'cg_mon_ketos', cgIone: true,
    lines: [
      L('narrator', '风暴第三次来到伊萨卡，这一次比任何一次都可怕。港口的海水翻起来，一条巨大的海怪从浪里昂起头。', 'The storm comes to Ithaca a third time, worse than ever. The harbor water heaves, and a vast sea serpent rears its head out of the waves.'),
      L('poseidon', '伊俄涅。你不来，我就让它把这座岛吞掉。', 'Ione. If you do not come, I will let it swallow this island.'),
      L('fisher', '跑啊！大家快跑！', 'Run! Everyone run!'),
      L('ione', '……不。这是我的家。谁也不许碰它。', '...No. This is my home. No one touches it.', 'determined'),
    ],
    choices: [
      { text: N('把奥德修斯家的长矛和盾递给她："我相信你。"', 'Hand her the spear and shield of Odysseus\'s house: "I believe in you."'), duel: 'ketos', t: { pious: -2, depend: -4 },
        win: { fx: { courage: 15, martial: 10 }, trust: 6 }, lose: { fx: { stress: 15, courage: 6 } },
        success: [L('narrator', '长矛刺中了海怪的鳞片缝隙。它发出一声长啸，沉回了深海。整个港口的人都看见了：一个十四岁的女孩站在码头尽头，没有后退一步。', 'The spear strikes between the serpent\'s scales. With a long roar it sinks back into the deep. The whole harbor saw it: a fourteen-year-old girl at the end of the pier, who never took a step back.'), L('ione', '……我是不是……有点像英雄了？', '...Am I... a little bit like a hero now?', 'tearful')],
        fail: [L('narrator', '海怪的尾巴把她扫进了海里。是海浪又把她托回了岸边——好像有谁不想让她受伤。海怪暂时退去了，但风暴还没有停。', 'The serpent\'s tail sweeps her into the sea. The waves carry her back to shore — as if someone did not want her hurt. The monster withdraws for now, but the storm does not stop.')] },
      { text: N('"唱歌给它听。它也是海的孩子。"', '"Sing to it. It\'s a child of the sea too."'), check: { stats: ['song', 'piety'], need: 200 }, flag: 'calmedKetos', t: { gentle: 6, pious: 3 }, fx: { song: 8 },
        success: [L('narrator', '她唱起了一首没人教过她的歌。海怪安静下来，低下头，像一条大狗一样蹭了蹭码头，然后游走了。', 'She sings a song no one ever taught her. The serpent grows still, lowers its head, nuzzles the pier like a great dog — and swims away.'), L('ione', '这首歌……是我母亲唱的吗？', 'That song... did my mother sing it?', 'surprised')],
        fail: [L('narrator', '歌声被风暴吞没了。海怪撞塌了半截码头才退走。', 'The song is swallowed by the storm. The serpent smashes half the pier before it withdraws.')] },
      { text: N('"……也许你该跟它走。"', '"...Maybe you should go with it."'), flag: 'yieldedKetos', t: { depend: 3, pious: -3 }, trust: -6, fx: { stress: 15 },
        reply: [L('ione', '……你也想让我走吗？', '...You want me to leave too?', 'sad'), L('narrator', '海怪看了她很久，慢慢沉了下去。它会回来的。', 'The serpent watches her a long time, then slowly sinks. It will be back.')] },
    ],
    note: N('"刻托斯"（ketos）是希腊神话里的海怪。波塞冬曾派刻托斯去袭击埃塞俄比亚，要吞掉公主安德洛墨达，是珀耳修斯救了她；赫拉克勒斯也曾从海怪口中救出特洛伊公主赫西俄涅。古希腊陶画里的刻托斯有龙一样的头和卷曲的尾巴。',
      'A ketos is a sea monster of Greek myth. Poseidon sent one to ravage Ethiopia and devour Princess Andromeda, until Perseus saved her; Heracles likewise rescued the Trojan princess Hesione from one. On Greek vases a ketos has a dragon-like head and a coiling tail.'),
  },
];

// 打赢了几只怪物（"英雄"结局要用）
export const MONSTER_FLAGS = ['beat_harpies', 'beat_boar', 'beat_sirens', 'beat_scylla', 'beat_ketos', 'scaredHarpies', 'trappedBoar', 'resistedSirens', 'passedScylla', 'calmedKetos'];
export const monstersFaced = (s) => ['harpies', 'boar', 'sirens', 'scylla', 'ketos'].filter((m) => s.flags['beat_' + m]).length;
