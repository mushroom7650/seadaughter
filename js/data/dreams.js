// 梦境之旅：海螺在夜里带她穿越到欧洲历史的某一刻。寓教于乐：人物、小游戏、小问答，完成后解锁服装和房间风格。
// 首个版本 4 个梦境；其余 8 个之后追加（见 docs/design.md）。
const L = (who, zh, en, face) => ({ who, text: { zh, en }, ...(face ? { face } : {}) });
const Q = (zh, en, opts, answer, why) => ({ q: { zh, en }, opts, answer, why });
const O = (zh, en) => ({ zh, en });

export const DREAMS = [
  {
    id: 'athens', month: 2, week: 4, bg: 'dream_athens', figure: 'socrates', game: 'quiz',
    title: { zh: '梦境 · 古代雅典', en: 'Dream · Ancient Athens' },
    era: { zh: '约公元前 420 年，雅典的集市', en: 'Athens, the agora, around 420 BC' },
    intro: [
      L('narrator', '海螺在枕边发出嗡嗡的声音。伊俄涅睁开眼，发现自己站在一座陌生城市的集市里，柱廊下的影子长长的。', 'The shell hums by her pillow. Ione opens her eyes in the marketplace of a strange city, the colonnade casting long shadows.'),
      L('socrates', '小姑娘，你看起来像是迷路了。那正好——迷路的人最适合提问。', 'Little one, you look lost. Good — the lost make the best questioners.'),
      L('ione', '你是谁？……你为什么光着脚？', 'Who are you? ...Why are you barefoot?', 'surprised'),
      L('socrates', '人们叫我苏格拉底。我只知道一件事：我什么都不知道。来，回答我几个问题。', 'They call me Socrates. I know only one thing: that I know nothing. Come, answer me a few questions.'),
    ],
    questions: [
      Q('苏格拉底说"我只知道我一无所知"。他想说的是？', 'Socrates says "I know that I know nothing." What does he mean?',
        [O('他真的什么都不会', 'He truly knows no skills'), O('承认无知，才会开始认真追问', 'Admitting ignorance is where real questioning begins'), O('知识没有用', 'Knowledge is useless')], 1,
        { zh: '苏格拉底用不断提问的方法（后人称"苏格拉底诘问法"）帮助别人发现自己想法里的矛盾。', en: 'Socrates questioned people step by step (the "Socratic method") to help them find the contradictions in their own ideas.' }),
      Q('苏格拉底一生写过多少本书？', 'How many books did Socrates write in his life?',
        [O('一本也没有', 'None at all'), O('三本', 'Three'), O('一百多本', 'Over a hundred')], 0,
        { zh: '他没有留下任何著作。我们今天知道的苏格拉底，主要来自学生柏拉图写的对话录。', en: "He wrote nothing. What we know of him comes mainly from the dialogues written by his student Plato." }),
      Q('"勇敢"是什么？苏格拉底会怎么做？', 'What is courage? What would Socrates do?',
        [O('直接告诉你标准答案', 'Hand you the official answer'), O('先问你的想法，再问一个例子来检验它', 'Ask your idea, then test it with an example'), O('说这个问题不重要', 'Say the question does not matter')], 1,
        { zh: '在柏拉图的《拉凯斯篇》里，苏格拉底就和两位将军讨论过"什么是勇敢"，最后谁也没有得出定论。', en: "In Plato's Laches, Socrates discusses \"what is courage?\" with two generals — and nobody reaches a final answer." }),
    ],
    outro: [L('socrates', '你问得很好。记住：一个不经过思考的人生，不值得过。', 'You asked well. Remember: the unexamined life is not worth living.')],
    reward: { outfit: 'athens', room: 'athens' }, effect: { fx: { wits: 10, eloquence: 5 } },
  },
  {
    id: 'florence', month: 5, week: 4, bg: 'dream_florence', figure: 'davinci', game: 'quiz',
    title: { zh: '梦境 · 文艺复兴的佛罗伦萨', en: 'Dream · Renaissance Florence' },
    era: { zh: '约 1500 年，佛罗伦萨的一间画室', en: 'A workshop in Florence, around 1500' },
    intro: [
      L('narrator', '满屋子都是画板、齿轮和写满反字的笔记。一个大胡子的男人正对着一幅画皱眉。', 'The room is full of easels, gears and notebooks written backwards. A bearded man frowns at a painting.'),
      L('davinci', '啊，客人！你来得正好。这幅画有个地方不对劲，我的眼睛看太久，已经看不出来了。', 'Ah, a guest! Perfect timing. Something in this painting is wrong, and my eyes have looked too long to see it.'),
      L('ione', '我？我只会看海……不过可以试试。', 'Me? I only know how to look at the sea... but I can try.', 'thinking'),
    ],
    questions: [
      Q('画一条笔直通向远方的路，两边的线条应该？', 'When you paint a straight road running into the distance, its two edges should...',
        [O('保持平行', 'Stay parallel'), O('越往远处越靠拢，最后汇成一点', 'Draw closer and meet at one point far away'), O('越往远处越分开', 'Spread apart')], 1,
        { zh: '这就是"线性透视"，那个汇聚点叫"消失点"。文艺复兴画家用它让平面的画看起来有深度。', en: 'This is linear perspective; the meeting point is the vanishing point. Renaissance painters used it to give flat pictures depth.' }),
      Q('达·芬奇的笔记为什么很难读？', "Why are Leonardo's notebooks hard to read?",
        [O('他用镜像反写，要用镜子照着读', 'He wrote in mirror script, readable in a mirror'), O('全是密码数字', 'All in numeric code'), O('他不识字', 'He could not write')], 0,
        { zh: '达·芬奇习惯用左手从右往左反着写字，留下了几千页这样的手稿。', en: 'Leonardo wrote left-handed from right to left, leaving thousands of mirror-written pages.' }),
      Q('《维特鲁威人》画的是什么？', 'What does the Vitruvian Man show?',
        [O('一位将军的肖像', "A general's portrait"), O('人体的比例，站在圆和方形里', 'Human proportions inside a circle and a square'), O('一台飞行机器', 'A flying machine')], 1,
        { zh: '这幅素描根据古罗马建筑师维特鲁威的文字，研究人体各部分的比例关系。', en: 'The drawing studies the proportions of the body, based on the writings of the Roman architect Vitruvius.' }),
    ],
    outro: [L('davinci', '你有一双好眼睛。永远不要停止观察，孩子。', 'You have good eyes. Never stop observing, child.')],
    reward: { outfit: 'florence', room: 'florence' }, effect: { fx: { wits: 6, etiquette: 6 } },
  },
  {
    id: 'vienna', month: 8, week: 4, bg: 'dream_vienna', figure: 'mozart', game: 'lyre',
    title: { zh: '梦境 · 维也纳的沙龙', en: 'Dream · A Viennese Salon' },
    era: { zh: '约 1786 年，维也纳', en: 'Vienna, around 1786' },
    intro: [
      L('narrator', '烛光、丝绸和一架会唱歌的木头箱子。一个头发扎成小辫的年轻人跳到琴凳上。', 'Candlelight, silk, and a wooden box that sings. A young man with his hair tied back hops onto the bench.'),
      L('mozart', '你会弹竖琴？太好了！我写了一段旋律，缺一个人跟上拍子。来吧，别害怕弹错！', 'You play the lyre? Wonderful! I wrote a melody and need someone to keep the beat. Come — do not be afraid of wrong notes!'),
      L('ione', '这是什么乐器……声音像下雨一样。', 'What instrument is that... it sounds like rain.', 'surprised'),
    ],
    note: { zh: '莫扎特 1756 年生于萨尔茨堡，六岁就随父亲巡回演出，1781 年定居维也纳。图中的"会唱歌的箱子"是早期钢琴，叫"古钢琴（fortepiano）"。', en: 'Mozart was born in Salzburg in 1756, toured as a child prodigy from age six, and settled in Vienna in 1781. The "singing box" is an early piano, the fortepiano.' },
    outro: [L('mozart', '哈！你的拍子比宫廷乐师还准。音乐就是这样，跟着心跳走。', 'Ha! Your timing beats the court musicians. That is music: follow your heartbeat.')],
    reward: { outfit: 'vienna', room: 'vienna' }, effect: { fx: { song: 10, etiquette: 4 } },
  },
  {
    id: 'paris', month: 11, week: 1, bg: 'dream_paris', figure: 'curie', game: 'pairs',
    title: { zh: '梦境 · 巴黎的实验室', en: 'Dream · A Paris Laboratory' },
    era: { zh: '约 1902 年，巴黎', en: 'Paris, around 1902' },
    intro: [
      L('narrator', '一间简陋的棚屋，玻璃器皿里有什么东西在黑暗中发出淡淡的蓝光。', 'A shabby shed. In the dark, something in a glass dish glows faintly blue.'),
      L('curie', '别碰那个，孩子——它很美，但也很危险。你愿意帮我整理实验记录吗？', 'Do not touch that, child — it is beautiful, but dangerous. Will you help me sort my lab notes?'),
      L('ione', '它在发光……像夜里的海。', 'It glows... like the sea at night.', 'surprised'),
    ],
    pairs: [
      [O('钋', 'Polonium'), O('以她的祖国波兰命名', 'Named after her homeland, Poland')],
      [O('镭', 'Radium'), O('在黑暗中发光的新元素', 'A new element that glows in the dark')],
      [O('沥青铀矿', 'Pitchblende'), O('她们从几吨这种矿石里提炼出镭', 'Tons of this ore yielded a speck of radium')],
      [O('1903 年', '1903'), O('第一次获得诺贝尔奖（物理学）', 'First Nobel Prize (Physics)')],
      [O('1911 年', '1911'), O('第二次获得诺贝尔奖（化学）', 'Second Nobel Prize (Chemistry)')],
      [O('放射性', 'Radioactivity'), O('这个词是她提出的', 'She coined this word')],
    ],
    outro: [L('curie', '在生活中，没有什么是可怕的，只有需要被理解的东西。', 'Nothing in life is to be feared; it is only to be understood.')],
    note: { zh: '玛丽·居里是第一位获得诺贝尔奖的女性，也是唯一在两个不同科学领域获奖的人。', en: 'Marie Curie was the first woman to win a Nobel Prize and remains the only person to win in two different sciences.' },
    reward: { outfit: 'paris', room: 'paris' }, effect: { fx: { wits: 12 } },
  },
];
export const DREAM_SPEAKERS = {
  socrates: { zh: '苏格拉底', en: 'Socrates' }, davinci: { zh: '列奥纳多·达·芬奇', en: 'Leonardo da Vinci' },
  mozart: { zh: '莫扎特', en: 'Mozart' }, curie: { zh: '玛丽·居里', en: 'Marie Curie' },
};
// 醒来后，她按性格说的感想
export const WAKE = {
  hedgehog: { zh: '……做了个怪梦。别问。', en: '...Weird dream. Do not ask.' },
  cold: { zh: '梦见了很远的地方。……挺有意思的。', en: 'I dreamed of a far place. ...It was interesting.' },
  cheerful: { zh: '你听我说！我梦见了超——厉害的人！', en: 'Listen, listen! I dreamed of someone amazing!' },
  gentle: { zh: '梦里的人对我很温柔……我想记住他说的话。', en: 'The person in my dream was kind... I want to remember what they said.' },
  stubborn: { zh: '梦里有道题我差点答错，下次一定全对。', en: 'I nearly missed a question in the dream. Next time I will get them all.' },
  clingy: { zh: '我在梦里一直在找你……醒来看到你真好。', en: 'I kept looking for you in the dream... I am glad you are here.' },
  independent: { zh: '我一个人在陌生的城市里也没迷路。', en: 'I was alone in a strange city and did not get lost.' },
  rebel: { zh: '梦里那个人也老是问问题，不过……他问得挺好的。', en: 'The man in my dream kept asking questions too. But... good ones.' },
  devout: { zh: '是雅典娜让我做这个梦的吗？', en: 'Did Athena send me that dream?' },
  calm: { zh: '海螺带我去了很远的地方，又把我送回来了。', en: 'The shell took me somewhere far away, and brought me home again.' },
};
