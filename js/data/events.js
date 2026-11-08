// 主线剧情事件。month: 1-12, week: 1-4（在该周周末回应之后触发；week 0 = 开场）。同一周可以有多个事件，按数组顺序播放。
// 台词 L(说话人, 中文, 英文, 伊俄涅的表情)。说话人见 npcs.js。
// face: 伊俄涅这句台词的表情（对应 assets/img/ione_chiton_<face>.webp）  scene: 事件背景（assets/img/bg_<scene>.webp）
// cg: 插图（assets/img/<cg>.webp），显示时代替背景；cgIone: 插图里已经画了伊俄涅，不再叠加立绘
// cond: 触发条件 { flags, notFlags, minTrust, maxTrust, stats, pet }
// note: 事件之后显示的"历史小注"
// 效果 fx: 能力  t: 倾向  trust: 信赖  flag: 设置标记  promise: 许下承诺  item: 获得物品  next: 立刻接着播放另一个事件
// 文本中的 {you} 会替换成她对你的称呼，{name} 替换成玩家名字
// 所有文字都是原创改写，没有引用任何现代译本。

export { SPEAKERS } from './npcs.js';
import { SPEAKERS as SP } from './npcs.js';
import { MONSTER_EVENTS, MONSTER_SPEAKERS } from './monsters.js';
Object.assign(SP, MONSTER_SPEAKERS);

const L = (who, zh, en, face) => ({ who, text: { zh, en }, ...(face ? { face } : {}) });
const N = (zh, en) => L('narrator', zh, en);
const T = (zh, en) => ({ zh, en });

