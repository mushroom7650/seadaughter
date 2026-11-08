// 按性格区分的台词：日常聊天、对周末回应的反应

export const TALK = {
  hedgehog: [
    { zh: '……你问这个干什么。', en: '...Why do you care.' },
    { zh: '别靠那么近。', en: "Don't stand so close." },
    { zh: '关你什么事。', en: 'None of your business.' },
  ],
  cold: [
    { zh: '还行。', en: 'Fine.' },
    { zh: '我在想事情，你先走吧。', en: "I'm thinking. You can go." },
    { zh: '海今天很安静。……就这样。', en: 'The sea was quiet today. ...That is all.' },
  ],
  cheerful: [
    { zh: '超好！欧迈俄斯的小猪今天差点把我撞进泥坑里！', en: "Great! One of Eumaeus's piglets nearly knocked me into the mud!" },
    { zh: '你听你听，我学会了一首新的划船歌！', en: 'Listen, listen! I learned a new rowing song!' },
    { zh: '今天的无花果特别甜，我给你留了一个！', en: 'The figs were so sweet today, I saved you one!' },
  ],
  gentle: [
    { zh: '奶妈的手又疼了，我帮她揉了好久。', en: "Nurse's hands ache again. I rubbed them for a long while." },
    { zh: '你累了吧？坐一会儿，我去倒水。', en: "You look tired. Sit, I'll fetch water." },
    { zh: '王后今晚好像哭过……我们能为她做点什么吗？', en: 'The queen seemed to have cried tonight... can we do something for her?' },
  ],
  stubborn: [
    { zh: '练了一天弓，手破了，不过我不会停的。', en: "Drew the bow all day. My hands bled, but I won't stop." },
    { zh: '那个求婚者笑我是野丫头。下次我要他笑不出来。', en: "A suitor called me a wild girl. Next time he won't be laughing." },
    { zh: '别劝我，我决定的事就要做完。', en: "Don't try to talk me out of it. I finish what I start." },
  ],
  clingy: [
    { zh: '你今天去哪儿了？我等了你一下午。', en: 'Where were you today? I waited all afternoon.' },
    { zh: '明天你也会在吧？一定会吧？', en: "You'll be here tomorrow too? Promise?" },
    { zh: '我把你的斗篷补好了……你不会嫌针脚丑吧？', en: "I mended your cloak... you won't mind the stitches?" },
  ],
  independent: [
    { zh: '我自己去码头问了价钱，比上次便宜两个银币。', en: 'I went to the docks myself and got the price down by two silver.' },
    { zh: '不用送我，我认识路。', en: "No need to walk me. I know the way." },
    { zh: '总有一天我要有自己的船。', en: 'Someday I will have a ship of my own.' },
  ],
  rebel: [
    { zh: '又是神庙？我才不要给那些神磕头。', en: "Temple again? I'm not bowing to those gods." },
    { zh: '神要是真的在看，为什么不把求婚者赶走？', en: "If the gods are watching, why don't they throw the suitors out?" },
    { zh: '规矩规矩，谁定的规矩？', en: 'Rules, rules. Who made the rules?' },
  ],
  devout: [
    { zh: '今天的祭火烧得很直，雅典娜一定听见了。', en: 'The offering fire burned straight today. Athena must have heard.' },
    { zh: '我梦见一只猫头鹰落在窗台上。', en: 'I dreamed an owl landed on the windowsill.' },
    { zh: '大海也是神的。我不怕它了。', en: "The sea belongs to the gods too. I'm not afraid of it now." },
  ],
  calm: [
    { zh: '还不错。橄榄树开花了。', en: 'Not bad. The olive trees are blooming.' },
    { zh: '我今天学了点新东西，慢慢来吧。', en: 'I learned something new today. One step at a time.' },
    { zh: '晚风很舒服，陪我坐一会儿？', en: 'The evening breeze is nice. Sit with me a while?' },
  ],
};

