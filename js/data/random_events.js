// 随机事件：没有主线事件的周末，有一定几率触发其中一个（按 weight 抽取）。
// months: [起, 止]  once: 只会发生一次  cond: 条件（同主线）  其余字段同 events.js
// 所有文字都是原创。

const L = (who, zh, en, face) => ({ who, text: { zh, en }, ...(face ? { face } : {}) });
const N = (zh, en) => L('narrator', zh, en);
const T = (zh, en) => ({ zh, en });

export const RANDOM_EVENTS = [
  {
    id: 'r_goat', weight: 3, months: [1, 12], once: true, scene: 'pasture',
    lines: [
      L('eumaeus', '糟了，那只带铃铛的老母羊不见了！天快黑了，山上有狼。', 'Blast — the old bell-ewe is missing! It\'s getting dark, and there are wolves on the hill.'),
      L('ione', '我听见铃铛了……很远，在东边的山沟里。', 'I can hear the bell... far off, in the eastern gully.', 'thinking'),
    ],
    choices: [
      { text: T('和她一起去找。', 'Go search with her.'), fx: { farming: 5, courage: 3, stamina: -2 }, trust: 3,
        reply: [L('ione', '找到了！它卡在荆棘丛里，正生气呢。', 'Found her! She\'s stuck in the brambles, and furious about it.', 'laugh')] },
      { text: T('"让欧迈俄斯带狗去，天黑了你别乱跑。"', '"Let Eumaeus take the dogs. Don\'t run about in the dark."'), t: { depend: 3 }, fx: { stress: -3 },
        reply: [L('ione', '……好吧。可我耳朵比狗还灵。', '...Fine. But my ears are sharper than the dogs\'.', 'pout')] },
    ],
  },
  {
    id: 'r_gull', weight: 3, months: [1, 12], once: true, scene: 'shore', cg: 'cg_r_gull', cgIone: true,
    lines: [
      N('沙滩上有一只海鸥，翅膀被渔线缠住，扑腾不起来。', 'On the beach a gull flaps helplessly, its wing tangled in fishing line.'),
      L('ione', '别动，别动……我帮你解开。', 'Hold still, hold still... I\'ll untangle you.', 'calm'),
    ],
    choices: [
      { text: T('帮她把海鸥带回去养伤。', 'Help her take the gull home to heal.'), t: { gentle: 6 }, fx: { stress: -4 },
        reply: [N('三天后，海鸥飞走了。可它每天早上都会回来，在伊俄涅窗外叫一声。', 'Three days later the gull flies off. But every morning it comes back and cries once outside Ione\'s window.')] },
      { text: T('"解开就放它走吧，海鸥属于天空。"', '"Untangle it and let it go. Gulls belong to the sky."'), t: { depend: -3 }, fx: { wits: 2 },
        reply: [L('ione', '属于天空……那我属于哪里？', 'Belongs to the sky... then where do I belong?', 'thinking')] },
    ],
  },
  {
    id: 'r_haggle', weight: 3, months: [1, 12], once: false, scene: 'agora',
    lines: [
      N('集市上，一个卖染色羊毛的商人开价很高。伊俄涅想给王后买一束海紫色的毛线。', 'At the market a wool-dyer asks a steep price. Ione wants to buy a skein of sea-purple yarn for the queen.'),
      L('ione', '这么贵？你的紫色还没有海水好看。', 'That much? Your purple isn\'t even as pretty as seawater.', 'smirk'),
    ],
    choices: [
      { text: T('让她自己讨价还价。', 'Let her haggle for herself.'), fx: { eloquence: 4 }, t: { depend: -3 }, silver: -3,
        reply: [L('ione', '便宜了一半！王后一定会喜欢。', 'Half price! The queen will love it.', 'happy')] },
      { text: T('替她付钱。', 'Pay for her.'), silver: -6, trust: 2, t: { depend: 2 },
        reply: [L('ione', '……谢谢。下次我自己来。', '...Thanks. Next time I\'ll do it myself.', 'shy')] },
    ],
    note: T('荷马时代还没有钱币。人们以物易物，或者用牛、铜鼎、铁块来衡量价值。紫色染料从海螺里提取，非常昂贵。（游戏里的"银币"是为了方便而做的简化。）',
      'There were no coins yet in Homer\'s age. People bartered, or measured value in oxen, tripods or lumps of iron. Purple dye came from sea snails and was very costly. (The game\'s "silver" is a simplification.)'),
  },
  {
    id: 'r_stars', weight: 2, months: [1, 12], once: true, scene: 'shore', cg: 'cg_r_stars', cgIone: true,
    lines: [
      N('夜空里落下一道又一道流星。你和伊俄涅躺在沙滩上数星星。', 'Shooting stars streak across the night sky. You and Ione lie on the sand counting stars.'),
      L('ione', '那七颗挤在一起的星星叫什么？', 'What are those seven stars huddled together?', 'thinking'),
      N('你告诉她：那是昴星团。奥德修斯离开卡吕普索的岛时，就是盯着昴星团、牧夫座和大熊座，一直让大熊座在左手边航行的。', 'You tell her: the Pleiades. When Odysseus left Calypso\'s island, he steered by the Pleiades, the Ploughman, and the Bear, keeping the Bear on his left hand.'),
      L('ione', '那我也学会看星星，就永远不会迷路了。', 'Then if I learn the stars too, I\'ll never get lost.', 'happy'),
    ],
    choices: [
      { text: T('教她认星星。', 'Teach her the stars.'), fx: { sailing: 6, wits: 3 }, trust: 3,
        reply: [L('ione', '大熊……永远不会沉进海里的那一个。我记住了。', 'The Bear... the one that never sinks into the sea. Got it.', 'calm')] },
      { text: T('陪她安静地看着。', 'Just watch quietly with her.'), trust: 5, fx: { stress: -8 },
        reply: [L('ione', '……这样就很好。', '...This is nice.', 'sleepy')] },
    ],
    note: T('《奥德赛》第五卷描写奥德修斯靠星星航海：昴星团、牧夫座和"永不沉入大洋的"大熊座。这是古希腊人真实的航海方法。',
      'Odyssey Book 5 shows Odysseus navigating by the stars: the Pleiades, Boötes, and the Bear "which never bathes in Ocean". This was a real Greek sailing method.'),
  },
  {
    id: 'r_shell_msg', weight: 2, months: [5, 11], once: true, scene: 'shore', cond: { flags: ['knowsOrigin'] },
    lines: [
      N('伊俄涅把一只大海螺贴在耳边，听了很久。', 'Ione holds a big conch to her ear and listens a long while.'),
      L('ione', '……海螺里有人在唱歌。不是风声。是一首摇篮曲。', '...Someone is singing inside the shell. Not the wind. A lullaby.', 'surprised'),
      L('ione', '我会唱这首歌。我不知道为什么，可我会。', 'I know this song. I don\'t know why, but I do.', 'tearful'),
    ],
    choices: [
      { text: T('"唱给我听吧。"', '"Sing it for me."'), fx: { song: 6 }, trust: 4, t: { cheer: 2 },
        reply: [N('她轻轻唱了起来。歌词是一种你从没听过的语言，像浪花拍打礁石。', 'She sings softly. The words are in a language you have never heard, like waves on rock.')] },
      { text: T('"把海螺收好。"', '"Keep the conch safe."'), fx: { wits: 3 }, t: { pious: 3 },
        reply: [L('ione', '嗯。想家的时候就听一听。', 'Mm. I\'ll listen when I miss home.', 'sad')] },
    ],
  },
  {
    id: 'r_dion_fish', weight: 3, months: [2, 11], once: false, scene: 'harbor', cg: 'cg_r_dion_fish', cgIone: true,
    lines: [
      L('dion', '今晚没月亮，正好点火把捕鱼！鱼会被光吸引过来。来不来？', 'No moon tonight — perfect for torch-fishing! The fish come to the light. You in?'),
      L('ione', '来！我拿火把，你拿鱼叉。', 'In! I\'ll hold the torch, you take the spear.', 'happy'),
    ],
    choices: [
      { text: T('"去吧，天亮前回来。"', '"Go. Be back by dawn."'), fx: { sailing: 4, stamina: -2 }, t: { cheer: 4, depend: -2 }, silver: 4,
        reply: [L('ione', '我们抓了二十条！狄翁说分我一半去卖。', 'We caught twenty! Dion says half are mine to sell.', 'laugh')] },
      { text: T('"太晚了，今天不行。"', '"It\'s too late. Not tonight."'), t: { depend: 3 }, trust: -1,
        reply: [L('ione', '……哦。', '...Oh.', 'pout')] },
    ],
    note: T('点火把夜间捕鱼是地中海非常古老的捕鱼方法，在希腊的一些小岛上一直延续到现代。',
      'Torch-fishing at night is a very old Mediterranean method, practiced on some Greek islands into modern times.'),
  },
  {
    id: 'r_melantho_trick', weight: 3, months: [2, 10], once: false, scene: 'kitchen',
    lines: [
      N('伊俄涅的那份大麦粥里，被人撒了一把灶灰。墨兰托在门口捂着嘴笑。', 'Someone has thrown a handful of hearth ash into Ione\'s barley porridge. Melantho stands in the doorway, laughing behind her hand.'),
      L('ione', '……', '...', 'angry'),
    ],
    choices: [
      { text: T('"别理她。我分你一半。"', '"Ignore her. Have half of mine."'), trust: 4, t: { gentle: 3 }, fx: { stress: -3 },
        reply: [L('ione', '你的粥里放了蜂蜜。……好吃。', 'Yours has honey in it. ...It\'s good.', 'shy')] },
      { text: T('"去告诉奶妈。"', '"Go tell Nurse."'), fx: { etiquette: 3 }, t: { depend: 2 },
        reply: [L('nurse', '墨兰托！今天的地板全归你擦！', 'Melantho! You\'re scrubbing every floor today!'), L('ione', '嘿嘿。', 'Hehe.', 'smirk')] },
      { text: T('（看她怎么做。）', '(See what she does.)'), t: { gentle: -3 }, fx: { courage: 3 },
        reply: [N('第二天，墨兰托的梳子里爬出了三只小螃蟹。', 'The next day, three little crabs crawl out of Melantho\'s comb.'), L('ione', '我什么都不知道。', 'I know nothing about it.', 'smirk')] },
    ],
  },
  {
    id: 'r_eumaeus_tale', weight: 2, months: [1, 12], once: true, scene: 'eumaeus_hut',
    lines: [
      L('eumaeus', '主人年轻时，有一年冬天，他从特洛伊城外的伏兵里冻得直哆嗦。他对首领说："我把斗篷落在营地了。"其实是想骗一件斗篷来穿。', 'When the master was young — one winter at Troy, lying in ambush, he was shivering with cold. He told the captain, "I left my cloak at camp," just to trick his way into a cloak.'),
      L('ione', '他小时候就爱骗人吗？', 'Was he always a liar, even when he was young?', 'smirk'),
      L('eumaeus', '他骗敌人，从不骗朋友。这是两回事。', 'He fooled enemies, never friends. That\'s a different thing.'),
    ],
    choices: [
      { text: T('"聪明和狡猾，只差在用在谁身上。"', '"Cleverness and cunning differ only in who they\'re used on."'), fx: { wits: 5 },
        reply: [L('ione', '那我要当聪明的，不当狡猾的。……大概。', 'Then I\'ll be clever, not cunning. ...Probably.', 'thinking')] },
      { text: T('再给欧迈俄斯添一杯酒，听他讲下去。', 'Pour Eumaeus more wine and let him keep talking.'), fx: { eloquence: 3 }, t: { cheer: 3 },
        reply: [L('ione', '再讲一个！讲木马的！', 'Another one! The wooden horse!', 'happy')] },
    ],
    note: T('这个"骗斗篷"的故事其实是奥德修斯乔装成乞丐时，对欧迈俄斯讲的——他用一个故事暗示自己需要一件斗篷过夜。',
      'This "cloak trick" story is one the disguised Odysseus actually tells Eumaeus in the Odyssey — a hint that he could use a cloak for the night.'),
  },
  {
    id: 'r_olive', weight: 3, months: [4, 7], once: true, scene: 'laertes_farm', cg: 'cg_r_olive', cgIone: true,
    lines: [
      N('秋雨下过，橄榄熟了。全岛的人都提着篮子上山打橄榄。', 'The autumn rains have come and the olives are ripe. The whole island climbs the hills with baskets.'),
      L('ione', '用长竿打树枝……果子像下雨一样掉下来！', 'You beat the branches with long poles... the fruit falls like rain!', 'laugh'),
    ],
    choices: [
      { text: T('干一整天。', 'Work the whole day.'), fx: { farming: 6, stamina: 3, stress: 3 }, silver: 5,
        reply: [L('ione', '手全黑了……可橄榄油闻起来好香。', 'My hands are all black... but the olive oil smells wonderful.', 'happy')] },
      { text: T('在树下休息，听老人们唱劳动歌。', 'Rest under the trees and listen to the old folk\'s work songs.'), fx: { song: 4, stress: -6 },
        reply: [L('ione', '"打呀打，橄榄落……"我会唱了！', '"Beat, beat, the olives fall..." I can sing it now!', 'laugh')] },
    ],
    note: T('橄榄是古希腊最重要的作物之一：橄榄油用来吃、点灯、抹身体。雅典娜送给雅典人的礼物，传说就是第一棵橄榄树。',
      'The olive was one of ancient Greece\'s most important crops: its oil was eaten, burned in lamps, and rubbed on the body. Legend says Athena\'s gift to Athens was the first olive tree.'),
  },
  {
    id: 'r_vintage', weight: 2, months: [2, 4], once: true, scene: 'laertes_farm', cg: 'cg_r_vintage', cgIone: true,
    lines: [
      N('葡萄收获的季节，拉厄尔忒斯的果园里，年轻人光着脚在大石槽里踩葡萄，紫色的汁水溅得到处都是。', 'Grape harvest. In Laertes\'s orchard young people tread grapes barefoot in a great stone vat, splashing purple juice everywhere.'),
      L('dion', '伊俄涅，下来踩！谁先累了谁请吃无花果！', 'Ione, get in! Whoever tires first buys the figs!'),
    ],
    choices: [
      { text: T('"去吧！"', '"Go on!"'), fx: { stamina: 4, stress: -8 }, t: { cheer: 6 },
        reply: [L('ione', '哈哈哈！我的脚变成紫色的了！', 'Hahaha! My feet are purple!', 'laugh')] },
      { text: T('帮拉厄尔忒斯把酒罐封好。', 'Help Laertes seal the wine jars.'), fx: { farming: 4, etiquette: 2 }, t: { gentle: 3 },
        reply: [L('laertes', '这批酒，等我儿子回来喝。', 'This batch is for when my son comes home.')] },
    ],
    note: T('荷马描写过葡萄收获的欢乐场面：阿喀琉斯的盾牌上就刻着少男少女提着篮子摘葡萄、一个男孩弹着竖琴唱歌的图案。',
      'Homer describes the joy of the grape harvest: the shield of Achilles shows youths and maidens carrying baskets of grapes while a boy plays the lyre and sings.'),
  },
  {
    id: 'r_rhapsode', weight: 2, months: [3, 12], once: true, scene: 'agora', cg: 'cg_r_rhapsode', cgIone: true,
    lines: [
      N('一个游吟歌手来到集市，弹着竖琴唱起了木马的故事：希腊人把勇士藏在巨大的木马里，特洛伊人把它拖进了城。', 'A wandering singer comes to the market and sings of the wooden horse: the Greeks hid warriors inside a great wooden horse, and the Trojans dragged it into their city.'),
      L('rhapsode', '……想出这个主意的，正是伊萨卡的奥德修斯！', '...And the man who devised it was Odysseus of Ithaca!'),
      L('ione', '全世界都在唱他的故事，可他自己回不了家。', 'The whole world sings about him, and he can\'t get home.', 'sad'),
    ],
    choices: [
      { text: T('给歌手一块面包和一杯酒。', 'Give the singer bread and a cup of wine.'), silver: -2, fx: { song: 4, etiquette: 2 }, t: { gentle: 3 },
        reply: [L('rhapsode', '谢谢你们。我把伊萨卡的好客也编进歌里。', 'Thank you. I\'ll put the kindness of Ithaca into my song.')] },
      { text: T('（让伊俄涅跟着学唱。）', '(Let Ione learn the song.)'), fx: { song: 6 },
        reply: [L('ione', '"木马，木马，肚子里藏着英雄……"', '"Wooden horse, wooden horse, with heroes in its belly..."', 'laugh')] },
    ],
    note: T('《奥德赛》第八卷里，盲歌者得摩多科斯在费埃克斯人的宫廷唱了木马的故事，乔装的奥德修斯听了掩面而泣。',
      'In Odyssey Book 8 the blind singer Demodocus sings of the wooden horse at the Phaeacian court, and the disguised Odysseus hides his face and weeps.'),
  },
  {
    id: 'r_phoenician', weight: 2, months: [5, 11], once: true, scene: 'harbor',
    lines: [
      N('一艘腓尼基商船靠了港，船上堆满玻璃珠、象牙梳和紫色的布。一个商人笑眯眯地招呼伊俄涅。', 'A Phoenician trading ship has docked, piled with glass beads, ivory combs and purple cloth. A trader beckons to Ione with a broad smile.'),
      L('merchant', '小姑娘，上船来看看吧，船舱里还有更漂亮的项链，送你一条！', 'Little girl, come aboard and look — there are prettier necklaces in the hold. I\'ll give you one!'),
      L('ione', '……欧迈俄斯小时候，就是被这样骗上船的。', '...That\'s how Eumaeus was tricked onto a ship as a boy.', 'wary'),
    ],
    choices: [
      { text: T('"你很警惕，做得对。"', '"You\'re wary. Good."'), trust: 4, fx: { wits: 5 },
        reply: [L('ione', '我只在岸上看。要买就让他拿下来。', 'I\'ll only look from the shore. If I buy, he brings it down.', 'smirk')] },
      { text: T('陪她上船，看看那些稀罕货。', 'Go aboard with her to see the rare goods.'), fx: { eloquence: 3, wits: 2 }, silver: -4,
        reply: [L('ione', '那个蓝色的珠子……像海的颜色。谢谢你买给我。', 'That blue bead... it\'s the color of the sea. Thank you for buying it.', 'happy')] },
    ],
    note: T('腓尼基人是古代地中海最有名的航海商人，来自今天的黎巴嫩一带。《奥德赛》里提到他们时，常常带着"狡猾的骗子"的意味。',
      'The Phoenicians, from roughly modern Lebanon, were the most famous seafaring traders of the ancient Mediterranean. The Odyssey often mentions them as wily tricksters.'),
  },
  {
    id: 'r_libation', weight: 2, months: [1, 6], once: true, scene: 'kitchen',
    lines: [
      L('nurse', '吃饭之前，先倒一点酒在地上，敬给神。这叫祭奠。', 'Before eating, pour a little wine on the ground for the gods. That\'s called a libation.'),
      L('ione', '可是酒倒在地上，神喝得到吗？', 'But if it\'s poured on the ground, can the gods drink it?', 'thinking'),
      L('nurse', '神不在乎喝不喝得到，神在乎你记不记得他们。', 'The gods don\'t care whether they drink it. They care whether you remember them.'),
    ],
    choices: [
      { text: T('"跟奶妈学吧。"', '"Learn it from Nurse."'), fx: { piety: 4, etiquette: 3 }, t: { pious: 4 },
        reply: [L('ione', '敬宙斯，敬雅典娜……也敬海里的人。', 'To Zeus, to Athena... and to the ones in the sea.', 'calm')] },
      { text: T('"你觉得呢？"', '"What do you think?"'), fx: { wits: 3 }, t: { pious: -2, depend: -2 },
        reply: [L('ione', '我觉得……倒给海鸥喝比较好。', 'I think... it\'d be better to give it to the gulls.', 'smirk')] },
    ],
  },
  {
    id: 'r_nightmare', weight: 2, months: [3, 12], once: false, scene: 'room',
    lines: [
      N('半夜，伊俄涅惊叫着醒来，浑身是汗。', 'At midnight Ione wakes screaming, drenched in sweat.'),
      L('ione', '我梦见……海水涨上来，淹没了王宫，所有人都沉下去了，只有我在水里能呼吸……', 'I dreamed... the sea rose and drowned the palace. Everyone sank — and only I could breathe underwater...', 'scared'),
    ],
    choices: [
      { text: T('点上灯，陪她坐到天亮。', 'Light a lamp and sit with her until dawn.'), trust: 6, t: { depend: 4 }, fx: { stress: -6 },
        reply: [L('ione', '……有灯就好多了。', '...It\'s much better with a light.', 'sleepy')] },
      { text: T('"梦只是梦。从象牙门里来的，不会成真。"', '"Dreams are only dreams. The ones from the gate of ivory never come true."'), fx: { wits: 3 }, t: { pious: 2 },
        reply: [L('ione', '那……你怎么知道它是从哪扇门来的？', 'Then... how do you know which gate it came from?', 'thinking')] },
    ],
  },
  {
    id: 'r_fever', weight: 1, months: [4, 10], once: true, scene: 'room', cg: 'cg_r_fever', cgIone: true,
    lines: [
      N('伊俄涅发烧了，烧得满脸通红，嘴里念叨着听不懂的话。', 'Ione has a fever. Her face is flushed and she murmurs words no one understands.'),
      L('nurse', '我去煮锦葵和百里香的汤。门托尔大人，您守着她。', 'I\'ll boil a broth of mallow and thyme. Lord Mentor, you watch over her.'),
      L('ione', '……{you}？你还在吗……', '...{you}? Are you still there...', 'sleepy'),
    ],
    choices: [
      { text: T('握住她的手，一整夜都不离开。', 'Hold her hand and stay all night.'), trust: 10, t: { depend: 6 }, fx: { stamina: -3, stress: -5 },
        reply: [L('ione', '（第二天早上）……你的眼睛好红。你一夜没睡？', '(the next morning) ...Your eyes are so red. You didn\'t sleep all night?', 'surprised')] },
      { text: T('去神庙为她祈祷。', 'Go to the temple to pray for her.'), t: { pious: 5 }, fx: { piety: 5 }, trust: 3,
        reply: [L('ione', '（醒来后）……奶妈说，你去神庙了。为了我？', '(after waking) ...Nurse says you went to the temple. For me?', 'shy')] },
    ],
    note: T('荷马时代的医术主要靠草药和包扎伤口，人们也相信阿波罗能降下疾病、也能治愈疾病。',
      'Medicine in Homer\'s age relied mostly on herbs and bandaging wounds; people also believed Apollo could both send and cure disease.'),
  },
  {
    id: 'r_race', weight: 2, months: [2, 11], once: true, scene: 'agora',
    lines: [
      N('城里的少年们在集市边赛跑，赢的人能得到一只陶罐。狄翁也报了名。', 'The town\'s youths race along the edge of the market; the winner gets a clay jar. Dion has entered.'),
      L('dion', '伊俄涅，你也来！谁说女孩不能跑！', 'Ione, you too! Who says girls can\'t run!'),
    ],
    choices: [
      { text: T('"去跑吧。"', '"Go run."'), fx: { stamina: 5, courage: 3 }, t: { cheer: 4, depend: -2 },
        reply: [L('ione', '我第二！……狄翁第三！哈哈！', 'I came second! ...Dion came third! Haha!', 'laugh')] },
      { text: T('（让她在旁边给狄翁加油。）', '(Let her cheer for Dion from the side.)'), t: { gentle: 3 }, fx: { eloquence: 2 },
        reply: [L('ione', '狄翁！快跑！……啊，摔倒了。', 'Dion! Run! ...Ah, he fell.', 'surprised')] },
    ],
    note: T('赛跑是古希腊最古老的竞技项目。在荷马的《伊利亚特》里，奥德修斯在帕特罗克洛斯的葬礼竞技会上赢过一场赛跑——靠的是雅典娜让对手滑了一跤。',
      'The footrace is the oldest Greek athletic contest. In Homer\'s Iliad, Odysseus wins a race at the funeral games of Patroclus — because Athena makes his rival slip.'),
  },
  {
    id: 'r_letters', weight: 2, months: [3, 12], once: true, scene: 'room',
    lines: [
      L('ione', '{you}，你能教我写字吗？我想把海螺里的歌记下来。', '{you}, can you teach me to write? I want to write down the song in the conch.', 'shy'),
      N('你想了想。这座岛上会写字的人几乎没有。老人们说，很久以前宫殿里的书记官会在泥板上刻字，可那种文字早就失传了。', 'You think it over. Almost no one on this island can write. The old folk say that long ago palace scribes scratched signs on clay tablets, but that writing has long been lost.'),
    ],
    choices: [
      { text: T('"那我们自己发明一种记号。"', '"Then let\'s invent our own signs."'), fx: { wits: 8 }, t: { depend: -2 }, trust: 3,
        reply: [L('ione', '这个波浪的记号是"海"，这个圆圈是"你"。……这是我们的秘密文字！', 'This wavy mark means "sea", this circle means "you". ...It\'s our secret writing!', 'laugh')] },
      { text: T('"把歌记在心里吧，像歌者那样。"', '"Keep the song in your heart, as singers do."'), fx: { song: 5 },
        reply: [L('ione', '嗯。记在心里，就不会丢了。', 'Mm. In my heart, it can\'t get lost.', 'calm')] },
    ],
    note: T('迈锡尼时代的宫殿用"线形文字B"在泥板上记账，宫殿毁灭后这种文字就失传了。荷马的时代几乎没有人识字，史诗都是靠口耳相传；希腊字母要到大约公元前八世纪才出现。',
      'Mycenaean palaces kept accounts on clay tablets in "Linear B", a script lost when the palaces fell. In Homer\'s day almost no one could read; epics passed by word of mouth, and the Greek alphabet appeared only around the 8th century BC.'),
  },
  {
    id: 'r_suitor_gift', weight: 2, months: [3, 10], once: true, scene: 'hall',
    lines: [
      L('eurymachus', '小姑娘，这面铜镜送给你。你只要告诉我，王后每天晚上在织房里做什么。', 'Little girl, this bronze mirror is yours. All you have to do is tell me what the queen does in her weaving room each night.'),
      L('ione', '……', '...', 'wary'),
    ],
    choices: [
      { text: T('（让她自己回答。）', '(Let her answer for herself.)'), t: { depend: -3, gentle: -2 }, fx: { courage: 4 },
        reply: [L('ione', '她在织一张网。专门网你们这种鱼。', 'She\'s weaving a net. For catching fish like you.', 'smirk'), L('eurymachus', '你——！', 'Why, you —!')] },
      { text: T('把她拉到身后："她什么都不知道。"', 'Pull her behind you: "She knows nothing."'), trust: 5, t: { depend: 3 },
        reply: [L('ione', '……谢谢。他的镜子照出来的人都是歪的。', '...Thanks. His mirror makes everyone look crooked anyway.', 'pout')] },
    ],
    note: T('荷马时代的镜子是打磨光亮的青铜片，只有富人才用得起。',
      'Mirrors in Homer\'s age were polished bronze discs, a luxury only the rich could afford.'),
  },
  // —— 宠物随机事件 ——
  {
    id: 'r_pet_owl', weight: 3, months: [2, 12], once: true, scene: 'temple', cond: { pet: 'owl' },
    lines: [
      N('格劳克斯叼回来一根橄榄枝，放在伊俄涅的枕头上。橄榄枝上还缠着一缕灰色的羊毛。', 'Glaux brings back an olive sprig and lays it on Ione\'s pillow. A wisp of grey wool is caught on it.'),
      L('ione', '灰色……你是不是又去见那个灰眼睛的人了？', 'Grey... did you go see the grey-eyed one again?', 'smirk'),
    ],
    choices: [
      { text: T('"把橄榄枝供在神庙吧。"', '"Offer the sprig at the temple."'), t: { pious: 5 }, fx: { piety: 5 },
        reply: [L('ione', '格劳克斯在柱子上叫了三声。好像很满意。', 'Glaux hooted three times from a column. It seemed pleased.', 'happy')] },
      { text: T('"插在窗台的水罐里吧。"', '"Put it in the water jar on the windowsill."'), fx: { wits: 3 }, t: { cheer: 2 },
        reply: [L('ione', '它发芽了！橄榄枝真的会发芽！', 'It sprouted! The olive sprig actually sprouted!', 'surprised')] },
    ],
  },
  {
    id: 'r_pet_hound', weight: 3, months: [2, 12], once: true, scene: 'hall', cond: { pet: 'hound' },
    lines: [
      N('宴席上，小阿尔戈从安提诺俄斯的盘子里叼走了一整块烤羊腿，一溜烟跑了。', 'At the feast Little Argo snatches a whole roast leg of lamb off Antinous\'s plate and bolts.'),
      L('antinous', '谁家的野狗！我要扒了它的皮！', 'Whose mongrel is that! I\'ll skin it!'),
      L('ione', '（小声）……干得好。', '(softly) ...Good boy.', 'smirk'),
    ],
    choices: [
      { text: T('（替小狗挡住安提诺俄斯。）', '(Block Antinous from the puppy.)'), fx: { courage: 5 }, trust: 3,
        reply: [L('ione', '那块肉本来就是奥德修斯家的羊。', 'That meat came from Odysseus\'s flock anyway.', 'determined')] },
      { text: T('（让伊俄涅把小狗藏起来。）', '(Let Ione hide the puppy.)'), fx: { wits: 4 }, t: { depend: -2 },
        reply: [L('ione', '它在我床底下啃骨头。嘘——', 'It\'s gnawing the bone under my bed. Shh—', 'laugh')] },
    ],
  },
  {
    id: 'r_pet_cat', weight: 3, months: [2, 12], once: true, scene: 'loomroom', cond: { pet: 'cat' },
    lines: [
      N('王后的织机上，艾洛蜷成一团睡着了，尾巴还缠着一根紫色的纬线。', 'Ailo is curled asleep on the queen\'s loom, a purple weft thread wound round its tail.'),
      L('penelope', '（忍着笑）这下好了，今晚不用拆了。猫已经帮我拆完了。', '(holding back a laugh) Well — no need to unpick tonight. The cat has done it for me.'),
      L('ione', '王后，对不起！艾洛，快下来！', 'My queen, I\'m sorry! Ailo, get down!', 'scared'),
    ],
    choices: [
      { text: T('"让它睡吧。"', '"Let it sleep."'), t: { gentle: 4 }, fx: { stress: -5 }, trust: 2,
        reply: [L('penelope', '这只猫比求婚者可爱多了。', 'This cat is far more charming than the suitors.')] },
      { text: T('帮王后把线理好。', 'Help the queen sort out the threads.'), fx: { etiquette: 4, wits: 2 },
        reply: [L('ione', '缠成一团了……艾洛，你是故意的吧！', 'It\'s all tangled... Ailo, you did that on purpose!', 'pout')] },
    ],
  },
  {
    id: 'r_pet_dolphin', weight: 3, months: [2, 12], once: true, scene: 'harbor', cg: 'cg_r_pet_dolphin', cgIone: true, cond: { pet: 'dolphin' },
    lines: [
      N('伊俄涅坐在狄翁的小船上，船桨掉进了海里。还没等他们着急，西摩已经用鼻子把桨顶了回来，然后推着小船一路游回港口。', 'Ione is in Dion\'s little boat when an oar slips overboard. Before they can panic, Simo noses the oar back — then pushes the whole boat all the way to the harbor.'),
      L('dion', '我们……被一只海豚拖回家了。', 'We... got towed home by a dolphin.'),
      L('ione', '西摩最棒了！', 'Simo is the best!', 'laugh'),
    ],
    choices: [
      { text: T('"今晚给西摩留最好的鱼。"', '"Save the best fish for Simo tonight."'), fx: { sailing: 4 }, t: { cheer: 4 }, silver: -2,
        reply: [L('ione', '它吃完还冲我喷水！', 'It finished and then sprayed water at me!', 'laugh')] },
    ],
    note: T('古希腊的陶器和钱币上常常画着骑海豚的少年。人们相信海豚喜欢人类、喜欢音乐。',
      'Greek pottery and coins often show a boy riding a dolphin. People believed dolphins loved humans and music.'),
  },
  {
    id: 'r_pet_tortoise', weight: 3, months: [2, 12], once: true, scene: 'agora', cond: { pet: 'tortoise' },
    lines: [
      L('dion', '我跟你打赌，我闭着眼睛单脚跳到喷泉，都比你的陆龟快！', 'I bet I could hop to the fountain on one foot with my eyes shut faster than your tortoise!'),
      L('ione', '比就比！布拉迪，加油！', 'You\'re on! Brady, go!', 'determined'),
      N('狄翁跳到一半，撞上了卖鱼的摊子，被鱼贩子追着满街跑。布拉迪慢悠悠地爬到了喷泉边。', 'Halfway there Dion crashes into a fish stall and is chased down the street by the fishmonger. Brady ambles calmly to the fountain.'),
    ],
    choices: [
      { text: T('（宣布陆龟获胜。）', '(Declare the tortoise the winner.)'), t: { cheer: 5 }, fx: { stress: -6 },
        reply: [L('ione', '布拉迪赢了！狄翁请吃无花果！', 'Brady wins! Dion buys the figs!', 'laugh')] },
    ],
  },
  {
    id: 'r_pet_goat', weight: 3, months: [2, 12], once: true, scene: 'loomroom', cond: { pet: 'goat' },
    lines: [
      N('斯基尔托溜进了织房，把王后一筐上好的羊毛线嚼得乱七八糟。', 'Skirto has slipped into the weaving room and chewed a whole basket of the queen\'s best yarn to bits.'),
      L('nurse', '天哪！这是要给王子做斗篷的线！', 'Heavens! That was the yarn for the prince\'s cloak!'),
      L('ione', '斯基尔托！……对不起，奶妈，我去欧迈俄斯那里剪羊毛赔给你。', 'Skirto! ...I\'m sorry, Nurse. I\'ll go shear wool at Eumaeus\'s to make up for it.', 'tearful'),
    ],
    choices: [
      { text: T('"好，自己闯的祸自己补。"', '"Good. You fix what you break."'), fx: { farming: 5, stamina: -2 }, t: { depend: -3 },
        reply: [L('ione', '我剪了三只羊！手都磨破了……可我做到了。', 'I sheared three sheep! My hands are raw... but I did it.', 'determined')] },
      { text: T('"我替你向王后求情。"', '"I\'ll speak to the queen for you."'), trust: 3, t: { depend: 3 }, fx: { eloquence: 3 },
        reply: [L('penelope', '（笑）一只小羊而已。线没了可以再纺，孩子可别哭。', '(laughing) It\'s only a little goat. Yarn can be spun again — don\'t cry, child.')] },
    ],
  },
];