const MAIN_EVENTS = [
  // ================= 1 月 · 海岸来的女孩 =================
  {
    id: 'm1_shore', month: 1, week: 0, scene: 'shore', cg: 'cg_m1_shore', cgIone: true,
    lines: [
      N('风暴刮了三天三夜。第四天清晨，海面平得像一块磨亮的铜镜。', 'The storm blew for three days and three nights. On the fourth morning the sea lay flat as polished bronze.'),
      L('fisherman', '在那儿！礁石中间，有个孩子！还活着！', 'There! Between the rocks — a child! She\'s alive!'),
      N('她浑身是盐，攥着一枚贝壳，谁伸手扶她，她就咬谁。老渔夫的儿子狄翁手背上留下了一排牙印。', 'She was crusted with salt and clutched a shell. She bit whoever reached for her. The old fisherman\'s son, Dion, came away with a ring of tooth marks on his hand.'),
      L('dion', '嘶——好凶！……可是她在发抖。爹，我们把她送去王宫吧，王后心善。', 'Ow — she\'s fierce! ...But she\'s shaking. Father, let\'s take her to the palace. The queen is kind.'),
      N('王宫里，珀涅罗珀亲手给她披上羊毛斗篷，然后转向你。', 'In the palace, Penelope wrapped a wool cloak around her with her own hands, then turned to you.'),
      L('penelope', '{name}，你是我丈夫最信任的朋友。他出征前把这个家托付给你，现在我把这个孩子也托付给你。', '{name}, you were my husband\'s most trusted friend. He left this house in your care when he sailed. Now I leave this child in your care as well.'),
      L('ione', '……我叫伊俄涅。别的我什么都不记得。别碰我。', '...My name is Ione. I remember nothing else. Don\'t touch me.', 'angry'),
    ],
    choices: [
      { text: T('"我是门托尔。从今天起，这里也是你的家。"', '"I am Mentor. From today, this is your home too."'), trust: 4, t: { depend: 5 },
        reply: [L('ione', '家？……随便你怎么说。', 'Home? ...Say whatever you like.', 'wary')] },
      { text: T('"我是你的老师。你得守这里的规矩。"', '"I am your teacher. You will follow the rules here."'), t: { pious: 5, gentle: -3 }, fx: { etiquette: 5 },
        reply: [L('ione', '规矩？哼。', 'Rules? Hmph.', 'wary')] },
      { text: T('（什么都不说，递给她一块面包。）', '(Say nothing. Hand her a piece of bread.)'), trust: 6, t: { cheer: 3 },
        reply: [N('她一把抢过面包，背过身去狼吞虎咽。吃完，她偷偷回头看了你一眼。', 'She snatches the bread and wolfs it down with her back to you. When it is gone, she sneaks a glance at you.')] },
    ],
    note: T('荷马史诗里，伊萨卡是爱奥尼亚海上一座多山的小岛。奥德修斯离家参加特洛伊战争已经二十年：战争十年，归途又漂泊了十年。',
      'In Homer, Ithaca is a small, rugged island in the Ionian Sea. Odysseus has been gone twenty years: ten at the war of Troy, and ten more wandering on the way home.'),
  },
  {
    id: 'm1_palace', month: 1, week: 1, scene: 'room',
    lines: [
      L('nurse', '这间屋子朝海，原本是给王子小时候午睡的。床铺好了，羊毛是今年新剪的。', 'This room faces the sea. The prince used to nap here as a boy. The bed is made — this year\'s fresh wool.'),
      L('ione', '……我不睡床。床太软，会沉下去。', '...I don\'t sleep in beds. They\'re too soft. You sink.', 'wary'),
      L('melantho', '哟，捡来的小野猫还挑剔起来了？要我说，就该让她睡在灶灰里。', 'Oh, the stray kitten is picky now? If you ask me, she should sleep in the hearth ashes.'),
      L('nurse', '墨兰托！去把你的活儿干完。', 'Melantho! Go and finish your work.'),
      N('墨兰托扭身走了，裙摆扫过门槛时还冷笑了一声。她是老仆多利俄斯的女儿，在宫里长大，却跟求婚者们走得很近。', 'Melantho flounces off, with a cold laugh as her skirt sweeps the threshold. She is old Dolius\'s daughter, raised in the palace, yet thick with the suitors.'),
      L('ione', '她讨厌我。……没关系。我也不需要谁喜欢我。', 'She hates me. ...Fine. I don\'t need anyone to like me.', 'pout'),
    ],
    choices: [
      { text: T('把羊毛毯铺在窗下："那就睡在能听见海的地方。"', 'Spread the fleece under the window: "Then sleep where you can hear the sea."'), trust: 6, t: { depend: 3, cheer: 2 },
        reply: [L('ione', '……嗯。海的声音，我听得懂。', '...Mm. The sea\'s voice — I understand it.', 'calm')] },
      { text: T('"墨兰托说话难听，但你不必跟她一般见识。"', '"Melantho has a sharp tongue. You need not stoop to her level."'), t: { gentle: 3 }, fx: { etiquette: 3 },
        reply: [L('ione', '我才不会理她。', 'I won\'t even look at her.', 'pout')] },
      { text: T('"下次她再说，你就顶回去。"', '"Next time she says that, talk back."'), t: { gentle: -4, cheer: 2 }, fx: { courage: 3 },
        reply: [L('ione', '……你真奇怪。别的大人都叫我闭嘴。', '...You\'re strange. Other grown-ups tell me to shut up.', 'smirk')] },
    ],
  },
  {
    id: 'm1_mentes', month: 1, week: 2, scene: 'hall', cg: 'cg_m1_mentes', cgIone: true,
    lines: [
      N('一个陌生的客人站在宫门口，手握铜矛。求婚者们在掷骰子吃肉，谁也没理他。只有忒勒马科斯起身迎了上去。', 'A stranger stands at the palace gate, a bronze spear in hand. The suitors are throwing dice and eating; no one looks up. Only Telemachus rises to greet him.'),
      L('telemachus', '欢迎你，客人。先吃饭，吃饱了再告诉我们你需要什么。', 'Welcome, stranger. Eat first — once you have eaten, tell us what you need.'),
      L('mentes', '我叫门忒斯，塔福斯人的首领，你父亲的老朋友。孩子，你长得真像他。', 'I am Mentes, lord of the Taphians, an old friend of your father\'s. Child, you look just like him.'),
      N('客人低声跟王子说了很久。伊俄涅端着水罐站在柱子后面，一直盯着他看。', 'The guest speaks with the prince for a long time, low-voiced. Ione stands behind a pillar with a water jar, watching him the whole while.'),
      L('ione', '{you}，那个客人的眼睛是灰色的……像暴风雨前的天。', '{you}, that guest\'s eyes are grey... like the sky before a storm.', 'thinking'),
      N('客人走出大门，忽然化作一只鸟，振翅飞上了屋梁的烟孔。忒勒马科斯呆呆地站着，像是一下子长大了。', 'The guest steps out the door — and suddenly becomes a bird, beating up through the smoke-hole in the roof. Telemachus stands stunned, as if he had grown up all at once.'),
      L('ione', '你看见了吗？他、他飞走了！', 'Did you see? He — he flew away!', 'surprised'),
    ],
    choices: [
      { text: T('"那是神。神有时会借凡人的模样来看我们。"', '"That was a god. Sometimes gods borrow mortal shapes to visit us."'), t: { pious: 6 }, fx: { piety: 4 }, trust: 2,
        reply: [L('ione', '神……会来看我这样的人吗？', 'Gods... would they visit someone like me?', 'thinking')] },
      { text: T('"你看得很仔细。记住这双灰眼睛。"', '"You watch closely. Remember those grey eyes."'), fx: { wits: 5 }, trust: 3, flag: 'sawGreyEyes',
        reply: [L('ione', '我记住了。我什么都记得住——除了我自己的事。', 'I\'ll remember. I remember everything — except things about myself.', 'determined')] },
    ],
    note: T('客人之谊（xenia）是荷马世界最重要的规矩：主人先款待饮食，然后才问客人的姓名和来意。宙斯被认为是陌生人的守护神。',
      'Guest-friendship (xenia) was the most sacred custom of Homer\'s world: a host fed the stranger first, and only then asked his name and business. Zeus himself was thought to protect strangers.'),
  },
  {
    id: 'm1_phemius', month: 1, week: 4, scene: 'hall',
    lines: [
      N('夜宴上，歌者菲米乌斯拨动竖琴，唱起希腊英雄们从特洛伊归来的苦难：有的葬身大海，有的回家却死在自己的厅堂里。', 'At the night feast, the singer Phemius strikes his lyre and sings of the bitter homecomings from Troy: some heroes drowned at sea, some came home only to die in their own halls.'),
      L('penelope', '菲米乌斯，你会那么多让人高兴的歌，为什么偏偏唱这一首？每唱一次，我的心就碎一次。', 'Phemius, you know so many songs that bring joy. Why this one? Every time you sing it, my heart breaks again.'),
      L('telemachus', '母亲，歌者没有错，是宙斯决定每个人的命运。请回您的房间去吧，说话是男人的事。', 'Mother, the singer is not to blame. Zeus decides each man\'s fate. Go back to your room — speech is for men.'),
      N('珀涅罗珀惊讶地看了儿子一眼，默默上楼去了。求婚者们哄堂大笑。', 'Penelope gives her son a startled look and goes upstairs without a word. The suitors roar with laughter.'),
      L('ione', '他为什么那样跟他母亲说话？她明明在哭。', 'Why did he speak to his mother like that? She was crying.', 'angry'),
      L('phemius', '（低声）孩子，王子在学着当一家之主。可这个家里，已经很久没有主人了。', '(quietly) Child, the prince is learning to be master of the house. But this house has had no master for a very long time.'),
    ],
    choices: [
      { text: T('"去陪陪王后吧。"', '"Go and keep the queen company."'), trust: 3, t: { gentle: 5 }, fx: { etiquette: 3 },
        reply: [N('那天夜里，伊俄涅在王后门外坐了很久。第二天早上，王后的门口多了一枚贝壳。', 'That night Ione sits outside the queen\'s door for a long time. In the morning there is a shell on the queen\'s threshold.')] },
      { text: T('"你也喜欢听歌吗？明天去跟菲米乌斯学琴吧。"', '"Do you like songs too? Tomorrow, go learn the lyre from Phemius."'), fx: { song: 6 }, t: { cheer: 3 },
        reply: [L('ione', '……我只想学那首关于大海的。', '...I only want to learn the one about the sea.', 'shy')] },
    ],
    note: T('荷马时代的诗歌由歌者（aoidos）在宴会上弹琴吟唱，口耳相传。《奥德赛》里的菲米乌斯和费埃克斯人的盲歌者得摩多科斯，都被看作荷马本人的影子。',
      'In Homer\'s time poems were sung aloud at feasts by bards (aoidoi) with a lyre, passed on by ear. Phemius and the blind Phaeacian singer Demodocus are often seen as portraits of Homer himself.'),
  },

  // ================= 2 月 · 公民大会 =================
  {
    id: 'm2_bread', month: 2, week: 1, scene: 'kitchen',
    lines: [
      L('nurse', '大人！厨房又少了三块面包。我在那孩子床底下找到了一整筐，都发霉了！', 'Sir! Three more loaves missing from the kitchen. I found a whole basket under that child\'s bed, all moldy!'),
      L('melantho', '我早说了，捡来的就是捡来的。手脚不干净。', 'I told you. A stray is a stray. Light fingers.'),
      L('ione', '我没偷！……我只是拿了。', 'I didn\'t steal! ...I just took them.', 'angry'),
      L('ione', '……在海上，饿的时候什么都没有。我只是……想留着。', '...At sea, when you\'re hungry, there\'s nothing. I just... wanted to keep some.', 'sad'),
      L('nurse', '（叹气）可怜的孩子。我年轻时也被人卖过，饿肚子的滋味，我知道。', '(sighs) Poor child. I was sold as a girl myself. I know what hunger tastes like.'),
    ],
    choices: [
      { text: T('"以后饿了就来找我，这里不会让你挨饿。"', '"When you are hungry, come to me. No one starves here."'), trust: 8, t: { depend: 6, gentle: 3 },
        reply: [L('ione', '……真的？', '...Really?', 'surprised')] },
      { text: T('"偷东西是不对的，去向奶妈道歉。"', '"Stealing is wrong. Go apologize to Nurse."'), t: { pious: 4, gentle: 2 }, fx: { etiquette: 6 }, trust: -2,
        reply: [L('ione', '……对不起。（声音小得像蚊子）', '...Sorry. (barely a whisper)', 'sad')] },
      { text: T('"我们一起把发霉的倒掉，再存些不会坏的干无花果。"', '"Let\'s throw out the moldy ones together, and store dried figs instead."'), trust: 6, t: { cheer: 4, depend: -2 }, fx: { wits: 4 },
        reply: [L('ione', '干无花果……能放多久？', 'Dried figs... how long do they keep?', 'thinking')] },
    ],
    note: T('欧律克勒娅是《奥德赛》里奥德修斯的老奶妈，年轻时被拉厄尔忒斯用二十头牛的价钱买来。她把奥德修斯和忒勒马科斯都带大了。',
      'Eurycleia is Odysseus\'s old nurse in the Odyssey. Laertes bought her as a girl for the price of twenty oxen, and she raised both Odysseus and Telemachus.'),
  },
  {
    id: 'm2_dion', month: 2, week: 2, scene: 'harbor', cg: 'cg_m2_dion', cgIone: true,
    lines: [
      N('港口边，一个晒得黝黑的男孩正在补渔网。他手背上的牙印已经结了疤。', 'At the harbor, a sun-browned boy is mending a net. The tooth marks on his hand have scabbed over.'),
      L('dion', '是你！咬人的海妖！……开玩笑的。我叫狄翁，那天是我爹发现你的。', 'It\'s you! The biting sea-monster! ...Kidding. I\'m Dion. My father\'s the one who found you.'),
      L('ione', '……对不起。我不是故意咬你的。', '...Sorry. I didn\'t mean to bite you.', 'shy'),
      L('dion', '没事！渔夫的手早就被螃蟹夹惯了。给，这个也是那天在礁石上捡到的，大概是你的。', 'No harm! A fisherman\'s hands are used to crabs. Here — I found this on the rocks that day too. It must be yours.'),
      N('他摊开手掌，是一把小小的贝壳梳子，上面刻着细密的浪花纹。', 'He opens his hand: a tiny comb carved from shell, etched with fine wave patterns.'),
      L('ione', '这个……我好像见过。在很深很深的地方。', 'This... I think I\'ve seen it. Somewhere very, very deep.', 'thinking'),
    ],
    choices: [
      { text: T('"谢谢你，狄翁。以后多来宫里玩。"', '"Thank you, Dion. Come to the palace often."'), trust: 3, t: { cheer: 5 }, item: 'shell_comb', flag: 'friendDion',
        reply: [L('dion', '好啊！我还能教她游泳——虽然她大概比我游得好。', 'Sure! I can teach her to swim — though she probably swims better than me.'), L('ione', '那当然。', 'Obviously.', 'smirk')] },
      { text: T('"梳子收好。它也许能帮你找回记忆。"', '"Keep the comb safe. It may help you remember."'), fx: { wits: 4 }, t: { pious: 2 }, item: 'shell_comb', flag: 'friendDion',
        reply: [L('ione', '……嗯。我会一直带着。', '...Mm. I\'ll always carry it.', 'calm')] },
    ],
  },
  {
    id: 'm2_assembly', month: 2, week: 3, scene: 'agora', cg: 'cg_m2_assembly', cgIone: true,
    lines: [
      N('二十年来第一次，伊萨卡召开了公民大会。忒勒马科斯手握权杖站在中央。', 'For the first time in twenty years, the assembly of Ithaca is called. Telemachus stands in the center holding the speaker\'s staff.'),
      L('aegyptius', '是谁召集我们？是有军队要来，还是有什么公事要说？', 'Who has called us together? Is an army coming? Is there public business?'),
      L('telemachus', '是我。没有军队，只有我家的不幸：这些人赖在我家，杀我们的牛羊，喝我们的酒，逼我母亲改嫁！', 'I did. No army — only my family\'s ruin. These men squat in our house, slaughter our flocks, drink our wine, and press my mother to remarry!'),
      L('antinous', '该怪的是你母亲！三年来她说织完公公的寿衣就选人，白天织，夜里拆，把我们当傻子耍！', 'Blame your mother! For three years she promised to choose once she finished her father-in-law\'s shroud — weaving by day, unweaving by night, making fools of us!'),
      N('就在这时，两只鹰从山顶飞来，在会场上空盘旋厮打，用爪子抓破彼此的脸颊，向东飞去。', 'Just then two eagles swoop down from the mountain, wheel over the crowd, tear at each other\'s cheeks with their talons, and fly off eastward.'),
      L('halitherses', '这是征兆！奥德修斯离家不远了，他会给求婚者带来灾祸！', 'An omen! Odysseus is not far from home. He will bring ruin on the suitors!'),
      L('ione', '你们这些吃白饭的！喝着别人家的酒，还笑得出来！', 'You freeloaders! Drinking another man\'s wine and still laughing!', 'angry'),
      L('antinous', '哪来的野丫头？门托尔，管好你捡来的东西。', 'Where did this wild girl come from? Mentor, keep your stray on a leash.'),
    ],
    choices: [
      { text: T('站到她身前："她说的没错。"', 'Step in front of her: "She is right."'), trust: 10, t: { gentle: -4, depend: 3 }, fx: { courage: 6 },
        reply: [L('ione', '……你为什么帮我？', '...Why did you help me?', 'surprised')] },
      { text: T('拉她离开："现在不是时候。"', 'Pull her away: "Not now."'), t: { gentle: 3 }, fx: { wits: 6 }, trust: -3,
        reply: [L('ione', '胆小鬼！', 'Coward!', 'angry')] },
      { text: T('事后夸她："你比满场的大人都勇敢。"', 'Later, tell her: "You were braver than every grown man there."'), trust: 6, t: { cheer: 4, gentle: -2 }, fx: { eloquence: 4 },
        reply: [L('ione', '哼……那当然。', 'Hmph... of course I was.', 'smirk')] },
    ],
    note: T('荷马笔下的公民大会（agora）由贵族召集，发言的人要手握权杖。鸟的飞行被当作神的征兆，解读鸟兆是占卜者的本事。',
      'Homeric assemblies (agora) were called by nobles, and a speaker held a staff while he spoke. The flight of birds was read as a sign from the gods, and interpreting it was a seer\'s art.'),
  },
  {
    id: 'm2_vow', month: 2, week: 4, scene: 'shore',
    lines: [
      N('大会散了，没有人站在王子一边。黄昏时，忒勒马科斯一个人走到海边，把手浸在灰色的海水里祈祷。', 'The assembly breaks up; no one stands with the prince. At dusk Telemachus walks alone to the shore and dips his hands in the grey sea to pray.'),
      L('telemachus', '{name}……昨天那位客人说，我应该出海去打听父亲的消息。去皮洛斯找老涅斯托尔，去斯巴达找墨涅拉俄斯。可我连一条船都没有。', '{name}... yesterday\'s guest said I should sail to seek news of my father. To Pylos, to old Nestor; to Sparta, to Menelaus. But I don\'t even have a ship.'),
      L('ione', '我有船的话就借给你。……可我只有一把梳子。', 'If I had a ship I\'d lend it to you. ...But I only have a comb.', 'pout'),
      L('telemachus', '（笑了）谢谢你，小海妖。', '(laughing) Thank you, little sea-monster.'),
    ],
    choices: [
      { text: T('"船的事交给我。我去找诺埃蒙商量。"', '"Leave the ship to me. I will speak to Noemon."'), trust: 4, fx: { eloquence: 4 }, flag: 'promisedShip',
        reply: [L('telemachus', '门托尔，我父亲没看错人。', 'Mentor, my father chose his friend well.')] },
      { text: T('"再等等。春天风向转了才好出海。"', '"Wait. Sail when the winds turn in spring."'), fx: { sailing: 4, wits: 2 },
        reply: [L('ione', '风向……我闻得出来。现在的风是从北边来的，又冷又咸。', 'The wind... I can smell it. It comes from the north now, cold and salty.', 'thinking')] },
    ],
  },

  // ================= 3 月 · 织布机的秘密 =================
  {
    id: 'm3_loom', month: 3, week: 1, scene: 'loomroom', cg: 'cg_m3_loom', cgIone: true,
    lines: [
      N('深夜，王后的织房里还亮着灯。伊俄涅睡不着，循着织机的声音走了进去。', 'Late at night a lamp still burns in the queen\'s weaving room. Ione cannot sleep and follows the clack of the loom.'),
      L('penelope', '进来吧，孩子。你看，这是给我公公拉厄尔忒斯织的寿衣。等他百年之后，总得有一件体面的衣裳。', 'Come in, child. Look — this is the shroud I weave for my father-in-law, Laertes. When his day comes, he must have a fitting garment.'),
      N('说着，王后拿起小刀，一根一根挑断了白天织好的线。', 'As she speaks, the queen takes a small knife and cuts, thread by thread, everything she wove that day.'),
      L('ione', '您……在拆？', 'You\'re... unpicking it?', 'surprised'),
      L('penelope', '我说过，寿衣织完那天，就从求婚者里选一个。所以它永远也织不完。', 'I swore that on the day the shroud is finished I would choose a suitor. So it must never be finished.'),
      L('penelope', '这是我们俩的秘密。你愿意帮我吗？', 'This is our secret now. Will you help me?'),
      L('ione', '……我会守口如瓶。我最会守秘密了，因为我自己什么都不记得。', '...I\'ll keep my mouth shut. I\'m good at secrets — I don\'t even remember my own.', 'determined'),
    ],
    choices: [
      { text: T('在门外替她们望风。', 'Keep watch outside the door for them.'), trust: 5, t: { depend: 3 }, fx: { wits: 3 },
        reply: [N('那一夜，你听见门里传来轻轻的笑声。很久没有人在这座宫殿里这样笑了。', 'That night you hear soft laughter behind the door. No one has laughed like that in this palace for a long time.')] },
      { text: T('"跟王后学织布吧，手巧的人心也静。"', '"Learn weaving from the queen. Busy hands calm the heart."'), fx: { etiquette: 5, wits: 2 }, t: { gentle: 4 },
        reply: [L('ione', '我织的回纹歪了……但王后说，歪的也好看。', 'My key pattern came out crooked... but the queen says crooked is pretty too.', 'shy')] },
    ],
    note: T('织寿衣的计策是珀涅罗珀最著名的智慧：她用"为公公织寿衣"为由拖延了三年多。在荷马时代，织布是贵族女子的主要工作，也是财富和体面的象征。',
      'The shroud trick is Penelope\'s most famous ruse: she put off the suitors for over three years with it. In Homer\'s world weaving was the chief work of noblewomen and a mark of wealth and dignity.'),
  },
  {
    id: 'm3_shroud', month: 3, week: 2, scene: 'loomroom',
    lines: [
      N('一天深夜，伊俄涅看见墨兰托提着灯，悄悄趴在织房的门缝上。', 'One night Ione sees Melantho with a lamp, crouched at the crack of the weaving-room door.'),
      L('melantho', '（低声）原来是这样……安提诺俄斯大人一定会重重赏我。', '(whispering) So that\'s it... Lord Antinous will reward me well for this.'),
      L('ione', '{you}，墨兰托要去告密！我们怎么办？', '{you}, Melantho is going to tell! What do we do?', 'scared'),
    ],
    choices: [
      { text: T('"去告诉王后，让她早做准备。"', '"Warn the queen so she can prepare."'), trust: 5, t: { gentle: 3 }, fx: { wits: 5, etiquette: 3 }, flag: 'warnedQueen',
        reply: [L('penelope', '好孩子。纺锤拖不了多久了，但我还能想别的办法。', 'Good child. The spindle cannot buy much more time, but I will find another way.')] },
      { text: T('"你去拦住她，用你的嘴说服她。"', '"Stop her. Talk her out of it."'), trust: 4, t: { depend: -4 }, fx: { eloquence: 8 },
        reply: [L('ione', '我……我试试。', 'I... I\'ll try.', 'shy'), L('melantho', '你算什么东西，也配跟我讲道理？……哼，今天就算了。', 'And who are you to lecture me? ...Hmph. Fine, not today.')] },
      { text: T('"让她去。王后早晚瞒不住，不如看看求婚者会怎么做。"', '"Let her go. The queen cannot hide it forever. Let us see what the suitors do."'), fx: { wits: 6 }, t: { gentle: -3, depend: -2 },
        reply: [L('ione', '……你好冷静。我有点怕你。', '...You\'re so calm. You scare me a little.', 'wary')] },
    ],
    note: T('在《奥德赛》里，正是一个不忠的侍女把织寿衣的秘密泄露给了求婚者，迫使珀涅罗珀把寿衣织完。',
      'In the Odyssey it was a disloyal maid who betrayed the secret of the shroud to the suitors, forcing Penelope to finish it.'),
  },
  {
    id: 'm3_eumaeus', month: 3, week: 3, scene: 'eumaeus_hut', cg: 'cg_m3_eumaeus', cgIone: true,
    lines: [
      N('你带伊俄涅去山上找牧猪人欧迈俄斯。他的院子用石头垒成，四周插着梨木栅栏，四条大狗冲出来狂吠。', 'You take Ione up the hill to Eumaeus the swineherd. His yard is walled with stone and fenced with wild-pear stakes. Four great dogs rush out barking.'),
      L('eumaeus', '回去！回去！……哎呀，是门托尔大人。这位小姑娘是？', 'Back! Back! ...Oh, it\'s Lord Mentor. And who is this little one?'),
      L('ione', '……我叫伊俄涅。你的狗不咬我，它们闻得出我是海里来的。', '...I\'m Ione. Your dogs won\'t bite me. They can smell I came from the sea.', 'smirk'),
      L('eumaeus', '海里来的？那我们是同路人。我小时候也是坐船来的——我本是叙里亚岛的王子，被腓尼基商人拐走，卖给了拉厄尔忒斯老爷。', 'From the sea? Then we\'re fellow travelers. I came by ship too as a boy — I was a prince of the isle of Syrie, stolen by Phoenician traders and sold to old Laertes.'),
      L('ione', '王子……变成了牧猪人？', 'A prince... became a swineherd?', 'surprised'),
      L('eumaeus', '人的命运就像海浪，谁也说不准把你推到哪里。但主人待我好，我就对主人忠心。', 'Fate is like the waves — no one knows where it will toss you. But my master was good to me, and so I\'m loyal to him.'),
    ],
    choices: [
      { text: T('"你想家吗，欧迈俄斯？"', '"Do you miss home, Eumaeus?"'), t: { gentle: 4 }, trust: 2, fx: { eloquence: 3 },
        reply: [L('eumaeus', '早就不记得长什么样了。这里就是我的家。', 'I\'ve long forgotten what it looked like. This is my home.'), L('ione', '……我也会忘记吗？还是我已经忘了？', '...Will I forget too? Or have I already?', 'sad')] },
      { text: T('留下来帮他赶猪。', 'Stay and help him herd the pigs.'), fx: { farming: 6, stamina: 2 }, t: { cheer: 3 },
        reply: [L('ione', '这头小猪撞我！……哈哈哈，它在泥里打滚！', 'This piglet rammed me! ...Hahaha, it\'s rolling in the mud!', 'laugh')] },
    ],
    note: T('欧迈俄斯是《奥德赛》中最忠诚的仆人。荷马时代，海盗和腓尼基商人常常掳人贩卖，贵族的孩子也可能沦为奴仆。',
      'Eumaeus is the most loyal servant in the Odyssey. In Homer\'s age pirates and Phoenician traders often kidnapped and sold people; even a noble child could end up a slave.'),
  },
  {
    id: 'm3_promise', month: 3, week: 4, scene: 'room',
    lines: [
      L('ione', '{you}……下个月是阿波罗的春祭。', '{you}... next month is Apollo\'s spring festival.', 'shy'),
      L('ione', '狄翁说港口会点火把，有人跳舞，还有烤章鱼……', 'Dion says there\'ll be torches at the harbor, and dancing, and grilled octopus...', 'happy'),
      L('ione', '你、你陪我去吗？', 'Will... will you go with me?', 'shy'),
    ],
    choices: [
      { text: T('"一言为定，我一定陪你去。"', '"It\'s a promise. I will take you."'), trust: 6, promise: 'festival',
        reply: [L('ione', '说好了！不许反悔！', 'Promise! No taking it back!', 'happy')] },
      { text: T('"到时候再看吧。"', '"We\'ll see."'), trust: -3, t: { depend: -3 },
        reply: [L('ione', '……哦。随便。', '...Oh. Whatever.', 'wary')] },
    ],
  },

  // ================= 4 月 · 春祭与出海的准备 =================
  {
    id: 'm4_noemon', month: 4, week: 1, scene: 'harbor',
    lines: [
      N('船主诺埃蒙在码头上修他的黑船。船身新涂了松脂，二十支桨整整齐齐地靠在船舷上。', 'Noemon the shipowner is fitting out his black ship at the docks. The hull is freshly pitched, and twenty oars lean neatly against the rail.'),
      L('noemon', '门托尔大人，您是来借船的吧？王子的事，岛上谁不知道。', 'Lord Mentor, you\'ve come about a ship, haven\'t you? The whole island knows the prince\'s trouble.'),
      L('noemon', '船可以借，可要是让安提诺俄斯知道是我借的……', 'I\'ll lend it. But if Antinous ever learns it was mine...'),
      L('ione', '我不会说。狄翁也不会说。我们可以晚上帮你把水和面粉搬上船。', 'I won\'t tell. Neither will Dion. We can carry the water and flour aboard at night.', 'determined'),
      L('dion', '她搬得比我还多！上次她一个人扛了一整袋大麦。', 'She carries more than I do! Last time she hauled a whole sack of barley by herself.'),
    ],
    choices: [
      { text: T('"诺埃蒙，你的义气，奥德修斯回来会记得的。"', '"Noemon, Odysseus will remember your loyalty when he returns."'), fx: { eloquence: 5 }, flag: 'shipReady', trust: 2,
        reply: [L('noemon', '但愿他还能回来。……好，船归你们用。', 'If he ever returns. ...All right. The ship is yours.')] },
      { text: T('让伊俄涅和狄翁去搬货。', 'Let Ione and Dion load the cargo.'), fx: { stamina: 4, sailing: 4 }, flag: 'shipReady', t: { depend: -3, cheer: 2 },
        reply: [L('ione', '船的味道……松脂、绳子、咸水。我喜欢。', 'The smell of a ship... pitch, rope, salt water. I like it.', 'happy')] },
    ],
  },
  {
    id: 'm4_festival', month: 4, week: 2, scene: 'harbor', cg: 'cg_m4_festival', cgIone: true,
    lines: [
      N('阿波罗春祭的夜晚，港口亮起一串火把。少女们戴着花环跳舞，渔夫们烤着章鱼。', 'On the night of Apollo\'s spring festival a string of torches lights the harbor. Girls in garlands dance; fishermen grill octopus.'),
      N('就在这时，珀涅罗珀派传令官墨冬来请你：求婚者们喝醉了，在大厅里逼她当众选人。', 'Just then Penelope sends Medon the herald for you: the suitors are drunk and demanding she choose a husband in front of everyone.'),
      L('medon', '门托尔大人，王后说只有您能镇住他们。', 'Lord Mentor, the queen says only you can hold them back.'),
      L('ione', '{you}……你答应过我的。', '{you}... you promised me.', 'sad'),
    ],
    choices: [
      { text: T('守住承诺，陪她去港口。', 'Keep your promise and go to the harbor with her.'), keep: 'festival', trust: 10, t: { cheer: 5, depend: 4 },
        reply: [L('ione', '你真的来了！……你看，火把落在海里，像星星一样。', 'You really came! ...Look, the torches in the water look like stars.', 'happy'), L('dion', '伊俄涅，来跳舞！门托尔大人也来！', 'Ione, come dance! You too, Lord Mentor!')] },
      { text: T('去王宫帮王后解围。', 'Go to the palace to help the queen.'), breakPromise: 'festival', fx: { eloquence: 6, etiquette: 4 }, t: { depend: -5 },
        reply: [L('ione', '……我就知道。大人都是这样。', '...I knew it. Grown-ups are all the same.', 'tearful')] },
      { text: T('"我们一起去王宫，帮完王后再去港口。"', '"Come with me to the palace — then we go to the harbor together."'), trust: 3, fx: { courage: 4, wits: 4 }, t: { gentle: 3 },
        reply: [L('ione', '……好吧。不过你欠我一次。', '...Fine. But you owe me one.', 'smirk')] },
    ],
    note: T('阿波罗是光明、音乐和射箭之神。古希腊各地在新月或特定的日子为他举行节庆，人们献祭、歌舞、举行竞赛。',
      'Apollo was the god of light, music and archery. Greek communities held festivals for him at the new moon or on set days, with sacrifices, songs, dances and contests.'),
  },
  {
    id: 'm4_scarstory', month: 4, week: 3, scene: 'kitchen',
    lines: [
      N('奶妈一边揉面，一边给伊俄涅讲奥德修斯小时候的事。', 'Nurse kneads dough and tells Ione stories about Odysseus as a boy.'),
      L('nurse', '他的名字是外公奥托吕科斯起的。少年时他去帕尔纳索斯山看外公，跟舅舅们去猎野猪。', 'His grandfather Autolycus named him. As a youth he went to visit his grandfather on Mount Parnassus and went boar-hunting with his uncles.'),
      L('nurse', '一头大野猪从林子里冲出来，獠牙划开了他膝盖上面的肉。他也一矛刺穿了野猪。那道疤，我闭着眼睛都摸得出来。', 'A huge boar burst from the thicket and its tusk ripped the flesh above his knee. He speared it straight through. That scar — I could find it with my eyes shut.'),
      L('ione', '一道疤……就能认出一个人吗？', 'A scar... is enough to know a man by?', 'thinking'),
      L('nurse', '亲手带大的孩子，身上哪里有疤，奶妈都记得。', 'A nurse remembers every scar on a child she raised with her own hands.'),
    ],
    choices: [
      { text: T('"把这个故事记住，伊俄涅。"', '"Remember this story, Ione."'), fx: { wits: 5 }, flag: 'heardScar',
        reply: [L('ione', '记住了。膝盖上面，野猪的獠牙。', 'Got it. Above the knee. A boar\'s tusk.', 'determined')] },
      { text: T('帮奶妈揉面，做蜂蜜饼。', 'Help Nurse knead dough for honey cakes.'), fx: { stamina: 2, etiquette: 3 }, t: { gentle: 3, depend: 2 }, flag: 'heardScar',
        reply: [L('ione', '面粘了我一脸……不许笑！', 'I got dough all over my face... don\'t laugh!', 'pout')] },
    ],
    note: T('在《奥德赛》第十九卷，老奶妈正是凭这道野猪留下的伤疤认出了乔装的奥德修斯。荷马在这里插叙了整个打猎的故事。',
      'In Book 19 of the Odyssey, the old nurse recognizes the disguised Odysseus by exactly this boar scar, and Homer pauses to tell the whole hunting story.'),
  },
  {
    id: 'm4_eve', month: 4, week: 4, scene: 'kitchen',
    lines: [
      N('出发前一夜，奶妈把大麦粉装进二十只皮袋，又灌满了十二罐最好的酒。', 'On the night before sailing, Nurse fills twenty leather sacks with barley meal and twelve jars with the best wine.'),
      L('nurse', '王子啊，你为什么要去冒险？你父亲已经死在远方了，难道你也要让求婚者在路上害死你吗？', 'Oh my prince, why go into danger? Your father has died far away — must you let the suitors murder you on the road too?'),
      L('telemachus', '别怕，奶妈。这是神的意思。你发誓，十二天之内不要告诉我母亲。', 'Don\'t be afraid, Nurse. This is the gods\' will. Swear you\'ll not tell my mother for twelve days.'),
      L('ione', '……我能感觉到，海在等他。也在等我。', '...I can feel it. The sea is waiting for him. And for me.', 'thinking'),
    ],
    choices: [
      { text: T('"你想跟他一起去，对不对？"', '"You want to go with him, don\'t you?"'), trust: 3, t: { depend: -2 },
        reply: [L('ione', '……你怎么知道。', '...How did you know.', 'shy')] },
      { text: T('"你留下来，宫里需要你。"', '"Stay. The palace needs you."'), t: { depend: 3 }, fx: { etiquette: 2 },
        reply: [L('ione', '……宫里需要我？真的？', '...The palace needs me? Really?', 'surprised')] },
    ],
  },

  // ================= 5 月 · 出海（两条路线） =================
  {
    id: 'm5_voyage', month: 5, week: 1, scene: 'harbor', cg: 'cg_m5_voyage', cgIone: true,
    lines: [
      N('天黑以后，黑船悄悄离岸。雅典娜送来一阵西风，船帆鼓得满满的。', 'After dark the black ship slips from shore. Athena sends a west wind, and the sail swells full.'),
      L('telemachus', '伊俄涅，你在船上比水手还灵活——要不要一起来？', 'Ione, you move on deck better than any sailor — will you come?'),
      L('ione', '{you}，我可以去吗？', '{you}, may I go?', 'shy'),
    ],
    choices: [
      { text: T('"去吧。我相信你。"', '"Go. I trust you."'), trust: 6, t: { depend: -8 }, fx: { sailing: 15, courage: 8 }, flag: 'voyaged',
        reply: [L('ione', '我会带着故事回来的！', 'I\'ll come back with stories!', 'happy')] },
      { text: T('"太危险了，留在伊萨卡。"', '"Too dangerous. Stay in Ithaca."'), t: { depend: 5 }, fx: { etiquette: 5 }, trust: -2,
        reply: [L('ione', '……我又不是小孩子。', '...I\'m not a little kid.', 'pout')] },
    ],
    note: T('古希腊人通常只在春夏两季航海，冬天的海太危险。他们的船靠划桨和一面方帆前进，晚上多半靠岸过夜。',
      'Greeks normally sailed only in spring and summer; the winter sea was too dangerous. Their ships were driven by oars and a single square sail, and usually beached for the night.'),
  },
  // —— 跟船出海 ——
  {
    id: 'm5_ship', month: 5, week: 2, scene: 'ship', cg: 'cg_m5_ship', cgIone: true, cond: { flags: ['voyaged'] },
    lines: [
      N('黑船在夜色里破浪前行。船尾坐着一个人，披着你的斗篷，长着你的脸。', 'The black ship cuts through the night waves. At the stern sits someone wearing your cloak — and your face.'),
      L('mentor2', '伊俄涅，别站在船舷上，浪会把你卷走的。', 'Ione, get down from the rail. The waves will take you.'),
      L('ione', '{you}？……不对。你说过你要留在伊萨卡。我亲眼看见你站在码头上挥手的。', '{you}? ...No. You said you\'d stay in Ithaca. I saw you waving from the dock with my own eyes.', 'scared'),
      L('mentor2', '（微笑）你的眼睛很尖。那就替我保守这个秘密吧，海的女儿。', '(smiling) Sharp eyes. Then keep this secret for me, daughter of the sea.'),
      N('那人的眼睛在月光下闪了一下——是灰色的。', 'In the moonlight the figure\'s eyes flash — grey.'),
      L('ione', '……灰眼睛。又是你。', '...Grey eyes. You again.', 'thinking'),
    ],
    choices: [
      { text: T('（她决定）不告诉任何人。', '(She decides) To tell no one.'), t: { pious: 6 }, fx: { wits: 4 }, flag: 'athenaSecret',
        reply: [L('ione', '好。我守住。……可你要告诉我，我是谁。', 'All right. I\'ll keep it. ...But you have to tell me who I am.', 'determined'), L('mentor2', '等到时候到了，大海会亲口告诉你。', 'When the time comes, the sea will tell you itself.')] },
      { text: T('（她决定）偷偷告诉忒勒马科斯。', '(She decides) To quietly tell Telemachus.'), t: { depend: 2, pious: -3 }, fx: { eloquence: 3 },
        reply: [L('telemachus', '那是女神……我早该猜到。伊俄涅，我们有神在身边。', 'That is the goddess... I should have guessed. Ione, a god sails with us.')] },
    ],
    note: T('在《奥德赛》里，雅典娜化身成门托尔的模样，陪忒勒马科斯航行到皮洛斯。英语里"mentor（导师）"一词就来自这个名字。',
      'In the Odyssey, Athena takes the shape of Mentor and sails with Telemachus to Pylos. The English word "mentor" comes from this name.'),
  },
  {
    id: 'm5_pylos', month: 5, week: 3, scene: 'pylos', cg: 'cg_m5_pylos', cgIone: true, cond: { flags: ['voyaged'] },
    lines: [
      N('黎明时，船靠上皮洛斯的沙滩。岸上黑压压站满了人，九队人马，每队前面摆着九头黑牛，正在向海神波塞冬献祭。', 'At dawn the ship beaches at Pylos. The shore is crowded with people — nine companies, each with nine black bulls before it, sacrificing to Poseidon.'),
      L('nestor', '欢迎，客人们！先和我们一起祭神吧，然后再告诉我你们是谁。', 'Welcome, strangers! Pour a libation with us to the god first, then tell me who you are.'),
      L('ione', '波塞冬……他们在给海神献祭。我的心跳得好快。', 'Poseidon... they\'re sacrificing to the sea god. My heart is pounding.', 'scared'),
      L('nestor', '你是奥德修斯的儿子？天哪，你说话跟他一模一样！我们在特洛伊并肩作战，可归途上就分开了。我不知道他的下落。去斯巴达吧，墨涅拉俄斯回来得最晚，也许知道些什么。', 'You are Odysseus\'s son? By the gods, you speak just like him! We fought side by side at Troy, but parted on the way home. I don\'t know where he is. Go to Sparta — Menelaus came home last of all; he may know something.'),
      L('peisistratus', '我是涅斯托尔的小儿子佩西斯特拉托斯。我驾车送你们去斯巴达！', 'I\'m Nestor\'s youngest, Peisistratus. I\'ll drive you to Sparta in my chariot!'),
    ],
    choices: [
      { text: T('（伊俄涅）也把一杯酒倒进海里。', '(Ione) Pours a cup of wine into the sea too.'), t: { pious: 6 }, fx: { piety: 6 },
        reply: [L('ione', '海……请别生我的气。', 'Sea... please don\'t be angry with me.', 'tearful')] },
      { text: T('（伊俄涅）躲到船后面不敢看。', '(Ione) Hides behind the ship, not daring to look.'), t: { pious: -4 }, fx: { stress: 5 },
        reply: [L('ione', '我不喜欢那么多血……海也不喜欢。', 'I don\'t like all that blood... the sea doesn\'t either.', 'sad')] },
    ],
    note: T('皮洛斯的涅斯托尔是特洛伊战争中年纪最大、最有智慧的希腊国王。考古学家在皮洛斯发现了一座迈锡尼时代的宫殿，被称为"涅斯托尔宫"。',
      'Nestor of Pylos was the oldest and wisest Greek king at Troy. Archaeologists found a Mycenaean palace at Pylos, now called the "Palace of Nestor".'),
  },
  {
    id: 'm5_sparta', month: 5, week: 4, scene: 'sparta', cg: 'cg_m5_sparta', cgIone: true, cond: { flags: ['voyaged'] },
    lines: [
      N('斯巴达的宫殿闪着青铜、黄金和象牙的光。王后海伦从香气缭绕的内室走出来，侍女捧着银质的纺线篮。', 'Sparta\'s palace gleams with bronze, gold and ivory. Queen Helen comes from her fragrant chamber, a maid carrying her silver wool-basket.'),
      L('helen', '这孩子长得多像奥德修斯！……还有这个小姑娘，你的眼睛像海一样，你是从哪里来的？', 'How like Odysseus this boy is! ...And you, little one — your eyes are like the sea. Where are you from?'),
      L('ione', '我……不知道。海把我送来的。', 'I... don\'t know. The sea brought me.', 'shy'),
      L('menelaus', '我在埃及的法罗斯岛抓住了海中老人普罗透斯。他变成狮子、蛇、豹子、野猪，我死死不放，他才说出真话：奥德修斯被仙女卡吕普索困在一座小岛上，没有船，没有同伴。', 'On the isle of Pharos off Egypt I seized Proteus, the Old Man of the Sea. He became a lion, a serpent, a leopard, a boar — I held on, and at last he told the truth: Odysseus is held by the nymph Calypso on an island, with no ship and no companions.'),
      L('telemachus', '他还活着！伊俄涅，我父亲还活着！', 'He\'s alive! Ione, my father is alive!'),
      L('helen', '孩子，这枚别针送给你。等你找到自己的家，别忘了斯巴达的海伦。', 'Child, take this brooch. When you find your home, remember Helen of Sparta.'),
    ],
    choices: [
      { text: T('（伊俄涅）"海中老人……他也认识我吗？"', '(Ione) "The Old Man of the Sea... does he know me too?"'), item: 'helen_brooch', fx: { wits: 5 }, flag: 'heardProteus',
        reply: [L('helen', '也许吧。大海的孩子，大海都记得。', 'Perhaps. The sea remembers all its children.'), L('ione', '……', '...', 'thinking')] },
      { text: T('（伊俄涅）向王后行礼道谢。', '(Ione) Curtsies and thanks the queen.'), item: 'helen_brooch', fx: { etiquette: 8 }, t: { gentle: 3 },
        reply: [L('ione', '谢谢您，王后。我会一直戴着。', 'Thank you, my queen. I\'ll always wear it.', 'happy')] },
    ],
    note: T('海伦就是引发特洛伊战争的那位海伦。在《奥德赛》里她已和墨涅拉俄斯回到斯巴达，过着平静的日子，还在酒里调入一种能让人忘记忧愁的埃及草药。',
      'This is the same Helen whose flight started the Trojan War. In the Odyssey she is home again with Menelaus in Sparta, living quietly, and mixes an Egyptian herb into the wine that makes people forget their sorrows.'),
  },
  // —— 留在伊萨卡 ——
  {
    id: 'm5_home', month: 5, week: 2, scene: 'hall', cond: { notFlags: ['voyaged'] },
    lines: [
      N('王子出海三天后，求婚者们才发现。诺埃蒙跑来问安提诺俄斯：他想借回自己的船去埃利斯牵马。', 'Three days after the prince sailed, the suitors noticed. Noemon came asking Antinous when he could have his ship back — he needed it to fetch horses from Elis.'),
      L('antinous', '什么？那小子真的走了？……给我一条快船和二十个人。我要在萨墨岛和伊萨卡之间的海峡里等他回来。', 'What? The boy actually left? ...Give me a fast ship and twenty men. I\'ll lie in wait in the strait between Samos and Ithaca for his return.'),
      N('伊俄涅蹲在柱子后面，把每个字都听进了耳朵里。传令官墨冬也在。', 'Ione crouches behind a pillar and hears every word. So does Medon the herald.'),
      L('ione', '{you}，他们要杀王子！', '{you}, they\'re going to kill the prince!', 'scared'),
      L('medon', '小姑娘，别出声。我们得先告诉王后。', 'Hush, child. We must tell the queen first.'),
    ],
    choices: [
      { text: T('"冷静，伊俄涅。记住他们说的每一个地名。"', '"Calm, Ione. Remember every place they named."'), fx: { wits: 6 }, t: { depend: -2 },
        reply: [L('ione', '萨墨岛。海峡。还有一个小岛，叫阿斯特里斯，有两个港口。', 'Samos. The strait. And a small island called Asteris, with two harbors.', 'determined')] },
      { text: T('抱住发抖的她。', 'Hold her as she trembles.'), trust: 6, t: { depend: 4 },
        reply: [L('ione', '……我不怕。我只是……冷。', '...I\'m not scared. I\'m just... cold.', 'tearful')] },
    ],
  },
  {
    id: 'm5_penelope', month: 5, week: 3, scene: 'loomroom', cond: { notFlags: ['voyaged'] },
    lines: [
      L('medon', '王后，王子去皮洛斯打听父亲的消息了。求婚者要在他回来的路上埋伏他。', 'My queen, the prince has gone to Pylos for news of his father. The suitors mean to ambush him on his way home.'),
      N('珀涅罗珀瘫坐在门槛上，侍女们围着她哭成一片。', 'Penelope sinks onto the threshold, and her maids gather round her weeping.'),
      L('penelope', '我的丈夫丢了，现在连儿子也要丢了吗？', 'I have lost my husband — must I lose my son as well?'),
      L('ione', '王后……王子很聪明，船也很快。还有，我觉得有神在保佑他。', 'My queen... the prince is clever, and the ship is fast. And — I think a god is watching over him.', 'determined'),
      N('那天夜里，王后梦见了她的姐姐伊芙提墨。梦中人说："别哭了，雅典娜陪着他。"醒来后，她的心安定了许多。', 'That night the queen dreamed of her sister Iphthime, who said: "Weep no more. Athena goes with him." She woke with her heart much eased.'),
    ],
    choices: [
      { text: T('陪王后一起向雅典娜祈祷。', 'Pray to Athena with the queen.'), t: { pious: 6, gentle: 3 }, fx: { piety: 6 },
        reply: [L('penelope', '谢谢你，孩子。你在这里，我就不那么孤单了。', 'Thank you, child. With you here, I am less alone.')] },
      { text: T('"我们不能只等神。得想办法通知王子。"', '"We cannot only wait for the gods. We must find a way to warn him."'), fx: { wits: 6 }, t: { pious: -3, depend: -3 }, flag: 'planWarn',
        reply: [L('ione', '狄翁有船。我会划桨。', 'Dion has a boat. I can row.', 'determined')] },
    ],
    note: T('荷马的神常常通过梦给凡人送信。珀涅罗珀后来说，梦有两扇门：象牙门出来的梦是骗人的，牛角门出来的梦才会成真。',
      'Homer\'s gods often send messages in dreams. Penelope later says dreams come through two gates: those from the gate of ivory deceive, those from the gate of horn come true.'),
  },
  {
    id: 'm5_prayer', month: 5, week: 4, scene: 'temple', cond: { notFlags: ['voyaged'] },
    lines: [
      N('伊俄涅第一次一个人爬上雅典娜神庙的山坡。她把一小把大麦撒在祭坛上。', 'For the first time Ione climbs alone to Athena\'s hilltop temple. She scatters a handful of barley on the altar.'),
      L('ione', '灰眼睛的……女神。我不知道该怎么祈祷。王子是好人，请让他平安回来。', 'Grey-eyed... goddess. I don\'t know how to pray. The prince is good. Please bring him home safe.', 'shy'),
      N('一只猫头鹰落在柱头上，歪着头看她。', 'An owl lands on a column top and tilts its head at her.'),
      L('ione', '……你在听吗？', '...Are you listening?', 'surprised'),
    ],
    choices: [
      { text: T('（远远看着，不去打扰她。）', '(Watch from afar; do not disturb her.)'), trust: 3, t: { pious: 5 }, fx: { piety: 5 },
        reply: [L('ione', '{you}，你一直在后面？……哼，偷看。', '{you}, you were back there all along? ...Hmph. Spying.', 'pout')] },
      { text: T('走上前，教她倒酒祭奠的规矩。', 'Step up and teach her the proper libation.'), fx: { piety: 4, etiquette: 4 }, t: { pious: 3 },
        reply: [L('ione', '先洗手，再倒一点点在地上……给神的那一口要最先倒。记住了。', 'Wash hands first, then pour a little on the ground... the gods\' share goes first. Got it.', 'thinking')] },
    ],
    note: T('祭奠（libation）是把酒、油或奶倒在地上或祭坛上献给神。荷马的人物吃饭、出发、立誓之前都要祭奠。',
      'A libation was wine, oil or milk poured on the ground or an altar for the gods. Homer\'s characters pour one before meals, journeys and oaths.'),
  },

  // ================= 6 月 · 伏击与归来 =================
  {
    id: 'm8_ambush', month: 6, week: 1, scene: 'harbor', cg: 'cg_m8_ambush', cgIone: true, cond: { notFlags: ['voyaged'] },
    lines: [
      N('伊俄涅和狄翁在码头偷听到：求婚者的船已经藏在阿斯特里斯岛后面，就等王子的船经过。', 'At the docks Ione and Dion overhear it: the suitors\' ship is already hidden behind the isle of Asteris, waiting for the prince to pass.'),
      L('dion', '我爹的小船能出海，可是怎么出港又不被他们发现？', 'My father\'s boat can make the trip — but how do we get out of the harbor unseen?'),
      L('ione', '我们得赶在他们前面报信！', 'We have to warn him before they find him!', 'determined'),
    ],
    check: { stats: ['wits', 'sailing'], need: 95 },
    choices: [
      { text: T('让她想办法。', 'Let her come up with a plan.'), t: { depend: -4 }, flag: 'savedTelemachus',
        success: [L('ione', '扮成夜里捕鱼的渔船，点着火把，走礁石那条小水道！他们的大船进不去！', 'We go as a night-fishing boat with torches, through the channel in the reef! Their big ship can\'t follow!', 'smirk'), L('telemachus', '伊俄涅，我欠你一条命。', 'Ione, I owe you my life.')],
        fail: [N('小船被发现了，好在欧迈俄斯及时赶来，大家都平安。王子绕道回了家，但她很沮丧。', 'The little boat is spotted, but Eumaeus arrives in time and all are safe. The prince gets home by another way, but she is crushed.')] },
      { text: T('你亲自去，让她留下。', 'Go yourself and leave her behind.'), t: { depend: 4 }, trust: -2, fx: { stress: 10 },
        reply: [L('ione', '为什么不让我去！', 'Why won\'t you let me go!', 'angry')] },
    ],
    note: T('在《奥德赛》里，求婚者确实在阿斯特里斯小岛设伏，雅典娜提醒忒勒马科斯夜里航行、绕开小岛，让他平安回到了伊萨卡。',
      'In the Odyssey the suitors really do lie in wait at the islet of Asteris, and Athena warns Telemachus to sail by night and avoid the islands, bringing him safely home.'),
  },
  {
    id: 'm8_ambush_ship', month: 6, week: 1, scene: 'ship', cg: 'cg_m8_ambush_ship', cgIone: true, cond: { flags: ['voyaged'] },
    lines: [
      N('回航的路上，"门托尔"在船尾忽然站了起来。', 'On the way home, "Mentor" suddenly stands up at the stern.'),
      L('mentor2', '求婚者的船藏在阿斯特里斯岛后面。别从海峡走。', 'The suitors\' ship is hiding behind Asteris. Do not take the strait.'),
      L('telemachus', '可是夜里绕远路，礁石那么多……', 'But going the long way at night, with all those reefs...'),
      L('ione', '我来看水。浪打在礁石上的声音不一样，我听得出来。', 'I\'ll read the water. Waves sound different over a reef. I can hear it.', 'determined'),
    ],
    check: { stats: ['wits', 'sailing'], need: 95 },
    choices: [
      { text: T('（伊俄涅）趴在船头指路。', '(Ione) Lies at the prow and guides them.'), t: { depend: -4 }, flag: 'savedTelemachus',
        success: [N('整整一夜，她闭着眼睛听浪，一次也没有错。天亮时，伊萨卡的山出现在船头。', 'All night she listens to the waves with her eyes closed, and never once errs. At dawn the hills of Ithaca rise over the prow.'), L('telemachus', '伊俄涅，我欠你一条命。', 'Ione, I owe you my life.')],
        fail: [N('船擦过一块暗礁，船底漏了水，大家拼命舀水才靠了岸。王子平安，但她自责了很久。', 'The hull scrapes a hidden rock and takes on water; they bail desperately all the way to shore. The prince is safe, but she blames herself for a long time.')] },
      { text: T('（伊俄涅）听"门托尔"的安排。', '(Ione) Does as "Mentor" says.'), t: { pious: 4, depend: 2 },
        reply: [L('ione', '……好。我相信灰眼睛。', '...All right. I trust the grey eyes.', 'calm')] },
    ],
  },
  {
    id: 'm6_return', month: 6, week: 2, scene: 'eumaeus_hut',
    lines: [
      N('忒勒马科斯没有直接回王宫，而是先去了欧迈俄斯的小屋。同船来的还有一个陌生人——预言者忒奥克吕墨诺斯，他因为杀了人在逃亡，王子收留了他。', 'Telemachus does not go straight to the palace. He goes first to Eumaeus\'s hut. With him is a stranger from the ship — Theoclymenus the seer, a fugitive for a killing, whom the prince took in.'),
      L('theoclymenus', '王子，你看天上！一只鹰抓着一只鸽子，在你右边拔它的羽毛。这是神的征兆：在伊萨卡，再没有哪一家比你家更有王者之气。', 'Prince, look! A hawk on your right, tearing the feathers from a dove. A sign from the gods: no house in Ithaca is more kingly than yours.'),
      L('ione', '又是鸟……这座岛上的神好喜欢用鸟说话。', 'Birds again... the gods of this island really like talking with birds.', 'smirk'),
      L('telemachus', '{name}，伊俄涅，我想先去看看母亲，可我又怕……她会骂我不辞而别。', '{name}, Ione — I want to see my mother, but I\'m afraid... she\'ll scold me for leaving without a word.'),
    ],
    choices: [
      { text: T('"去吧。母亲的骂，也是想你。"', '"Go. A mother\'s scolding is just missing you."'), fx: { eloquence: 4 }, t: { gentle: 3 },
        reply: [L('ione', '……有母亲骂你，真好。', '...It must be nice, having a mother to scold you.', 'sad')] },
      { text: T('"带上预言者。王后会想听他的话。"', '"Bring the seer. The queen will want to hear him."'), fx: { wits: 4 }, t: { pious: 3 },
        reply: [L('theoclymenus', '我对王后发誓：奥德修斯已经在这座岛上了。', 'I swear to the queen: Odysseus is already on this island.')] },
    ],
    note: T('预言者忒奥克吕墨诺斯是《奥德赛》里一个次要人物。古希腊人相信，鸟出现在右边是吉兆，出现在左边是凶兆。',
      'Theoclymenus the seer is a minor figure in the Odyssey. Greeks believed a bird appearing on the right was a good omen, and on the left a bad one.'),
  },
  {
    id: 'm6_storm', month: 6, week: 3, scene: 'storm', cg: 'cg_m6_storm', cgIone: true,
    lines: [
      N('入夏第一场风暴。整夜狂风拍窗，她蜷在床角，捂着耳朵。', 'The first storm of summer. All night the wind batters the shutters; she curls in the corner of her bed, hands over her ears.'),
      L('poseidon', '伊——俄——涅——回来——', 'I—o—ne— come back—'),
      L('ione', '你听见了吗？海在叫我的名字……', 'Did you hear that? The sea is calling my name...', 'scared'),
    ],
    choices: [
      { text: T('坐到她床边，守到天亮。', 'Sit by her bed until dawn.'), trust: 10, t: { depend: 6, gentle: 3 },
        reply: [L('ione', '……别走。', '...Don\'t go.', 'tearful')] },
      { text: T('"那只是风。你比风更强。"', '"It is only the wind. You are stronger than the wind."'), trust: 4, t: { depend: -4 }, fx: { courage: 8 },
        reply: [L('ione', '……嗯。我不怕。', '...Mm. I\'m not afraid.', 'determined')] },
      { text: T('"我们去神庙为你祈祷。"', '"Let us pray for you at the temple."'), trust: 3, t: { pious: 8 }, fx: { piety: 8 },
        reply: [L('ione', '神会保护我吗？', 'Will the gods protect me?', 'thinking')] },
    ],
    note: T('在《奥德赛》里，海神波塞冬是奥德修斯最大的敌人：奥德修斯刺瞎了波塞冬的儿子、独眼巨人波吕斐摩斯，所以波塞冬一次次掀起风浪阻止他回家。',
      'In the Odyssey, Poseidon is Odysseus\'s greatest enemy: Odysseus blinded Poseidon\'s son, the Cyclops Polyphemus, so the sea god raised storm after storm to keep him from home.'),
  },
  {
    id: 'm6_dion_boat', month: 6, week: 4, scene: 'shore', cg: 'cg_m6_dion_boat', cgIone: true,
    lines: [
      N('风暴过后，狄翁带伊俄涅划小船去外海捞海绵。她一头扎进水里，好久都没有上来。', 'After the storm Dion rows Ione out to gather sponges. She dives in and stays under a long, long time.'),
      L('dion', '伊俄涅！伊俄涅！……天哪，你吓死我了！你在水下待了快一百次呼吸！', 'Ione! Ione! ...Gods, you scared me to death! You were under for nearly a hundred breaths!'),
      L('ione', '……是吗？我不觉得憋气。水下好安静，像回到了很久以前的地方。', '...Was I? I didn\'t feel short of breath. It\'s so quiet down there. Like going back somewhere from long ago.', 'calm'),
      L('dion', '你……你不会哪天就这样不回来了吧？', 'You... you won\'t just not come back up one day, will you?'),
      L('ione', '……我不知道。', '...I don\'t know.', 'sad'),
    ],
    choices: [
      { text: T('（回来后听她讲）"你在水下看见了什么？"', '(Later, listening to her) "What did you see under the water?"'), fx: { wits: 4 }, flag: 'divedDeep', trust: 3,
        reply: [L('ione', '一扇用珍珠贝做的门。门里有人在织布，织的是海浪。', 'A door made of mother-of-pearl. Someone inside was weaving — weaving waves.', 'thinking')] },
      { text: T('（回来后叮嘱）"答应我，下次别潜那么久。"', '(Later, firmly) "Promise me you won\'t stay under so long again."'), trust: 5, t: { depend: 4 },
        reply: [L('ione', '……好。为了你和狄翁，我会浮上来的。', '...All right. For you and Dion, I\'ll come back up.', 'shy')] },
    ],
    note: T('爱琴海的潜水采海绵是非常古老的行业。古代潜水员不戴任何装备，抱着石头下沉，能在水下憋气几分钟。',
      'Sponge diving in the Aegean is an ancient trade. Divers used no equipment, sinking with a stone and holding their breath for minutes at a time.'),
  },

  // ================= 7 月 · 身世的线索 =================
  {
    id: 'm7_laertes_visit', month: 7, week: 1, scene: 'laertes_farm', cg: 'cg_m7_laertes', cgIone: true,
    lines: [
      N('你带伊俄涅去城外的果园，看望奥德修斯的老父亲拉厄尔忒斯。老人穿着打补丁的衣服，戴着皮手套，正在给葡萄藤松土。', 'You take Ione to the orchard outside town to visit Laertes, Odysseus\'s aged father. The old man wears a patched tunic and leather gloves, loosening the soil around his vines.'),
      L('laertes', '门托尔？……又是来劝我回城的吧。城里有那帮豺狼，我宁可跟树待在一起。', 'Mentor? ...Come to coax me back to town again? With those jackals in the city, I\'d rather keep company with trees.'),
      L('ione', '老爷爷，这些树都是你种的吗？', 'Grandfather, did you plant all these trees?', 'surprised'),
      L('laertes', '每一棵。我儿子小时候，我带着他在园子里走，送给他十三棵梨树、十棵苹果树、四十棵无花果树，还答应给他五十行葡萄。他一棵一棵问名字……', 'Every one. When my son was small I walked him through the orchard and gave him thirteen pear trees, ten apple trees, forty fig trees, and promised him fifty rows of vines. He asked the name of each one...'),
      L('laertes', '……现在没人问了。', '...No one asks anymore.'),
      L('ione', '那我来问！这棵是什么？那棵呢？', 'Then I\'ll ask! What\'s this one? And that one?', 'happy'),
    ],
    choices: [
      { text: T('陪老人在果园里待一整天。', 'Spend the whole day in the orchard with the old man.'), fx: { farming: 8 }, t: { gentle: 4, cheer: 2 }, flag: 'knowsOrchard',
        reply: [L('laertes', '这孩子……好久没人陪我数树了。', 'This child... it\'s been so long since anyone counted the trees with me.')] },
      { text: T('"老爷爷，奥德修斯会回来的。"', '"Grandfather, Odysseus will come back."'), trust: 2, t: { pious: 3 }, flag: 'knowsOrchard',
        reply: [L('laertes', '但愿我这把老骨头还能等到那天。', 'May these old bones last until that day.')] },
    ],
    note: T('在《奥德赛》结尾，奥德修斯正是说出了父亲小时候送他的果树的数目，才让拉厄尔忒斯相信儿子真的回来了。',
      'At the end of the Odyssey, Odysseus proves himself to Laertes by naming exactly the trees his father gave him as a boy.'),
  },
  {
    id: 'm7_origin', month: 7, week: 2, scene: 'shore', cg: 'cg_m7_origin', cgIone: true,
    lines: [
      N('退潮的沙滩上，她捡到一条银色的发带，上面织着浪花纹——和她那枚贝壳上的纹路一模一样。', 'On the ebbing shore she finds a silver ribbon woven with wave patterns — the same pattern as on her shell.'),
      N('发带湿漉漉的，却一点也不冷，摸上去像活的一样微微发烫。', 'The ribbon is wet, yet not cold at all; it feels faintly warm, almost alive.'),
      L('ione', '这是给我的……我知道是给我的。', 'This is for me... I know it\'s for me.', 'thinking'),
      L('ione', '{you}……我是人类吗？', '{you}... am I human?', 'tearful'),
    ],
    choices: [
      { text: T('"不管你是谁，你都是伊俄涅。"', '"Whoever you are, you are Ione."'), trust: 8, t: { cheer: 4 },
        reply: [L('ione', '……嗯。我是伊俄涅。', '...Mm. I am Ione.', 'calm')] },
      { text: T('"也许你是海中女神的孩子。这不是坏事。"', '"Perhaps you are a sea goddess\'s child. That is no bad thing."'), trust: 4, t: { pious: 5 }, flag: 'knowsOrigin', item: 'silver_ribbon',
        reply: [L('ione', '那……总有一天我得回去吗？', 'Then... will I have to go back someday?', 'sad')] },
      { text: T('"我们一起去查清楚。"', '"Let us find out together."'), trust: 6, t: { depend: -3 }, fx: { wits: 8 }, flag: 'knowsOrigin', item: 'silver_ribbon',
        reply: [L('ione', '好。一起。', 'Okay. Together.', 'happy')] },
    ],
  },
  {
    id: 'm7_nymphs', month: 7, week: 3, scene: 'cave_nymphs', cg: 'cg_m7_nymphs', cgIone: true,
    lines: [
      N('福库斯港的尽头有一棵叶子细长的橄榄树，树旁是一座幽暗的山洞——水泽仙女们的洞穴。', 'At the head of the harbor of Phorcys stands a slender-leaved olive tree, and beside it a shadowy cave — the cave of the Nymphs.'),
      N('洞里有石头的调酒缸和双耳罐，蜜蜂在里面筑巢；还有长长的石头织机，好像仙女们在用它织海紫色的布。', 'Inside are mixing bowls and jars of stone where bees make their honey, and long stone looms where it seems the nymphs weave cloth of sea-purple.'),
      L('ione', '这里有两个洞口。北边那个是给人走的，南边那个……人走不进去。', 'There are two entrances. The north one is for people. The south one... people can\'t go in.', 'thinking'),
      L('ione', '是神走的门。我小时候……一定从那扇门走过。', 'It\'s the gods\' door. When I was little... I must have come through it.', 'surprised'),
      L('poseidon', '你记起来了。好孩子。时候快到了。', 'You remember. Good child. The time draws near.'),
    ],
    choices: [
      { text: T('拉住她的手，离开山洞。', 'Take her hand and lead her out of the cave.'), trust: 6, t: { depend: 4 },
        reply: [L('ione', '……谢谢你。刚才那一下，我差点就走进去了。', '...Thank you. Just now, I almost walked in.', 'tearful')] },
      { text: T('"别怕。听听它想说什么。"', '"Don\'t be afraid. Listen to what it wants to say."'), t: { pious: 5, depend: -3 }, fx: { courage: 5, piety: 3 }, flag: 'heardSea',
        reply: [L('ione', '它说……我母亲的名字叫"白色的浪"。', 'It says... my mother\'s name is "the White Wave".', 'thinking')] },
    ],
    note: T('《奥德赛》第十三卷描写了伊萨卡福库斯港的仙女洞：一扇门给凡人，一扇门只有神能走。费埃克斯人就把熟睡的奥德修斯放在这里的岸边。',
      'Book 13 of the Odyssey describes the cave of the Nymphs at Phorcys harbor on Ithaca: one door for mortals, one only gods may use. The Phaeacians set the sleeping Odysseus ashore right here.'),
  },
  {
    id: 'm7_melantho', month: 7, week: 4, scene: 'kitchen',
    lines: [
      L('melantho', '哟，海妖回来了。听说你在仙女洞里跟鬼说话？我看你就是个海里爬上来的怪物。', 'Oh, the sea-witch is back. I hear you were talking to ghosts in the Nymphs\' cave? You\'re a monster that crawled out of the sea, that\'s what.'),
      N('墨兰托一把扯下伊俄涅脖子上的贝壳项链，高高举起。', 'Melantho snatches the shell necklace from Ione\'s neck and holds it high.'),
      L('ione', '还给我！', 'Give it back!', 'angry'),
      L('melantho', '求我啊。像求婚者们求王后那样求我。', 'Beg me. Beg me the way the suitors beg the queen.'),
    ],
    choices: [
      { text: T('"墨兰托，项链还给她。你父亲多利俄斯是忠仆，别让他蒙羞。"', '"Melantho, give it back. Your father Dolius is a loyal servant — don\'t shame him."'), fx: { eloquence: 6 }, trust: 4,
        reply: [L('melantho', '……哼。拿去！', '...Hmph. Take it!'), L('ione', '你帮了我……谢谢。', 'You helped me... thanks.', 'shy')] },
      { text: T('（让伊俄涅自己处理。）', '(Let Ione handle it herself.)'), t: { depend: -5, gentle: -3 }, fx: { courage: 6 },
        reply: [N('伊俄涅一句话没说，把一整盆洗鱼水泼在了墨兰托身上。项链掉在地上，她捡起来就走。', 'Ione says nothing. She upends a whole basin of fish-water over Melantho. The necklace drops; she picks it up and walks out.'), L('ione', '我说过，我不需要谁喜欢我。', 'I told you. I don\'t need anyone to like me.', 'smirk')] },
      { text: T('"别跟她吵。一条项链而已，我给你做新的。"', '"Don\'t fight her. It\'s only a necklace. I\'ll make you a new one."'), t: { gentle: 4 }, trust: -2, fx: { stress: 5 },
        reply: [L('ione', '那是我从海里带来的唯一的东西！你根本不懂！', 'It\'s the only thing I brought from the sea! You don\'t understand at all!', 'tearful')] },
    ],
  },

  // ================= 8 月 · 乞丐来到小屋 =================
  {
    id: 'm8_amphinomus', month: 8, week: 1, scene: 'hall',
    lines: [
      N('求婚者里也有不那么坏的人。杜利基昂来的安菲诺摩斯就常常劝别人收敛些。', 'Not every suitor is wicked. Amphinomus of Dulichium often urges the others to restrain themselves.'),
      L('amphinomus', '安提诺俄斯，杀王子是大罪。我们先问问神的意思，神若不许，就算了吧。', 'Antinous, killing the prince is a grave crime. Let us ask the gods first; if they forbid it, let it go.'),
      L('antinous', '你心软，安菲诺摩斯。总有一天会害死你。', 'You\'re soft, Amphinomus. Someday it\'ll get you killed.'),
      N('散席时，安菲诺摩斯把一块没动过的面包悄悄放在伊俄涅手里。', 'As the feast breaks up, Amphinomus quietly presses an untouched loaf into Ione\'s hand.'),
      L('ione', '……他好像不是坏人。可他为什么要跟坏人坐在一起？', '...He doesn\'t seem bad. So why does he sit with the bad ones?', 'thinking'),
    ],
    choices: [
      { text: T('"好人跟错了人，也会一起倒下。"', '"A good man in bad company falls with it."'), fx: { wits: 5 }, t: { gentle: -2 },
        reply: [L('ione', '那我要提醒他，趁早离开。', 'Then I\'ll warn him to leave while he can.', 'determined')] },
      { text: T('"每个人心里都有好和坏。看他最后选哪一边。"', '"Every heart holds good and bad. See which side he chooses in the end."'), fx: { eloquence: 4 }, t: { gentle: 4 },
        reply: [L('ione', '……我也是吗？', '...Me too?', 'shy')] },
    ],
  },
  {
    id: 'm8_hut', month: 8, week: 2, scene: 'eumaeus_hut', cg: 'cg_m8_hut', cgIone: true,
    lines: [
      N('欧迈俄斯的小屋来了一个衣衫褴褛的老乞丐。他背驼着，头发掉光了，眼睛却很亮。四条狗冲他狂吠，他却不慌不忙地坐下，把手杖放在地上。', 'A ragged old beggar has come to Eumaeus\'s hut. He is stooped and bald, but his eyes are bright. The four dogs rush at him barking; he calmly sits and sets down his staff.'),
      L('beggar', '我是克里特人，打过仗，做过海盗，被腓尼基人骗过，又在忒斯普罗提亚听说——奥德修斯就快回来了。', 'I\'m a Cretan. I\'ve fought in wars, sailed as a raider, been cheated by Phoenicians — and in Thesprotia I heard that Odysseus will soon be home.'),
      L('eumaeus', '老人家，这种话每个流浪汉都说，好骗我们的王后一件新斗篷。我不信。', 'Old man, every wanderer says that, to coax a new cloak out of our queen. I don\'t believe it.'),
      L('ione', '……你说的是假话。', '...You\'re lying.', 'wary'),
      L('beggar', '（大笑）小姑娘，你怎么知道？', '(laughing) Little girl, how can you tell?'),
      L('ione', '你说谎的时候，跟我一样，会先看一眼海。', 'When you lie, you glance at the sea first. Like I do.', 'smirk'),
    ],
    choices: [
      { text: T('"伊俄涅，对客人要有礼貌。"', '"Ione, be courteous to a guest."'), fx: { etiquette: 5 }, t: { gentle: 3 }, flag: 'metBeggar',
        reply: [L('beggar', '不，她说得对。这孩子的眼睛比我见过的许多国王都尖。', 'No, she\'s right. This child has sharper eyes than many kings I\'ve met.')] },
      { text: T('（不说话，仔细打量这个乞丐。）', '(Say nothing; study the beggar closely.)'), fx: { wits: 6 }, flag: 'metBeggar',
        reply: [N('乞丐也在打量你。他的目光在你脸上停了很久，像在辨认一个多年未见的老朋友。', 'The beggar studies you in turn. His gaze rests on your face a long time, like a man recognizing an old friend after many years.')] },
    ],
    note: T('奥德修斯回到伊萨卡后，雅典娜把他变成一个衰老的乞丐。他对欧迈俄斯编了一个长长的"克里特人"的假故事——奥德修斯是希腊神话里最会讲故事、也最会说谎的英雄。',
      'Once home on Ithaca, Odysseus is disguised by Athena as an old beggar. He spins Eumaeus a long false tale of being a Cretan — Odysseus is the great storyteller and great liar of Greek myth.'),
  },
  {
    id: 'm8_recognition', month: 8, week: 3, scene: 'eumaeus_hut', cg: 'cg_m8_recognition', cgIone: true, cond: { flags: ['metBeggar'] },
    lines: [
      N('欧迈俄斯去城里给王后报信。小屋里只剩下忒勒马科斯、老乞丐，还有躲在门外摘无花果的伊俄涅。', 'Eumaeus has gone to town with word for the queen. In the hut are only Telemachus, the old beggar — and Ione, picking figs outside the door.'),
      N('一个高大的女人出现在院门口，只有乞丐和狗看得见她。狗呜咽着躲开了。伊俄涅也看得见——灰色的眼睛。', 'A tall woman appears at the gate; only the beggar and the dogs can see her. The dogs whimper and slink away. Ione can see her too — grey eyes.'),
      N('女神用金杖碰了碰乞丐。他的背挺直了，皱纹不见了，破衣变成了洁白的斗篷。', 'The goddess touches the beggar with a golden wand. His back straightens, his wrinkles vanish, his rags become a clean white cloak.'),
      L('telemachus', '你……你是神吗？', 'Are you... a god?'),
      L('odysseus', '我不是神。我是你的父亲。为了我，你受了二十年的苦。', 'I am no god. I am your father, for whose sake you have suffered twenty years.'),
      N('父子俩抱在一起，哭声像失去雏鸟的鹰。', 'Father and son cling together, weeping like eagles robbed of their young.'),
      L('ione', '……（捂住嘴巴，眼泪流了下来）', '...(hand over her mouth, tears running down)', 'tearful'),
      L('odysseus', '小海女，你都看见了。在我拿回我的家之前，这个秘密你能守住吗？', 'Little sea-girl, you saw everything. Until I win back my house — can you keep this secret?'),
    ],
    choices: [
      { text: T('（伊俄涅）"我发誓。我对着大海发誓。"', '(Ione) "I swear. I swear by the sea."'), flag: 'keptSecret', t: { pious: 4 }, fx: { wits: 4 },
        reply: [L('odysseus', '对着大海……好。那是最重的誓言。', 'By the sea... good. That is the heaviest oath there is.')] },
      { text: T('（伊俄涅）"……我只告诉门托尔一个人。"', '(Ione) "...I\'ll tell only Mentor."'), trust: 8, t: { depend: 5 }, flag: 'toldMentor',
        reply: [L('odysseus', '门托尔？哈，那就等于没说。他是我最信得过的人。', 'Mentor? Ha — then it\'s as good as untold. He\'s the man I trust most.')] },
    ],
    note: T('《奥德赛》第十六卷：父子在牧猪人的小屋里相认。荷马用"失去雏鸟的鹰"来比喻他们的哭声，这是史诗里最动人的场景之一。',
      'Book 16 of the Odyssey: father and son recognize each other in the swineherd\'s hut. Homer compares their weeping to birds of prey robbed of their young — one of the epic\'s most moving scenes.'),
  },

  // ================= 9 月 · 集市与第二场风暴 =================
  {
    id: 'm9_dion_dream', month: 9, week: 1, scene: 'harbor',
    lines: [
      L('dion', '伊俄涅，明年春天，有条商船要去西西里，船长说我可以去当桨手！', 'Ione, next spring a trading ship sails for Sicily, and the captain says I can row!'),
      L('ione', '……你要走？', '...You\'re leaving?', 'surprised'),
      L('dion', '去看看海的另一边！你也来吧，你比谁都懂海。我们可以一起去看世界的尽头。', 'To see the other side of the sea! Come too — you know the sea better than anyone. We could go see the edge of the world together.'),
      L('ione', '世界的尽头……', 'The edge of the world...', 'thinking'),
    ],
    choices: [
      { text: T('"想去就去吧。我会替你看着伊萨卡。"', '"If you want to go, go. I\'ll watch over Ithaca for you."'), t: { depend: -6 }, fx: { sailing: 5 }, flag: 'dionInvite',
        reply: [L('ione', '我……还没想好。可我很高兴有人邀请我。', 'I... haven\'t decided. But I\'m glad someone asked me.', 'happy')] },
      { text: T('"你还小，再等等。"', '"You\'re still young. Wait a while."'), t: { depend: 4 },
        reply: [L('ione', '你总是说再等等。', 'You always say wait.', 'pout')] },
    ],
  },
  {
    id: 'm9_contest', month: 9, week: 2, scene: 'agora', cg: 'cg_m9_contest', cgIone: true,
    lines: [
      N('港口集市举办比赛，奖品是一只三足铜鼎。她可以参加射箭，也可以参加歌唱。', 'The harbor market holds contests; the prize is a bronze tripod. She can enter the archery or the singing.'),
      L('dion', '加油，伊俄涅！我把一个月的鱼都押在你身上了！', 'Go, Ione! I bet a month\'s catch on you!'),
    ],
    choices: [
      { text: T('射箭比赛', 'Archery'), check: { stats: ['martial'], need: 130 }, flag: 'wonArchery',
        success: [L('ione', '正中靶心！你看到了吗！', 'Bullseye! Did you see?!', 'laugh')], fx: { courage: 6 },
        fail: [L('ione', '……差一点。明年我一定赢。', '...So close. Next year I\'ll win.', 'determined')] },
      { text: T('歌唱比赛', 'Singing'), check: { stats: ['song'], need: 130 }, flag: 'wonSong',
        success: [N('她唱起一首关于大海的歌，整个集市都安静了。', 'She sings of the sea, and the whole market falls silent.')], fx: { eloquence: 6 },
        fail: [L('ione', '我声音抖了……好丢脸。', 'My voice shook... so embarrassing.', 'shy')] },
    ],
    note: T('荷马时代的比赛奖品常常是铜鼎、铜锅、牛或女奴。三足铜鼎既实用又昂贵，是贵族之间最体面的礼物。',
      'Prizes in Homeric contests were often bronze tripods, cauldrons, oxen or slaves. A bronze tripod was useful and costly, the most prestigious gift among nobles.'),
  },
  {
    id: 'm9_hut_lessons', month: 9, week: 3, scene: 'eumaeus_hut', cond: { flags: ['metBeggar'] },
    lines: [
      N('伊俄涅常常偷偷跑去小屋找那个"乞丐"。他教她打水手结，给她讲卡吕普索的岛、费埃克斯人的船。', 'Ione often slips off to the hut to see the "beggar". He teaches her sailors\' knots and tells her of Calypso\'s island and the ships of the Phaeacians.'),
      L('odysseus', '我的木筏被波塞冬打碎的时候，有一位海中女神救了我。她叫伊诺，从前是凡人，后来成了白色的浪之女神琉科忒亚。她把自己的面纱借给我，让我游了两天两夜。', 'When Poseidon smashed my raft, a sea goddess saved me. Her name is Ino — once a mortal, now Leucothea, goddess of the white wave. She lent me her veil, and I swam two days and two nights.'),
      L('ione', '白色的浪……', 'The white wave...', 'surprised'),
      L('ione', '仙女洞里的声音说，我母亲叫"白色的浪"。', 'The voice in the Nymphs\' cave said my mother is called "the White Wave".', 'thinking'),
      L('odysseus', '那么，孩子，我欠你母亲一条命。现在轮到我来报答了。', 'Then, child, I owe your mother my life. Now it is my turn to repay her.'),
    ],
    choices: [
      { text: T('（之后听她讲这件事）"那你想见她吗？"', '(Later, as she tells you) "Do you want to meet her?"'), t: { depend: -3 }, flag: 'knowsMother', trust: 3,
        reply: [L('ione', '想。……也怕。如果见了她，我就再也回不来了怎么办？', 'Yes. ...And I\'m scared. What if I meet her and can never come back?', 'scared')] },
      { text: T('（之后听她讲这件事）"不管你母亲是谁，你在这里也有家。"', '(Later) "Whoever your mother is, you have a home here too."'), trust: 6, t: { depend: 4 }, flag: 'knowsMother',
        reply: [L('ione', '……嗯。两个家。我好贪心。', '...Mm. Two homes. I\'m so greedy.', 'shy')] },
    ],
    note: T('《奥德赛》第五卷：海中女神琉科忒亚（原为凡人伊诺）把神奇的面纱借给落水的奥德修斯，让他游到了费埃克斯人的岛上。',
      'Odyssey Book 5: the sea goddess Leucothea (once the mortal Ino) lends her magic veil to the shipwrecked Odysseus so he can swim to the land of the Phaeacians.'),
  },
  {
    id: 'm9_storm2', month: 9, week: 4, scene: 'storm', cg: 'cg_m9_storm2', cgIone: true,
    lines: [
      N('第二场风暴比第一场猛烈得多。海浪漫过码头，海面变成深紫，像打翻的酒。', 'The second storm is far worse. Waves wash over the docks; the sea turns deep purple, like spilled wine.'),
      L('poseidon', '你属于大海。冬天来临之前，回来。', 'You belong to the sea. Before winter comes — return.'),
      L('ione', '我不想走……我还不想走。', 'I don\'t want to go... not yet.', 'tearful'),
    ],
    choices: [
      { text: T('紧紧握住她的手。', 'Hold her hand tight.'), trust: 8, t: { depend: 5 },
        reply: [L('ione', '……你的手好暖。', '...Your hand is warm.', 'shy')] },
      { text: T('"那就自己决定，谁也不能替你决定。"', '"Then decide for yourself. No one can decide for you."'), trust: 5, t: { depend: -6, pious: -4 }, fx: { courage: 6 },
        reply: [L('ione', '自己决定……', 'Decide for myself...', 'determined')] },
    ],
    note: T('"酒色的海"（wine-dark sea）是荷马最著名的比喻之一。学者们至今还在争论：古希腊人眼里的海，究竟是什么颜色。',
      '"The wine-dark sea" is one of Homer\'s most famous phrases. Scholars still argue about what color the ancient Greeks actually saw in the sea.'),
  },

  // ================= 10 月 · 乞丐走进王宫 =================
  {
    id: 'm10_beggar', month: 10, week: 1, scene: 'palace_gate', cg: 'cg_m10_argos', cgIone: true,
    lines: [
      N('一个衣衫褴褛的老乞丐跟着欧迈俄斯来到王宫门口。门边的粪堆上，趴着一条又老又瘦、满身虱子的猎犬。', 'A ragged old beggar follows Eumaeus to the palace gate. On the dung heap by the door lies an old hound, thin and crawling with fleas.'),
      L('eumaeus', '那是阿尔戈斯，奥德修斯亲手养大的。从前它追鹿，没有一头逃得掉。主人走了，就没人管它了。', 'That\'s Argos. Odysseus raised him himself. Once no deer could outrun him. With his master gone, no one cares for him.'),
      N('老狗认出了乞丐。它抬起头，耷拉的耳朵动了动，尾巴摇了一下——可它已经没有力气爬到主人身边了。', 'The old dog knows the beggar. He lifts his head, his drooping ears twitch, his tail wags once — but he no longer has the strength to crawl to his master.'),
      N('乞丐转过脸，悄悄擦掉一滴眼泪。阿尔戈斯等了二十年，见到主人最后一眼，就再也没有动。', 'The beggar turns his face away and quietly wipes a tear. Argos had waited twenty years; he saw his master one last time, and moved no more.'),
      L('ione', '它等了二十年……就为了看他一眼。', 'He waited twenty years... just to see him once.', 'tearful'),
      N('大厅里，乞丐挨个向求婚者讨饭。安提诺俄斯抓起一只脚凳，狠狠砸在他背上。', 'In the hall the beggar goes round the suitors asking for scraps. Antinous seizes a footstool and hurls it hard into his back.'),
      L('antinous', '滚！哪来的瘟神，坏了大家的胃口！', 'Get out! What plague brought you here to spoil our appetite!'),
      L('ione', '（攥紧拳头，又看了看乞丐，慢慢松开）……', '(clenches her fists, glances at the beggar, slowly unclenches them)...', 'angry'),
    ],
    choices: [
      { text: T('陪她为阿尔戈斯挖一个坟。', 'Help her dig a grave for Argos.'), trust: 6, t: { gentle: 6 },
        reply: [L('ione', '我在坟上放了一块骨头。……他会笑我傻吧。', 'I put a bone on his grave. ...He\'d laugh at me for being silly.', 'sad')] },
      { text: T('给乞丐端去一碗热汤。', 'Bring the beggar a bowl of hot broth.'), t: { gentle: 3 }, fx: { etiquette: 4 }, trust: 2,
        reply: [L('beggar', '谢谢你，好心人。客人是宙斯送来的，善待客人的人，神会记得。', 'Thank you, kind one. Strangers are sent by Zeus. The gods remember those who treat them well.')] },
    ],
    note: T('老狗阿尔戈斯认主的场景出自《奥德赛》第十七卷，是西方文学里最有名的狗。安提诺俄斯用脚凳砸乞丐，严重违反了客人之谊。',
      'Argos recognizing his master comes from Book 17 of the Odyssey — the most famous dog in Western literature. Antinous striking a beggar with a footstool gravely violates guest-friendship.'),
  },
  {
    id: 'm10_irus', month: 10, week: 2, scene: 'hall',
    lines: [
      N('城里有个大块头乞丐叫伊罗斯，专替求婚者跑腿。他见新来的乞丐抢了他的地盘，叉着腰要赶他走。', 'There\'s a hulking beggar in town named Irus who runs errands for the suitors. Seeing the newcomer on his patch, he plants his fists on his hips and orders him out.'),
      L('irus', '滚出门去，老东西！不然我把你的牙一颗颗打下来！', 'Out the door, old man! Or I\'ll knock your teeth out one by one!'),
      L('antinous', '好戏！谁打赢了，就赏他一根羊肚香肠！', 'What sport! The winner gets a stuffed goat-paunch sausage!'),
      N('乞丐把破衣服束在腰上，露出粗壮的大腿和肩膀。求婚者们惊呆了。只一拳，伊罗斯就倒在了地上。', 'The beggar hitches his rags up around his waist, baring thick thighs and shoulders. The suitors gape. One blow, and Irus is on the floor.'),
      L('ione', '（小声）我就知道……', '(softly) I knew it...', 'smirk'),
      L('beggar', '安菲诺摩斯，你是个讲理的人。听我一句：主人很快就会回来，离开这里吧，趁还来得及。', 'Amphinomus, you are a man of sense. Hear me: the master will soon be home. Leave this place while you still can.'),
      N('安菲诺摩斯低头沉默了很久。可他终究没有走。', 'Amphinomus bows his head in silence for a long time. But in the end he does not leave.'),
    ],
    choices: [
      { text: T('（伊俄涅）悄悄追上安菲诺摩斯："你快走吧。"', '(Ione) Slips after Amphinomus: "Please, go."'), t: { gentle: 5 }, fx: { eloquence: 4 }, flag: 'warnedAmphinomus',
        reply: [L('amphinomus', '小姑娘……谢谢你。可我答应过他们。', 'Little one... thank you. But I gave them my word.'), L('ione', '那不是好的诺言。', 'That\'s not a good promise.', 'sad')] },
      { text: T('（伊俄涅）给受伤的伊罗斯送去一块布。', '(Ione) Brings the injured Irus a cloth.'), t: { gentle: 4 }, fx: { etiquette: 3 },
        reply: [L('irus', '……你是第一个可怜我的人。', '...You\'re the first who ever pitied me.')] },
    ],
    note: T('《奥德赛》第十八卷：奥德修斯和乞丐伊罗斯拳斗，还警告了求婚者中较善良的安菲诺摩斯。可惜他没有听，最后仍死在大厅里。',
      'Odyssey Book 18: Odysseus boxes the beggar Irus and warns Amphinomus, the kindest of the suitors. Sadly he does not listen, and dies in the hall all the same.'),
  },
  {
    id: 'm10_melantho', month: 10, week: 3, scene: 'hall',
    lines: [
      N('夜里，侍女们在大厅里点火盆。墨兰托冲乞丐冷笑。', 'At night the maids light the braziers in the hall. Melantho sneers at the beggar.'),
      L('melantho', '老家伙，还不去铁匠铺里睡觉？打赢了伊罗斯就以为自己是英雄了？小心有人拿火把把你赶出去！', 'Old man, why not go sleep in the smithy? Beat Irus and think you\'re a hero? Watch out someone doesn\'t drive you out with a torch!'),
      L('ione', '墨兰托！王后待你像亲生女儿，你却天天跟欧律马科斯混在一起，还欺负客人！', 'Melantho! The queen raised you like her own daughter, and you run around with Eurymachus and bully guests!', 'angry'),
      L('melantho', '你算什么？一个海里冲上来的垃圾！', 'And what are you? Trash the sea washed up!'),
      L('beggar', '（平静地）姑娘，你说的话，主人回来时都会知道。', '(calmly) Girl, every word you say, the master will hear when he returns.'),
      N('墨兰托脸色一白，提着火盆跑了。', 'Melantho goes pale and hurries off with her brazier.'),
    ],
    choices: [
      { text: T('"伊俄涅，你骂得好，但别给自己惹麻烦。"', '"Ione, well said — but don\'t bring trouble on yourself."'), trust: 3, fx: { courage: 3, etiquette: 2 },
        reply: [L('ione', '我不怕麻烦。我怕的是好人被欺负。', 'I\'m not afraid of trouble. I\'m afraid of good people being bullied.', 'determined')] },
      { text: T('"墨兰托也是个可怜人。她以为跟着求婚者就能过上好日子。"', '"Melantho is to be pitied too. She thinks the suitors will give her a better life."'), t: { gentle: 5 }, fx: { wits: 3 },
        reply: [L('ione', '……也许吧。可她选错了。', '...Maybe. But she chose wrong.', 'thinking')] },
    ],
  },
  {
    id: 'm10_footbath', month: 10, week: 4, scene: 'hall', cg: 'cg_m10_footbath', cgIone: true,
    lines: [
      N('深夜，珀涅罗珀召见老乞丐，问他远方的消息。乞丐说他见过奥德修斯，连他披的紫色斗篷和金别针都描述得清清楚楚。', 'Late at night Penelope summons the beggar and asks for news from afar. He says he once met Odysseus, and describes his purple cloak and golden brooch exactly.'),
      L('penelope', '奶妈，给这位客人洗脚吧。他和你主人年纪相仿……也许我的丈夫此刻也正这样受苦。', 'Nurse, wash this guest\'s feet. He is of an age with your master... perhaps my husband suffers just like this at this very moment.'),
      N('奶妈端来铜盆，跪下给乞丐洗脚。她的手摸到了膝盖上面的一道旧疤——', 'Nurse brings a bronze basin and kneels to wash his feet. Her hand touches an old scar above the knee —'),
      L('nurse', '（手一抖，铜盆翻倒在地）这道疤……是野猪留下的……你是——', '(her hands shake; the basin clatters over) This scar... a boar\'s tusk... you are —'),
      L('beggar', '（一把捂住她的嘴）嘘！奶妈，你想害死我吗？', '(clapping a hand over her mouth) Hush! Nurse, do you want to get me killed?'),
      N('雅典娜转开了王后的心思，她什么都没察觉。只有伊俄涅在门边，把一切都看在眼里。', 'Athena turns the queen\'s thoughts away; she notices nothing. Only Ione, by the door, sees it all.'),
      L('beggar', '孩子，你看见了什么？', 'Child, what did you see?'),
    ],
    choices: [
      { text: T('让她保守秘密。', 'Tell her to keep the secret.'), trust: 4, t: { gentle: 2 }, fx: { wits: 6 }, flag: 'keptSecret',
        reply: [L('ione', '我什么都没看见。（她冲你眨了眨眼）', 'I saw nothing. (She winks at you.)', 'smirk')] },
      { text: T('（伊俄涅）"膝盖上面，野猪的獠牙。我早就知道了。"', '(Ione) "Above the knee. A boar\'s tusk. I knew all along."'), fx: { wits: 8 }, flag: 'keptSecret',
        reply: [L('beggar', '……奶妈给你讲过那个故事？聪明的孩子。', '...Nurse told you that story? Clever child.')] },
    ],
    note: T('洗脚认疤是《奥德赛》第十九卷的名场面。给客人洗脚是待客之礼的一部分，也是这首史诗里一个精巧的"认出"情节。',
      'The footbath and the scar is a famous scene from Odyssey Book 19. Washing a guest\'s feet was part of hospitality — and here it becomes one of the epic\'s cleverest recognition scenes.'),
  },

  // ================= 11 月 · 梦、武器与弓 =================
  {
    id: 'm11_dream', month: 11, week: 1, scene: 'loomroom',
    lines: [
      L('penelope', '老人家，请为我解一个梦。我梦见二十只鹅在院子里啄麦子，一只山鹰飞下来，把它们全杀了。然后鹰开口说：我是你的丈夫，那些鹅是求婚者。', 'Old man, read me a dream. I dreamed twenty geese were pecking grain in the yard, and an eagle swooped down and killed them all. Then the eagle spoke: I am your husband, and the geese are the suitors.'),
      L('beggar', '王后，这个梦不用解。鹰已经说得很明白了。', 'My queen, this dream needs no reading. The eagle has said it plainly.'),
      L('penelope', '可梦有两扇门：牛角门里出来的梦会成真，象牙门里出来的梦只会骗人。我怕这个梦是从象牙门来的。', 'But dreams come through two gates: those from the gate of horn come true; those from the gate of ivory only deceive. I fear this one came through ivory.'),
      L('penelope', '明天是阿波罗的新月节。我要拿出奥德修斯的大弓：谁能拉开它，一箭穿过十二把斧头的孔，我就跟谁走。', 'Tomorrow is Apollo\'s new-moon feast. I will bring out Odysseus\'s great bow. Whoever strings it and shoots through the holes of twelve axe-heads — him I will follow.'),
      L('ione', '王后……您真的要嫁人吗？', 'My queen... are you really going to marry?', 'scared'),
      L('penelope', '（摸摸她的头）孩子，有些事，到明天就知道了。', '(stroking her hair) Child, some things we will know tomorrow.'),
    ],
    choices: [
      { text: T('"王后，我相信牛角门。"', '"My queen, I believe in the gate of horn."'), t: { pious: 4 }, fx: { eloquence: 4 }, trust: 2,
        reply: [L('penelope', '……但愿你是对的，门托尔。', '...May you be right, Mentor.')] },
      { text: T('（不说话，看了乞丐一眼。）', '(Say nothing; glance at the beggar.)'), fx: { wits: 5 },
        reply: [N('乞丐几乎察觉不到地点了点头。', 'The beggar gives the barest nod.')] },
    ],
    note: T('牛角门与象牙门的说法出自《奥德赛》第十九卷。希腊语里"牛角"和"实现"、"象牙"和"欺骗"读音相近，这是一个双关。',
      'The gates of horn and ivory come from Odyssey Book 19. In Greek, "horn" sounds like "fulfil" and "ivory" like "deceive" — a pun.'),
  },
  {
    id: 'm11_weapons', month: 11, week: 2, scene: 'hall', cg: 'cg_m11_weapons', cgIone: true,
    lines: [
      N('深夜，求婚者们散了。奥德修斯和忒勒马科斯把挂在大厅墙上的盾牌、头盔和长矛一件件取下来，藏进库房。', 'Late at night, after the suitors leave, Odysseus and Telemachus take the shields, helmets and spears from the hall walls one by one and hide them in the storeroom.'),
      L('telemachus', '如果他们问起来，就说烟把兵器熏黑了，拿去擦一擦。', 'If they ask, we say the smoke blackened the weapons and we took them to polish.'),
      N('前面没有点灯，可一团金色的光一直走在他们前面，照亮了柱子和屋梁。', 'No lamp is lit, yet a golden glow moves ahead of them, lighting the pillars and rafters.'),
      L('ione', '那是……灰眼睛的灯。', 'That\'s... the grey eyes\' lamp.', 'surprised'),
      L('odysseus', '伊俄涅，你搬得动这面盾吗？……好姑娘。', 'Ione, can you carry this shield? ...Good girl.'),
    ],
    choices: [
      { text: T('（伊俄涅）一声不吭地搬了一整夜。', '(Ione) Carries without a word all night.'), fx: { stamina: 5, courage: 4 }, t: { depend: -2 },
        reply: [L('ione', '手好酸……可我一点都不困。', 'My arms ache... but I\'m not sleepy at all.', 'determined')] },
      { text: T('（伊俄涅）在门口望风。', '(Ione) Keeps watch at the door.'), fx: { wits: 5 },
        reply: [L('ione', '墨兰托的灯刚刚熄了。走廊里没有人。', 'Melantho\'s lamp just went out. The corridor is empty.', 'thinking')] },
    ],
    note: T('奥德修斯在决战前一晚把兵器移出大厅，让求婚者赤手空拳。雅典娜举着金灯为他们照路——又一次，神在暗中帮助英雄。',
      'The night before the battle Odysseus removes the weapons from the hall, leaving the suitors unarmed. Athena lights the way with a golden lamp — once more, a god helps the hero in secret.'),
  },
  {
    id: 'm11_eve', month: 11, week: 3, scene: 'room',
    lines: [
      N('决战前一夜。伊俄涅抱着膝盖坐在窗下，月亮几乎看不见了。', 'The night before the battle. Ione sits under the window, hugging her knees. The moon is almost gone.'),
      L('ione', '{you}，你睡了吗？', '{you}, are you asleep?', 'sad'),
      L('ione', '明天会有很多人死吧。……我怕的不是死。我怕明天以后，海就要来接我了。', 'A lot of people will die tomorrow, won\'t they. ...I\'m not afraid of dying. I\'m afraid that after tomorrow, the sea will come for me.', 'scared'),
      L('ione', '如果我走了，你会想我吗？', 'If I go... will you miss me?', 'tearful'),
    ],
    choices: [
      { text: T('"每天都会。"', '"Every single day."'), trust: 8, t: { depend: 5 },
        reply: [L('ione', '……那我就不走了。', '...Then I won\'t go.', 'tearful')] },
      { text: T('"无论你在哪里，都是我教过的孩子。"', '"Wherever you are, you are the child I taught."'), trust: 5, t: { depend: -3 }, fx: { courage: 4 },
        reply: [L('ione', '……嗯。你教我的，我都记得。', '...Mm. Everything you taught me, I remember.', 'calm')] },
      { text: T('"先别想那么远。睡吧，明天需要你。"', '"Don\'t think so far ahead. Sleep — tomorrow needs you."'), fx: { stamina: 4 },
        reply: [L('ione', '……嗯。晚安。', '...Mm. Good night.', 'sleepy')] },
    ],
  },
  {
    id: 'm11_bow', month: 11, week: 4, scene: 'hall', cg: 'cg_m11_bow', cgIone: true,
    lines: [
      N('阿波罗新月节。珀涅罗珀从库房取出大弓。那是伊菲托斯送给奥德修斯的礼物，弓臂是弯曲的牛角，弓弦像竖琴的弦一样紧。', 'The new-moon feast of Apollo. Penelope brings the great bow from the storeroom — a gift to Odysseus from Iphitus, its limbs of curved horn, its string tight as a lyre\'s.'),
      L('penelope', '谁能拉开奥德修斯的弓，一箭穿过十二把斧头的孔，我就嫁给谁。', 'Whoever strings the bow of Odysseus and shoots through twelve axe-heads — him I will marry.'),
      N('忒勒马科斯先试，三次都差一点。求婚者们一个接一个上前，把弓在火上烤软、抹上油脂，还是拉不开。', 'Telemachus tries first and thrice nearly does it. The suitors come up one after another, warming the bow by the fire and greasing it with tallow — and still cannot bend it.'),
      L('ione', '{you}，我也想试试那把弓。', '{you}, I want to try that bow too.', 'determined'),
    ],
    choices: [
      { text: T('"去吧，让他们看看。"', '"Go. Show them."'), check: { stats: ['martial', 'courage'], need: 220 }, t: { depend: -4, gentle: -3 }, flag: 'drewBow',
        success: [N('她把弓拉开了一半，满堂哗然。乞丐看着她，眼里有光。', 'She draws the bow halfway. The hall erupts. The beggar watches her, eyes shining.')],
        fail: [N('弓弦纹丝不动。求婚者哄笑，她咬着嘴唇退下。', 'The string will not budge. The suitors jeer; she bites her lip and steps back.')] },
      { text: T('"把弓留给那个乞丐。"', '"Leave the bow for the beggar."'), t: { pious: 3 }, fx: { wits: 6 }, flag: 'trustedBeggar',
        reply: [L('ione', '你知道些什么，对吧？', 'You know something, don\'t you?', 'thinking')] },
    ],
    note: T('比箭招亲是《奥德赛》第二十一卷的高潮。"穿过十二把斧头"大概是指斧头上供装柄的圆孔排成一行，箭从孔中穿过。',
      'The contest of the bow is the climax of Odyssey Book 21. "Through twelve axes" probably means shooting through the shaft-holes of axe-heads set in a row.'),
  },

  // ================= 12 月 · 决战与抉择 =================
  {
    id: 'm12_battle', month: 12, week: 1, scene: 'hall', cg: 'cg_m12_battle', cgIone: true,
    lines: [
      N('乞丐拿起弓，像歌者给竖琴上弦一样，轻轻一扳就挂上了弦。他拨了一下，弓弦唱出燕子般的声音。', 'The beggar takes the bow and, as a singer strings a lyre, bends it with ease and slips the string on. He plucks it, and it sings like a swallow.'),
      N('第一箭穿过了十二把斧头。第二箭，射向了安提诺俄斯。', 'The first arrow passes through all twelve axes. The second flies at Antinous.'),
      L('odysseus', '你们这些狗！你们以为我再也回不来了，吃我的家产，逼我的妻子，欺负我的仆人！', 'You dogs! You thought I would never come home — you devoured my house, harassed my wife, abused my servants!'),
      N('大厅的门被锁上了。墙上的兵器早已不见，求婚者们抓起桌子当盾牌。忒勒马科斯、欧迈俄斯和你站在奥德修斯身边。', 'The hall doors are barred. The weapons are long gone from the walls; the suitors snatch up tables for shields. Telemachus, Eumaeus and you stand beside Odysseus.'),
    ],
    check: { stats: ['martial', 'courage', 'wits'], need: 330 },
    choices: [
      { text: T('和她一起守住门口。', 'Hold the doorway with her.'), flag: 'battleWon',
        success: [L('ione', '我们守住了！伊萨卡是我们的家！', 'We held it! Ithaca is our home!', 'determined'), N('雅典娜化作燕子落在屋梁上，举起了她那令人胆寒的神盾。求婚者们像受惊的牛群一样四散奔逃。', 'Athena, in the shape of a swallow, alights on a rafter and raises her terrible aegis. The suitors scatter like a panicked herd.')],
        fail: [N('求婚者冲破了你们的防线，她受了伤。奥德修斯最终获胜，可她倒在了地上……', 'The suitors break through your line and she is wounded. Odysseus prevails in the end, but she lies fallen...')], failFlag: 'defeated' },
    ],
    note: T('决战发生在《奥德赛》第二十二卷。荷马说，雅典娜化作燕子坐在屋梁上，举起神盾，让求婚者惊慌失措。',
      'The battle is Odyssey Book 22. Homer says Athena perched on the roof-beam like a swallow and raised her aegis, throwing the suitors into panic.'),
  },
  {
    id: 'm12_bed', month: 12, week: 2, scene: 'room', cg: 'cg_m12_bed', cgIone: true,
    lines: [
      N('大厅清洗干净了，琴声响起，好像在举行婚礼，让城里人以为一切如常。不忠的侍女们被赶出了王宫，墨兰托低着头，跟在最后面。', 'The hall is washed clean. The lyre plays as if for a wedding, so the town will think all is well. The disloyal maids are driven from the palace; Melantho walks last, head bowed.'),
      L('penelope', '（迟迟不肯走近）……我怎么知道你真的是他？神也会变成人的样子。', '(refusing to come near) ...How can I know you are truly him? Gods can take a man\'s shape.'),
      L('penelope', '奶妈，把他的床从卧房搬出来，给客人睡。', 'Nurse, carry his bed out of the bedchamber for our guest.'),
      L('odysseus', '搬床？谁能搬动那张床！那是我亲手用一棵活橄榄树做的床柱，树根还长在地里，我围着它盖的卧室！', 'Move the bed? Who could move that bed! I built it myself around a living olive tree — its roots still in the earth — and built the bedchamber around it!'),
      N('珀涅罗珀的膝盖一软，扑过去抱住了他。这是只有他们两个人知道的秘密。', 'Penelope\'s knees give way and she runs to embrace him. It was a secret only the two of them knew.'),
      L('ione', '（擦眼泪）王后才是最聪明的人……她用一张床考住了奥德修斯。', '(wiping tears) The queen is the cleverest of all... she tested Odysseus with a bed.', 'tearful'),
    ],
    choices: [
      { text: T('（伊俄涅）"我也想要一个只有自己人知道的秘密。"', '(Ione) "I want a secret only my own people know, too."'), trust: 6, t: { depend: 4 },
        reply: [L('ione', '……比如，你叫我"小海妖"的时候，我其实很高兴。', '...Like — when you call me "little sea-monster", I\'m actually happy.', 'shy')] },
      { text: T('（伊俄涅）"原来最难的不是打仗，是等待。"', '(Ione) "So the hardest part isn\'t fighting. It\'s waiting."'), fx: { wits: 5 }, t: { gentle: 3 },
        reply: [L('penelope', '是的，孩子。二十年。', 'Yes, child. Twenty years.')] },
    ],
    note: T('橄榄树床是《奥德赛》第二十三卷里夫妻相认的关键。珀涅罗珀故意说要搬床，用只有夫妻知道的秘密考验丈夫——她和奥德修斯一样足智多谋。',
      'The olive-tree bed is the key to the couple\'s reunion in Odyssey Book 23. Penelope pretends the bed can be moved, testing her husband with a secret only they shared — she is every bit as cunning as Odysseus.'),
  },
  {
    id: 'm12_laertes', month: 12, week: 3, scene: 'laertes_farm', cg: 'cg_m12_laertes', cgIone: true,
    lines: [
      N('奥德修斯来到果园，见到了满身尘土的父亲。他没有马上相认，老人哭着说儿子早已死在远方。', 'Odysseus comes to the orchard and finds his father covered in dust. He does not reveal himself at once, and the old man weeps that his son died far away.'),
      L('odysseus', '父亲，是我。你不信？那我告诉你：你给过我十三棵梨树、十棵苹果树、四十棵无花果树，还答应给我五十行葡萄。', 'Father, it\'s me. You don\'t believe it? Then hear this: you gave me thirteen pear trees, ten apple trees, forty fig trees, and promised me fifty rows of vines.'),
      L('ione', '我也记得！老爷爷数给我听过！', 'I remember too! Grandfather counted them for me!', 'happy'),
      L('laertes', '（扑上去抱住儿子）宙斯在上……神还在奥林匹斯山上！', '(throwing his arms round his son) Father Zeus... the gods still live on Olympus!'),
      N('可就在这时，求婚者的亲属们举着武器来报仇了。双方刚刚交手，一个声音响彻天地——', 'But just then the suitors\' kinsmen arrive, armed for revenge. The two sides have barely clashed when a voice rings across heaven and earth —'),
      L('athena', '伊萨卡人，住手！不要再流血了。让我们立下誓约，让和平重新回到这座岛上。', 'Men of Ithaca, stop! Shed no more blood. Let oaths be sworn, and let peace return to this island.'),
      L('ione', '……是灰眼睛。她终于露出真面目了。', '...The grey eyes. At last she shows her true face.', 'surprised'),
    ],
    choices: [
      { text: T('（伊俄涅）向女神深深行礼。', '(Ione) Bows deeply to the goddess.'), t: { pious: 6 }, fx: { piety: 6 },
        reply: [L('athena', '海的女儿，你一直看得见我。很少有凡人的眼睛这么亮。', 'Daughter of the sea, you saw me all along. Few mortal eyes are so bright.')] },
      { text: T('（伊俄涅）"你一直在骗我们！"', '(Ione) "You\'ve been tricking us all along!"'), t: { pious: -5, gentle: -2 }, fx: { courage: 5 },
        reply: [L('athena', '（笑）是骗，也是保护。你将来也会懂的。', '(laughing) Tricking, and protecting. You will understand someday.')] },
    ],
    note: T('《奥德赛》的最后一卷：奥德修斯与父亲在果园相认，求婚者的家属前来复仇，雅典娜出面让双方立誓讲和，史诗在和平中结束。',
      'The last book of the Odyssey: Odysseus and his father are reunited in the orchard, the suitors\' families come for revenge, and Athena makes both sides swear peace. The epic ends in peace.'),
  },
  {
    id: 'm12_poseidon', month: 12, week: 4, scene: 'storm', cg: 'cg_m12_poseidon', cgIone: true,
    lines: [
      N('和平的第一个黎明，海面忽然升起一道巨浪，浪尖上站着一个看不清面孔的身影。浪的旁边，一个披着白纱的女人在水面上看着伊俄涅。', 'On the first dawn of peace, a great wave rises from the sea, and on its crest stands a figure whose face cannot be seen. Beside the wave, a woman veiled in white watches Ione from the water.'),
      L('poseidon', '伊俄涅。一年的期限到了。回到大海吧，那里才是你的家。', 'Ione. The year is over. Return to the sea. That is your home.'),
      L('ione', '……那是我母亲吗？白色的浪……', '...Is that my mother? The white wave...', 'tearful'),
      L('ione', '{you}……我该怎么办？', '{you}... what should I do?', 'scared'),
    ],
    choices: [
      { text: T('"留下来。这里也是你的家。"', '"Stay. This is your home too."'), final: 'land',
        reply: [L('ione', '……我要留在陆地上。母亲，对不起……我会常常来海边看你。', '...I will stay on land. Mother, I\'m sorry... I\'ll come to the shore to see you often.', 'determined')] },
      { text: T('"去吧。无论去哪里，你都是我的骄傲。"', '"Go. Wherever you are, you are my pride."'), final: 'sea',
        reply: [L('ione', '我会在每一朵浪花里想起你。', 'I will think of you in every wave.', 'tearful')] },
      { text: T('"你不必听任何神的话。"', '"You need not obey any god."'), final: 'defy',
        reply: [L('ione', '海神大人，我拒绝！', 'Lord of the Sea — I refuse!', 'angry')] },
    ],
  },
];