// 周末回应：她的反应。key: 性格 -> 回应类型
export const WEEKEND_REPLY = {
  hedgehog: {
    praise: { zh: '……哼。你想要什么？', en: '...Hmph. What do you want from me?' },
    encourage: { zh: '用不着你说。', en: "I don't need you to tell me." },
    scold: { zh: '你又不是我爹！', en: "You're not my father!" },
    silent: { zh: '（她瞥了你一眼，走开了。）', en: '(She glances at you and walks off.)' },
  },
  cold: {
    praise: { zh: '……嗯。', en: '...Mm.' },
    encourage: { zh: '知道了。', en: 'Understood.' },
    scold: { zh: '（她一言不发，攥紧了袖子。）', en: '(She says nothing, gripping her sleeve.)' },
    silent: { zh: '（两个人安静地看着海。）', en: '(The two of you watch the sea in silence.)' },
  },
  cheerful: {
    praise: { zh: '真的吗！嘿嘿，那我下周更厉害！', en: "Really?! Hehe, then I'll be even better next week!" },
    encourage: { zh: '好！包在我身上！', en: 'Okay! Leave it to me!' },
    scold: { zh: '呜……好嘛，我知道错啦。', en: "Ugh... fine, I know I messed up." },
    silent: { zh: '诶？你怎么不说话？是不是哪里不舒服？', en: "Huh? Why so quiet? Are you feeling okay?" },
  },
  gentle: {
    praise: { zh: '谢谢你……我会继续努力的。', en: "Thank you... I'll keep trying." },
    encourage: { zh: '嗯，我不会让你失望。', en: "Mm. I won't let you down." },
    scold: { zh: '对不起……是我不够好。', en: "I'm sorry... I wasn't good enough." },
    silent: { zh: '（她给你披上一件外衣，轻轻坐在旁边。）', en: '(She drapes a cloak over you and quietly sits nearby.)' },
  },
  stubborn: {
    praise: { zh: '这还不算什么。', en: "That's nothing yet." },
    encourage: { zh: '不用你说，我本来就要做到。', en: "You don't have to say it. I was going to anyway." },
    scold: { zh: '我才没错！', en: "I'm not wrong!" },
    silent: { zh: '（她哼了一声，回去继续练习。）', en: '(She huffs and goes back to practice.)' },
  },
  clingy: {
    praise: { zh: '你夸我了！我要记一辈子！', en: "You praised me! I'll remember it forever!" },
    encourage: { zh: '只要你看着，我就能做到。', en: "As long as you're watching, I can do it." },
    scold: { zh: '你……你不要讨厌我好不好？', en: "Please... please don't hate me?" },
    silent: { zh: '你是不是生我气了？', en: 'Are you angry with me?' },
  },
  independent: {
    praise: { zh: '谢了。不过我心里有数。', en: 'Thanks. But I know where I stand.' },
    encourage: { zh: '我有自己的计划。', en: 'I have my own plan.' },
    scold: { zh: '我会自己判断对错。', en: "I'll judge right and wrong for myself." },
    silent: { zh: '（她点点头，好像本来也没指望你说什么。）', en: "(She nods, as if she didn't expect you to say anything.)" },
  },
  rebel: {
    praise: { zh: '少来这套。', en: 'Spare me.' },
    encourage: { zh: '努力？给谁看？', en: 'Try harder? For whom?' },
    scold: { zh: '你骂吧，我又不怕。', en: "Go on, scold me. I'm not scared." },
    silent: { zh: '难得你不唠叨。', en: 'For once you are not nagging.' },
  },
  devout: {
    praise: { zh: '这是神的眷顾，也是你的教导。', en: 'It is the favor of the gods, and your teaching.' },
    encourage: { zh: '我会在祭坛前发誓做到。', en: 'I will vow it at the altar.' },
    scold: { zh: '我会向雅典娜忏悔的。', en: 'I will ask Athena for forgiveness.' },
    silent: { zh: '（她低声念着祈祷词。）', en: '(She murmurs a prayer.)' },
  },
  calm: {
    praise: { zh: '嗯，我也觉得这周不错。', en: 'Mm, I think it was a good week too.' },
    encourage: { zh: '好，慢慢来，一点点进步。', en: 'All right. Little by little.' },
    scold: { zh: '我会想想你说的话。', en: "I'll think about what you said." },
    silent: { zh: '（你们一起听着远处的海浪。）', en: '(Together you listen to the distant waves.)' },
  },
};
