// 房间风格：每种都是一整张画好的房间（同一个房间换了布置），不再摆零散家具。每周有小加成。
const N = (zh, en) => ({ zh, en });
export const ROOMS = {
  simple: { file: 'bg_room', name: N('朴素的小屋', 'A simple room'), price: 0, bonus: {}, unlock: 'start' },
  cozy: { file: 'room_cozy', name: N('温暖的小窝', 'A cozy nest'), price: 60, bonus: { stress: -2 }, unlock: 'shop' },
  sea: { file: 'room_sea', name: N('海的宝藏', 'Sea treasures'), price: 80, bonus: { sailing: 1, stress: -1 }, unlock: 'shop' },
  weaver: { file: 'room_weaver', name: N('织布间', "A weaver's room"), price: 100, bonus: { etiquette: 2 }, unlock: 'shop' },
  archer: { file: 'room_archer', name: N('射手的角落', "An archer's corner"), price: 100, bonus: { martial: 2 }, unlock: 'shop' },
  altar: { file: 'room_altar', name: N('家中小神龛', 'A household altar'), price: 80, bonus: { piety: 2 }, unlock: 'shop' },
  athens: { file: 'room_athens', name: N('雅典马赛克房（梦境）', 'Athenian mosaic room (dream)'), price: null, bonus: { wits: 2 }, unlock: 'dream' },
  florence: { file: 'room_florence', name: N('佛罗伦萨挂毯房（梦境）', 'Florentine tapestry room (dream)'), price: null, bonus: { etiquette: 1, song: 1 }, unlock: 'dream' },
  vienna: { file: 'room_vienna', name: N('维也纳音乐室（梦境）', 'Viennese music room (dream)'), price: null, bonus: { song: 2 }, unlock: 'dream' },
  paris: { file: 'room_paris', name: N('巴黎小书房（梦境）', 'Paris study corner (dream)'), price: null, bonus: { wits: 2 }, unlock: 'dream' },
};

// 小游戏奖励：好成绩（≥60）每次都有；高分（≥85）第一次达到时解锁一件东西
export const GAME_REWARDS = {
  archery: { good: { silver: 5 }, great: { kind: 'hair', id: 'laurel', note: N('欧迈俄斯给神射手编了一顶月桂冠', 'Eumaeus weaves a laurel wreath for the sharpshooter') } },
  kitchen: { good: { item: 'honeycake' }, great: { kind: 'hair', id: 'ribbon', note: N('奶妈把自己年轻时的蓝丝带送给了她', 'Nurse gives her the blue ribbon she wore as a girl') } },
  loom: { good: { silver: 8 }, great: { kind: 'outfit', id: 'festival', note: N('她用自己织的布做了一条节日长裙', 'She sews a festival dress from cloth she wove herself') } },
  lyre: { good: { silver: 4 }, great: { kind: 'hair', id: 'flowers', note: N('听众给她戴上了花环', 'The listeners crown her with flowers') } },
  style: { good: { silver: 3 }, great: { kind: 'neck', id: 'pearls', note: N('王后夸她有眼光，送她一串珍珠', 'The queen praises her taste and gives her a pearl strand') } },
};

// 宠物：陪它玩时可能带回的小惊喜，以及亲密度到 30/60/90 时的里程碑
export const PET_FINDS = {
  owl: { item: 'flower', text: N('猫头鹰叼回来一枝开花的橄榄枝，放在她手心里。', 'The owl brings back a flowering olive sprig and drops it in her palm.') },
  hound: { silver: 6, text: N('小猎犬在院子里刨啊刨——刨出了几枚旧银币！', 'The puppy digs and digs in the yard — and turns up a few old silver coins!') },
  cat: { item: 'figs', text: N('猫从厨房偷来一串无花果，得意地放在她脚边。', 'The cat steals a bunch of figs from the kitchen and proudly sets them at her feet.') },
  dolphin: { item: 'seashell_box', text: N('海豚从海底衔上来一只漂亮的贝壳盒！', 'The dolphin brings up a pretty shell box from the seabed!') },
  tortoise: { item: 'pomegranate', text: N('陆龟慢慢地推回来一个石榴。……它推了一下午。', 'The tortoise slowly pushes a pomegranate back home. ...It took all afternoon.') },
  goat: { item: 'figs', text: N('小山羊从果园叼回来一嘴无花果，还剩几个是完整的。', 'The kid goat comes back from the orchard with a mouthful of figs — a few are still whole.') },
};
export const PET_MILESTONES = {
  30: { fx: { stress: -10 }, text: N('它学会了一个新把戏：听到她的口哨就跑过来。', 'It learned a new trick: it comes running whenever she whistles.') },
  60: { gift: { owl: ['neck', 'owl'], hound: ['hair', 'laurel'], cat: ['hair', 'ribbon'], dolphin: ['neck', 'pearls'], tortoise: ['hair', 'olive'], goat: ['hair', 'flowers'] },
        text: N('它好像想送她一件礼物——看，是一件新饰品！', 'It seems to want to give her a present — look, a new ornament!') },
  90: { trust: 5, fx: { stress: -15 }, cg: true, text: N('她和它已经形影不离。"你是我最好的朋友，"她小声说。', 'She and it are inseparable now. "You are my best friend," she whispers.') },
};