// ================= 宠物线：开局选的宠物（s.pet）各有四段故事 =================
// 1 月相遇 · 6 月帮忙 · 10 月乞丐/阿尔戈斯 · 12 月海神来临前
const P = (pet, n, month, week, scene, lines, choices, extra = {}) => ({ id: `pet_${pet}_${n}`, month, week, scene, cond: { pet }, lines, choices, ...extra });
const PET_EVENTS = [
  // —— 猫头鹰 ——
  P('owl', 1, 1, 3, 'room', [
    N('半夜，窗台上传来"咕——咕——"的叫声。一只灰褐色的小猫头鹰正歪着头，用一双金色的圆眼睛看着伊俄涅。', 'At midnight a soft "hoo — hoo —" comes from the windowsill. A small brown-grey owl tilts its head and studies Ione with round golden eyes.'),
    L('ione', '……你是从神庙来的吗？你的眼睛跟那个客人有点像。', '...Did you come from the temple? Your eyes are a bit like that guest\'s.', 'surprised'),
    N('小猫头鹰跳到她的膝盖上，啄了啄她攥着贝壳的手指，然后把一片橄榄叶放在她手心。', 'The owlet hops onto her knee, nibbles the fingers clutching her shell, and sets an olive leaf in her palm.'),
    L('ione', '我叫你格劳克斯好不好？……你不许飞走。', 'Can I call you Glaux? ...Don\'t you dare fly away.', 'shy'),
  ], [
    { text: T('"它选了你。好好待它。"', '"It chose you. Treat it well."'), trust: 3, t: { pious: 4 }, fx: { wits: 3 },
      reply: [L('ione', '它选了我……第一次有谁选我。', 'It chose me... the first time anyone chose me.', 'happy')] },
    { text: T('"猫头鹰是雅典娜的鸟，这是好兆头。"', '"The owl is Athena\'s bird. This is a good omen."'), t: { pious: 6 }, fx: { piety: 4 },
      reply: [L('ione', '那……雅典娜在看着我吗？', 'Then... is Athena watching me?', 'thinking')] },
  ], { cg: 'cg_pet_owl_1', cgIone: true, note: T('小猫头鹰是雅典娜的象征鸟。雅典的银币上就印着一只猫头鹰，所以古希腊人把运送东西到盛产的地方叫做"把猫头鹰带到雅典"。', 'The little owl was Athena\'s sacred bird. Athenian silver coins carried an owl, and "bringing owls to Athens" meant bringing something where it was already plentiful.') }),
  P('owl', 2, 6, 4, 'loomroom', [
    N('格劳克斯这几夜总是绕着织房飞。伊俄涅跟着它过去，看见墨兰托正把王后的骨梭往怀里藏。', 'For several nights Glaux keeps circling the weaving room. Ione follows and sees Melantho tucking the queen\'s bone shuttle into her dress.'),
    L('ione', '那是王后的梭子！', 'That\'s the queen\'s shuttle!', 'angry'),
    N('格劳克斯扑下来，一爪子把梭子从墨兰托手里抓走，扔到了伊俄涅脚边。', 'Glaux swoops down, snatches the shuttle from Melantho\'s hand, and drops it at Ione\'s feet.'),
    L('melantho', '这只死鸟！……哼，我只是借来看看！', 'That cursed bird! ...Hmph, I was only borrowing it!'),
  ], [
    { text: T('"把梭子还给王后，什么都别说。"', '"Return the shuttle to the queen and say nothing."'), t: { gentle: 4 }, fx: { etiquette: 4 }, trust: 2,
      reply: [L('ione', '格劳克斯，你比守夜的人还管用。', 'Glaux, you\'re better than a night watchman.', 'laugh')] },
    { text: T('"告诉王后。她该知道谁在背后搞鬼。"', '"Tell the queen. She should know who\'s scheming."'), fx: { eloquence: 4, wits: 3 }, t: { gentle: -2 },
      reply: [L('penelope', '……墨兰托。我待她像亲生女儿。', '...Melantho. I raised her like my own daughter.')] },
  ]),
  P('owl', 3, 10, 1, 'palace_gate', [
    N('乞丐走进宫门的那一刻，格劳克斯从屋顶飞下来，落在他的手杖上，安安静静地收起了翅膀。', 'The moment the beggar steps through the gate, Glaux flies down from the roof, lands on his staff, and quietly folds its wings.'),
    L('ione', '格劳克斯从来不让别人碰的……', 'Glaux never lets anyone else touch it...', 'surprised'),
    L('beggar', '（低声）雅典娜的鸟认得雅典娜的朋友。好孩子，别作声。', '(softly) Athena\'s bird knows Athena\'s friends. Good child — say nothing.'),
    L('ione', '……我就知道，你不是普通的乞丐。', '...I knew it. You\'re no ordinary beggar.', 'smirk'),
  ], [
    { text: T('（示意伊俄涅保持安静。）', '(Signal Ione to stay quiet.)'), fx: { wits: 5 }, t: { pious: 3 },
      reply: [L('ione', '（用口型）知、道、了。', '(mouthing) Got. It.', 'smirk')] },
    { text: T('"格劳克斯，回来。"', '"Glaux, come back."'), fx: { etiquette: 3 },
      reply: [N('猫头鹰不情愿地飞回伊俄涅肩上，回头又看了乞丐一眼。', 'The owl reluctantly returns to Ione\'s shoulder, glancing back at the beggar once more.')] },
  ], { cg: 'cg_pet_owl_3', cgIone: true }),
  P('owl', 4, 12, 4, 'shore', [
    N('海边的黎明。格劳克斯一夜没睡，一直站在伊俄涅肩上，对着海面竖起羽毛。', 'Dawn at the shore. Glaux has not slept all night; it stands on Ione\'s shoulder with its feathers raised toward the sea.'),
    L('ione', '格劳克斯，如果我回到海里，你飞不过去的……', 'Glaux, if I go back into the sea, you can\'t fly there...', 'tearful'),
    N('猫头鹰用头轻轻蹭她的脸颊，咕咕叫了两声，像是在说：无论你选哪边，我都在岸上等你。', 'The owl rubs its head gently against her cheek and hoots twice, as if to say: whichever you choose, I will wait on the shore.'),
  ], [
    { text: T('（让她们好好道别。）', '(Let them say their goodbyes.)'), t: { gentle: 3 }, trust: 2,
      reply: [L('ione', '谢谢你一直陪着我。', 'Thank you for always being with me.', 'tearful')] },
  ]),

  // —— 小猎犬（阿尔戈斯的后代） ——
  P('hound', 1, 1, 3, 'palace_gate', [
    N('宫门边的粪堆旁，老猎犬阿尔戈斯身边蜷着一只小狗。它摇摇晃晃地跟在伊俄涅脚后，怎么赶也赶不走。', 'By the dung heap at the palace gate, a puppy is curled beside old Argos. It wobbles after Ione and will not be shooed away.'),
    L('eumaeus', '那是阿尔戈斯的孙子辈。这窝就剩它一只了，没人管。', 'That\'s one of Argos\'s grandpups. The only one left of the litter. No one looks after it.'),
    L('ione', '……你也没人管？那跟我一样。', '...No one looks after you either? Same as me.', 'sad'),
    N('小狗舔了舔她的手指。阿尔戈斯抬起眼睛看了看他们，又疲倦地闭上了。', 'The puppy licks her fingers. Argos lifts his eyes to look at them, then wearily closes them again.'),
    L('ione', '我叫你小阿尔戈。以后你跟着我。', 'I\'ll call you Little Argo. From now on, you\'re with me.', 'determined'),
  ], [
    { text: T('"那你得每天喂它、给它洗澡。"', '"Then you must feed and wash it every day."'), t: { depend: -3, gentle: 3 }, fx: { farming: 3 },
      reply: [L('ione', '我会的。它比墨兰托干净多了。', 'I will. It\'s much cleaner than Melantho anyway.', 'smirk')] },
    { text: T('"也给老阿尔戈斯一点吃的吧。"', '"Give old Argos something to eat too."'), t: { gentle: 5 }, trust: 3,
      reply: [L('ione', '老爷爷狗，这块肉给你。……它对我摇尾巴了！', 'Grandpa dog, this meat is for you. ...He wagged his tail at me!', 'happy')] },
  ], { cg: 'cg_pet_hound_1', cgIone: true, note: T('古希腊人很看重猎犬。荷马常用"敏捷的猎犬"来形容英雄的伙伴，大户人家的门口总有看门狗。', 'Greeks prized hunting dogs. Homer often mentions swift hounds at heroes\' sides, and great houses kept dogs at the gate.') }),
  P('hound', 2, 6, 4, 'pasture', [
    N('欧迈俄斯的三头小猪跑丢了，山上雾很大。小阿尔戈嗅了嗅地面，突然朝悬崖那边冲去。', 'Three of Eumaeus\'s piglets have strayed, and the hills are thick with fog. Little Argo sniffs the ground and suddenly bolts toward the cliffs.'),
    L('ione', '小阿尔戈！等等我！', 'Little Argo! Wait for me!', 'scared'),
    N('在悬崖边的一丛野橄榄下，小猪们挤在一起发抖。小阿尔戈守在外面，冲着雾里的什么东西低吼——是一只狐狸。', 'Under wild olives at the cliff edge the piglets huddle, trembling. Little Argo stands guard, growling at something in the fog — a fox.'),
    L('eumaeus', '好狗！真是阿尔戈斯的血统！', 'Good dog! Argos\'s blood, no doubt about it!'),
  ], [
    { text: T('"它找到了，也守住了。跟你一样。"', '"It found them and guarded them. Just like you."'), trust: 4, t: { cheer: 3 },
      reply: [L('ione', '跟我一样？……嘿嘿。', 'Like me? ...Hehe.', 'laugh')] },
    { text: T('奖励它一根骨头。', 'Reward it with a bone.'), fx: { farming: 4 }, t: { gentle: 2 },
      reply: [L('ione', '最大的那根给你！', 'The biggest one\'s for you!', 'happy')] },
  ]),
  P('hound', 3, 10, 1, 'palace_gate', [
    N('那天傍晚，小阿尔戈一直趴在老阿尔戈斯躺过的地方，不吃东西，也不叫。', 'All that evening Little Argo lies in the spot where old Argos used to lie. It will not eat, and it does not whimper.'),
    N('老乞丐从大厅里走出来时，小狗站了起来，走到他脚边坐下，抬头看着他——就像二十年前老阿尔戈斯看着主人那样。', 'When the old beggar comes out of the hall, the puppy rises, walks to his feet, sits, and looks up at him — the way old Argos looked at his master twenty years ago.'),
    L('beggar', '（声音沙哑）……好孩子。你替他守着这扇门吧。', '(hoarsely) ...Good boy. You keep this gate for him now.'),
    L('ione', '小阿尔戈……他走之前，把头靠在你身上。他知道你会接着等。', 'Little Argo... before he went, he rested his head on you. He knew you\'d keep waiting.', 'tearful'),
  ], [
    { text: T('陪伊俄涅和小阿尔戈在门口坐到天黑。', 'Sit with Ione and Little Argo at the gate until dark.'), trust: 6, t: { gentle: 6 },
      reply: [L('ione', '小阿尔戈每天都会来这里坐一会儿。我知道的。', 'Little Argo will come and sit here every day. I just know it.', 'tearful')] },
    { text: T('（抱住伊俄涅，什么也不说。）', '(Hold Ione, saying nothing.)'), trust: 8, t: { depend: 4 },
      reply: [L('ione', '……二十年。它就那样一直等。', '...Twenty years. He just kept waiting.', 'sad')] },
  ], { cg: 'cg_pet_hound_3', cgIone: true, note: T('《奥德赛》第十七卷：老狗阿尔戈斯等了主人二十年，认出了乔装的奥德修斯，摇了摇尾巴便死去了。这是史诗里最令人心碎的片段之一。', 'Odyssey Book 17: old Argos waits twenty years for his master, recognizes the disguised Odysseus, wags his tail once, and dies. It is one of the most heartbreaking moments in the epic.') }),
  P('hound', 4, 12, 4, 'shore', [
    N('黎明的海滩上，小阿尔戈紧紧咬住伊俄涅的裙角，怎么也不肯松口。', 'On the dawn shore, Little Argo clamps Ione\'s hem in its teeth and will not let go.'),
    L('ione', '小阿尔戈，放开……你不能跟我下水的。', 'Little Argo, let go... you can\'t follow me into the water.', 'tearful'),
    N('小狗呜呜地叫着，尾巴拼命摇。它在说：阿尔戈斯等了二十年，我也会等。', 'The puppy whines, tail wagging hard. It is saying: Argos waited twenty years. I will wait too.'),
  ], [
    { text: T('（摸摸小狗的头。）', '(Stroke the puppy\'s head.)'), trust: 3, t: { depend: 3 },
      reply: [L('ione', '……傻狗。', '...Silly dog.', 'tearful')] },
  ]),

  // —— 猫 ——
  P('cat', 1, 1, 3, 'kitchen', [
    N('伊俄涅藏在床底下的面包又少了一块。这回不是奶妈拿的——床底下露出一条黄色的尾巴。', 'Another loaf is missing from Ione\'s hoard under the bed. Not Nurse this time — a ginger tail sticks out from beneath it.'),
    L('ione', '小偷！……原来你也饿。', 'Thief! ...Oh. You\'re hungry too.', 'surprised'),
    L('nurse', '那是从腓尼基人的船上跑下来的猫。这东西在咱们岛上稀罕得很，抓老鼠却是一把好手。', 'That cat ran off a Phoenician ship. They\'re rare on our island, but a fine mouser.'),
    L('ione', '那我叫你艾洛。我们一人一半，不许再偷。', 'Then I\'ll call you Ailo. We\'ll split everything half and half. No more stealing.', 'smirk'),
  ], [
    { text: T('"把它留在厨房，替奶妈看着粮仓。"', '"Keep it in the kitchen to guard Nurse\'s grain store."'), fx: { farming: 3 }, t: { depend: -2 },
      reply: [L('nurse', '好吧，看在老鼠的份上。', 'Very well, for the mice\'s sake.')] },
    { text: T('"它跟你很像，都不爱被人摸。"', '"It\'s like you — doesn\'t like being touched."'), trust: 4, t: { cheer: 3 },
      reply: [L('ione', '……哼。可它让我摸了。', '...Hmph. It let me pet it, though.', 'shy')] },
  ], { cg: 'cg_pet_cat_1', cgIone: true, note: T('说实话：在荷马时代的希腊，家猫非常少见。荷马史诗里根本没有提到猫，看家抓老鼠的多半是狗、黄鼬或蛇。家猫是很久以后才从埃及传到希腊的，所以这只猫算是个"稀客"。', 'To be honest: house cats were very rare in Homeric Greece. Homer never mentions cats at all; dogs, weasels or snakes kept the mice down. Domestic cats reached Greece from Egypt much later — so this cat is a rare guest indeed.') }),
  P('cat', 2, 6, 4, 'hall', [
    N('夜里，艾洛突然从柱子上跳下来，打翻了一盏油灯。灯光照亮了角落——墨兰托正往欧律马科斯的杯子里倒王宫最好的酒。', 'At night Ailo leaps down from a pillar and knocks over an oil lamp. The light reveals a corner where Melantho is pouring the palace\'s finest wine into Eurymachus\'s cup.'),
    L('eurymachus', '该死的猫！……墨兰托，快走。', 'Cursed cat! ...Melantho, go, quickly.'),
    L('ione', '艾洛，你是故意的吧？', 'Ailo, you did that on purpose, didn\'t you?', 'smirk'),
    N('猫若无其事地舔了舔爪子。', 'The cat licks its paw as if nothing happened.'),
  ], [
    { text: T('"告诉奶妈，库房的钥匙该换了。"', '"Tell Nurse the storeroom key should be changed."'), fx: { wits: 5 }, t: { depend: -2 },
      reply: [L('nurse', '我早觉得酒少得不对劲！', 'I knew the wine was going down too fast!')] },
    { text: T('"这事先记着，以后有用。"', '"Remember this. It may be useful later."'), fx: { wits: 4 }, t: { gentle: -2 },
      reply: [L('ione', '你和艾洛一样，都很狡猾。', 'You\'re as sly as Ailo.', 'smirk')] },
  ]),
  P('cat', 3, 10, 1, 'palace_gate', [
    N('艾洛平时谁都不理，可老乞丐一坐下，它就跳到他的膝盖上，呼噜呼噜地打起了盹。', 'Ailo ignores everyone — yet the moment the old beggar sits down, it jumps into his lap and dozes off, purring.'),
    L('ione', '艾洛？……你连王子都不让碰的。', 'Ailo? ...You won\'t even let the prince touch you.', 'surprised'),
    L('beggar', '我在埃及见过很多这样的猫。那里的人把它们当神一样供着。……它闻得出我走过多远的路。', 'I saw many cats like this in Egypt. People there honor them like gods. ...It can smell how far I\'ve traveled.'),
    L('ione', '……你去过埃及？可你明明说你是克里特人。', '...You\'ve been to Egypt? But you said you were a Cretan.', 'thinking'),
  ], [
    { text: T('（不戳穿他。）', '(Don\'t expose him.)'), fx: { wits: 4 }, t: { pious: 2 },
      reply: [L('beggar', '你的门托尔很懂分寸，孩子。', 'Your Mentor knows when to hold his tongue, child.')] },
    { text: T('"让艾洛陪着客人吧。"', '"Let Ailo keep our guest company."'), t: { gentle: 4 }, trust: 2,
      reply: [N('那天夜里，艾洛一直睡在乞丐的破斗篷上。', 'That night Ailo sleeps on the beggar\'s ragged cloak.')] },
  ], { cg: 'cg_pet_cat_3', cgIone: true }),
  P('cat', 4, 12, 4, 'shore', [
    N('天还没亮，艾洛就蹲在海边最高的石头上，尾巴竖得笔直，对着海浪嘶嘶地叫。', 'Before dawn Ailo is crouched on the highest rock by the sea, tail straight up, hissing at the waves.'),
    L('ione', '你讨厌水，对不对？……可你还是跟来了。', 'You hate water, don\'t you? ...But you came anyway.', 'tearful'),
    N('猫跳下来，在她脚踝上绕了一圈又一圈，像是要用尾巴把她拴在岸上。', 'The cat jumps down and winds round her ankles again and again, as if to tie her to the land with its tail.'),
  ], [
    { text: T('（把艾洛抱起来递给她。）', '(Pick up Ailo and hand it to her.)'), trust: 3,
      reply: [L('ione', '暖暖的……', 'So warm...', 'tearful')] },
  ]),

  // —— 海豚 ——
  P('dolphin', 1, 1, 3, 'harbor', [
    N('清晨，伊俄涅偷偷跳进港口的海水里。一个灰色的影子从她身下滑过，然后——一只小海豚跃出水面，溅了她一脸水。', 'At dawn Ione sneaks into the harbor water. A grey shadow glides beneath her — then a young dolphin leaps clear and splashes her full in the face.'),
    L('ione', '哈哈哈！你……你会说话吗？', 'Hahaha! Can you... can you talk?', 'laugh'),
    N('海豚发出一串咔嗒声，用鼻子轻轻顶她的手。', 'The dolphin gives a string of clicks and nudges her hand with its beak.'),
    L('dion', '它从来不让人靠近的！伊俄涅，它认识你！', 'It never lets anyone near! Ione, it knows you!'),
    L('ione', '我叫你西摩。……我觉得我们以前见过。', 'I\'ll call you Simo. ...I think we\'ve met before.', 'thinking'),
  ], [
    { text: T('"每天早上来看它吧。"', '"Come and see it every morning."'), t: { cheer: 5 }, fx: { sailing: 4 },
      reply: [L('ione', '西摩说，明天比赛谁游得快！', 'Simo says tomorrow we race!', 'happy')] },
    { text: T('"海豚是阿波罗的使者。它来找你，一定有原因。"', '"Dolphins are Apollo\'s messengers. It sought you for a reason."'), t: { pious: 5 }, fx: { piety: 3 },
      reply: [L('ione', '原因……我也想知道。', 'A reason... I want to know too.', 'thinking')] },
  ], { cg: 'cg_pet_dolphin_1', cgIone: true, note: T('古希腊人非常喜爱海豚。传说阿波罗曾化身海豚，带领水手到德尔斐建立神庙，所以他有个称号叫"海豚神"（Delphinios）；歌手阿里翁落海时也是被海豚救起的。罗马作家老普林尼记载过一只叫"西摩"的海豚，每天驮一个男孩上学。', 'The Greeks loved dolphins. Legend says Apollo took dolphin form to lead sailors to found his temple at Delphi, earning him the title Delphinios; the singer Arion was saved from drowning by a dolphin. The Roman writer Pliny records a dolphin called Simo that carried a boy to school each day.') }),
  P('dolphin', 2, 6, 4, 'shore', [
    N('浓雾吞没了海面。狄翁的小船迷了方向，桨声在雾里显得空荡荡的。', 'Thick fog swallows the sea. Dion\'s little boat has lost its way; the oar strokes sound hollow in the mist.'),
    L('dion', '我连船头都看不见……伊俄涅，我们会撞上礁石的！', 'I can\'t even see the prow... Ione, we\'ll hit the rocks!'),
    N('一串熟悉的咔嗒声从船边传来。西摩在船头前方跃起，又落下，又跃起——像一盏会游泳的灯。', 'A familiar string of clicks comes from beside the boat. Simo leaps ahead of the prow, dives, leaps again — like a swimming lantern.'),
    L('ione', '跟着它！狄翁，跟着西摩划！', 'Follow it! Dion, row after Simo!', 'determined'),
  ], [
    { text: T('（他们平安回来后）"西摩救了你们。"', '(After they return safe) "Simo saved you."'), fx: { sailing: 6 }, t: { pious: 3 },
      reply: [L('ione', '我请它吃了一整条金枪鱼！', 'I treated it to a whole tuna!', 'happy')] },
    { text: T('（他们平安回来后）"以后起雾不许出海。"', '(After they return) "No more sailing in fog."'), t: { depend: 3 }, trust: 2,
      reply: [L('ione', '……知道啦。', '...Fine.', 'pout')] },
  ]),
  P('dolphin', 3, 10, 1, 'harbor', [
    N('那天，西摩一直在码头边游来游去，不肯离开。伊俄涅顺着它的方向望去——一个老乞丐正坐在码头上，把脚浸在海水里。', 'That day Simo keeps circling the dock and won\'t leave. Ione follows its gaze — an old beggar sits on the dock with his feet in the water.'),
    N('西摩游到乞丐脚边，轻轻碰了碰他的脚踝，然后翻了个身，露出白肚皮。', 'Simo swims to the beggar\'s feet, nudges his ankle gently, then rolls over to show its white belly.'),
    L('beggar', '海豚……我在海上漂流了十年，只有海豚从不跟我作对。', 'A dolphin... I drifted ten years on the sea, and only dolphins never turned against me.'),
    L('ione', '西摩喜欢你。它只喜欢……经历过大海的人。', 'Simo likes you. It only likes... people who\'ve been through the sea.', 'thinking'),
  ], [
    { text: T('（静静看着。）', '(Watch quietly.)'), fx: { wits: 4 },
      reply: [L('beggar', '海的女儿，带着海豚的人。你会有一个很长的故事。', 'Daughter of the sea, friend of dolphins. You will have a long story.')] },
  ], { cg: 'cg_pet_dolphin_3', cgIone: true }),
  P('dolphin', 4, 12, 4, 'shore', [
    N('巨浪升起之前，西摩先到了。它在浅滩里打转，一会儿游向深海，一会儿又游回伊俄涅脚边。', 'Before the great wave rises, Simo arrives first. It circles in the shallows — swimming toward the deep, then back to Ione\'s feet, again and again.'),
    L('ione', '西摩……你是来接我的吗？还是来留我的？', 'Simo... did you come to take me? Or to keep me?', 'tearful'),
    N('海豚抬起头看着她，发出一声长长的、柔和的鸣叫。它会陪她去任何地方——海里，或者岸边。', 'The dolphin lifts its head and gives a long, soft call. It will go with her anywhere — into the sea, or along the shore.'),
  ], [
    { text: T('"无论选哪边，西摩都会在。"', '"Whichever you choose, Simo will be there."'), trust: 3, t: { cheer: 2 },
      reply: [L('ione', '……嗯。两边都有朋友。', '...Mm. I have friends on both sides.', 'calm')] },
  ]),

  // —— 陆龟 ——
  P('tortoise', 1, 1, 3, 'agora', [
    N('集市的大路上，一只陆龟慢吞吞地爬着，一辆牛车眼看就要压过来。伊俄涅冲过去，把它抱了起来。', 'On the market road a tortoise crawls along at its own pace — and an ox-cart is about to roll over it. Ione dashes out and scoops it up.'),
    L('ione', '笨蛋！你走那么慢，还敢过大路！', 'Silly! You\'re that slow and you still cross the road!', 'angry'),
    N('陆龟伸出脑袋，眨了眨眼，一点也不着急。', 'The tortoise pokes out its head and blinks, not the least bit hurried.'),
    L('ione', '……你一点都不怕？好吧，我叫你布拉迪。意思是"慢慢的"。', '...You\'re not scared at all? Fine. I\'ll call you Brady. It means "slowly".', 'smirk'),
  ], [
    { text: T('"它慢，可它总能走到。"', '"It\'s slow, but it always gets there."'), t: { gentle: 3 }, fx: { wits: 3 },
      reply: [L('ione', '我就不行。我总想一下子跑到终点。', 'Not me. I always want to reach the end in one go.', 'thinking')] },
    { text: T('"带它回去，给它在院子里找个窝。"', '"Take it home and make it a nest in the courtyard."'), fx: { farming: 3 }, t: { depend: 2 },
      reply: [L('ione', '它住在无花果树下面，吃掉下来的果子。完美。', 'It\'ll live under the fig tree and eat the fallen fruit. Perfect.', 'happy')] },
  ], { cg: 'cg_pet_tortoise_1', cgIone: true, note: T('"龟兔赛跑"出自《伊索寓言》。伊索大约生活在公元前六世纪，比荷马晚了一两百年，所以伊俄涅还听不到这个故事——但希腊的山坡上确实到处是陆龟。', '"The Tortoise and the Hare" comes from Aesop\'s fables. Aesop lived around the 6th century BC, a century or two after Homer, so Ione could not yet have heard it — but Greek hillsides really were full of tortoises.') }),
  P('tortoise', 2, 6, 4, 'room', [
    N('射箭练了一整个月，伊俄涅还是射不中靶心。她把弓扔在地上，坐在院子里生闷气。', 'After a whole month of archery Ione still cannot hit the center. She throws the bow down and sulks in the courtyard.'),
    L('ione', '我不练了！我就是笨！', 'I quit! I\'m just stupid!', 'tearful'),
    N('布拉迪慢慢爬过来，爬了好久好久，终于把头靠在她的脚上。它嘴里还叼着她早上丢的那根箭。', 'Brady crawls over, slowly, so slowly, until at last it rests its head on her foot. In its mouth is the arrow she lost that morning.'),
    L('ione', '……你从靶场那边一路爬过来的？爬了一整天？', '...You crawled all the way from the range? All day?', 'surprised'),
  ], [
    { text: T('"你看，慢慢来，也能走到。"', '"You see — slowly, you still get there."'), trust: 4, t: { gentle: 4 }, fx: { martial: 4, stress: -6 },
      reply: [L('ione', '……好吧。明天再练。一点一点来。', '...Fine. I\'ll practice tomorrow. Little by little.', 'calm')] },
  ]),
  P('tortoise', 3, 10, 1, 'palace_gate', [
    N('宫门口热闹得很：求婚者在骂，伊罗斯在叫，乞丐被砸了一脚凳。只有布拉迪在门槛边慢慢爬着，谁也不理。', 'The palace gate is in uproar: suitors cursing, Irus shouting, the beggar struck by a footstool. Only Brady crawls slowly along the threshold, minding no one.'),
    N('乞丐低头看着陆龟，忽然笑了。', 'The beggar looks down at the tortoise and suddenly smiles.'),
    L('beggar', '孩子，你这只龟比大厅里所有人都有耐心。我也在学它，慢慢等时机。', 'Child, your tortoise has more patience than everyone in that hall. I\'m learning from it — waiting slowly for my moment.'),
    L('ione', '……你在等什么？', '...What are you waiting for?', 'thinking'),
    L('beggar', '等弓上弦的那一天。', 'For the day the bow is strung.'),
  ], [
    { text: T('（记住这句话。）', '(Remember those words.)'), fx: { wits: 5 }, t: { gentle: 2 },
      reply: [L('ione', '弓……我会记住的。', 'The bow... I\'ll remember.', 'thinking')] },
  ], { cg: 'cg_pet_tortoise_3', cgIone: true }),
  P('tortoise', 4, 12, 4, 'shore', [
    N('天还没亮，伊俄涅就跑到了海边。等她回头，才发现布拉迪也来了——它从王宫一路爬到海边，爬了整整一夜。', 'Before dawn Ione runs to the shore. When she turns around, she finds Brady has come too — crawling all the way from the palace, all night long.'),
    L('ione', '布拉迪……你这么慢，为什么还要来？', 'Brady... you\'re so slow. Why did you come?', 'tearful'),
    N('陆龟没有回答。它只是把头靠在她的脚上，像那天在院子里一样。', 'The tortoise doesn\'t answer. It just rests its head on her foot, as it did that day in the courtyard.'),
  ], [
    { text: T('"它想告诉你：别急着做决定。"', '"It\'s telling you: don\'t rush your decision."'), t: { gentle: 3 }, trust: 3,
      reply: [L('ione', '……嗯。慢慢想。', '...Mm. Think slowly.', 'calm')] },
  ]),

  // —— 小山羊 ——
  P('goat', 1, 1, 3, 'pasture', [
    N('欧迈俄斯的羊群里有只小山羊，刚出生就被母羊扔下了。它一看见伊俄涅，就"咩咩"叫着冲过来，一头撞在她膝盖上。', 'In Eumaeus\'s herd there\'s a kid whose mother abandoned it at birth. The moment it sees Ione it charges, bleating, and butts her right in the knee.'),
    L('ione', '哎哟！……你这个小坏蛋。', 'Ow! ...You little rascal.', 'pout'),
    L('eumaeus', '它在认妈妈呢！哈哈，看来它认定你了。', 'It\'s looking for a mother! Haha, looks like it\'s picked you.'),
    L('ione', '我才不是你妈妈……好吧，你叫斯基尔托。"跳跳"的意思。', 'I\'m not your mother... fine. You\'re Skirto. It means "Bouncy".', 'laugh'),
  ], [
    { text: T('"那你每天得跟欧迈俄斯学放羊。"', '"Then you\'ll learn herding from Eumaeus every day."'), fx: { farming: 5 }, t: { cheer: 3 },
      reply: [L('ione', '斯基尔托会帮我的。……大概。', 'Skirto will help me. ...Probably.', 'smirk')] },
    { text: T('"它没有妈妈，你也是。你们正好作伴。"', '"It has no mother, nor do you. You can keep each other company."'), trust: 4, t: { gentle: 4 },
      reply: [L('ione', '……嗯。我们作伴。', '...Mm. We\'ll keep each other company.', 'shy')] },
  ], { cg: 'cg_pet_goat_1', cgIone: true, note: T('山羊和绵羊是古代伊萨卡最重要的家畜。荷马说伊萨卡"适合放牧山羊"，没有养马的平原。欧迈俄斯和牧羊人墨兰提俄斯每天都要把最肥的牲口送去给求婚者。', 'Goats and sheep were the chief livestock of ancient Ithaca. Homer calls it "good for goats", with no plains for horses. Eumaeus and the goatherd Melanthius had to send their fattest animals to the suitors every day.') }),
  P('goat', 2, 6, 4, 'pasture', [
    N('夏天大旱，山上的泉水都干了，羊群渴得直叫。斯基尔托却每天下午都不见踪影，回来时嘴边湿漉漉的。', 'A summer drought dries the hillside springs, and the flock bleats with thirst. Yet every afternoon Skirto vanishes, and comes back with a wet muzzle.'),
    L('ione', '你在偷喝什么？带我去！', 'What are you drinking on the sly? Show me!', 'determined'),
    N('斯基尔托领着她爬上一道陡峭的山崖，在一块大石头后面——一眼小小的清泉正汩汩地冒着水。', 'Skirto leads her up a steep crag, and behind a great boulder — a little clear spring bubbles from the rock.'),
    L('eumaeus', '这眼泉我放了一辈子羊都没找到！小姑娘，你的羊比我还聪明！', 'I\'ve herded my whole life and never found this spring! Girl, your goat\'s cleverer than me!'),
  ], [
    { text: T('"把羊群都赶过来。"', '"Bring the whole flock up here."'), fx: { farming: 6, stamina: 3 }, t: { cheer: 3 },
      reply: [L('ione', '斯基尔托，你是英雄！', 'Skirto, you\'re a hero!', 'laugh')] },
  ]),
  P('goat', 3, 10, 1, 'eumaeus_hut', [
    N('小屋里来了个老乞丐。斯基尔托平时谁都要顶一下，却乖乖地跪在乞丐身边，让他摸自己的角。', 'An old beggar has come to the hut. Skirto, who butts everyone, kneels meekly beside him and lets him stroke its horns.'),
    L('beggar', '我小时候，在这座山上跟外公放过羊。……这里的山路，一点都没变。', 'As a boy I herded goats on this very hill with my grandfather. ...The paths here haven\'t changed at all.'),
    L('ione', '……你小时候在伊萨卡？可你说你是克里特人。', '...You were a boy on Ithaca? But you said you were a Cretan.', 'thinking'),
    L('beggar', '（笑着摇摇头）这只羊让我说漏嘴了。', '(laughing and shaking his head) This goat made me let it slip.'),
  ], [
    { text: T('（假装没听见。）', '(Pretend not to have heard.)'), fx: { wits: 5 }, t: { pious: 2 },
      reply: [L('ione', '我也什么都没听见。斯基尔托也没有。', 'I didn\'t hear anything either. Neither did Skirto.', 'smirk')] },
  ], { cg: 'cg_pet_goat_3', cgIone: true }),
  P('goat', 4, 12, 4, 'shore', [
    N('天亮前，斯基尔托跟着伊俄涅一路跳下山坡，来到海边。它站在最后一块干石头上，冲着海浪拼命地叫。', 'Before dawn Skirto bounds down the hillside after Ione to the sea. It stands on the last dry rock and bleats furiously at the waves.'),
    L('ione', '斯基尔托……山羊不会游泳的。', 'Skirto... goats can\'t swim.', 'tearful'),
    N('小山羊用角轻轻顶了顶她的手，然后转身朝山上看去——那里有果园，有小屋，有一整座岛。', 'The little goat nudges her hand with its horns, then turns to look up the hill — at the orchard, the hut, the whole island.'),
  ], [
    { text: T('"它在给你看，你在岸上拥有的一切。"', '"It\'s showing you everything you have on land."'), trust: 4, t: { depend: 3 },
      reply: [L('ione', '……我看见了。', '...I see it.', 'tearful')] },
  ]),
];

// 合并主线和宠物线：按月、周排序；同一周里，12 月第 4 周的宠物故事排在海神来临之前，其余宠物故事排在主线之后
const order = (e, i) => e.month * 100 + e.week * 10 + (e.id.startsWith('pet_') && e.month === 12 ? 0 : e.id.startsWith('pet_') ? 5 : 1) + i / 10000;
// 怪物对峙事件（js/data/monsters.js）：同一周里排在主线之后、宠物故事之前
const orderAll = (e, i) => (e.id.startsWith('mon_') ? e.month * 100 + e.week * 10 + 3 + i / 10000 : order(e, i));
export const EVENTS = [...MAIN_EVENTS, ...PET_EVENTS, ...MONSTER_EVENTS]
  .map((e, i) => [orderAll(e, i), e]).sort((a, b) => a[0] - b[0]).map(([, e]) => e);
