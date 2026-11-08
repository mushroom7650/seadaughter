// 换装：每件衣服/发饰/项链的名字、价格和风格标签（用于"搭配挑战"小游戏）。图片位置在 assets/img/wardrobe.json。
const N = (zh, en) => ({ zh, en });
export const OUTFITS = {
  chiton: { name: N('日常白袍', 'Everyday chiton'), price: 0, tags: ['daily'] },
  festival: { name: N('节日藏红花裙', 'Festival saffron peplos'), price: 45, tags: ['festival', 'bright'] },
  travel: { name: N('旅行短袍和斗篷', 'Travel tunic & cloak'), price: 35, tags: ['sea', 'practical'] },
  priestess: { name: N('祭司长袍', 'Priestess robe'), price: 50, tags: ['temple', 'elegant'] },
  huntress: { name: N('猎手短袍', "Huntress's chiton"), price: 35, tags: ['practical', 'brave'] },
  winter: { name: N('羊毛披裹', 'Wool himation'), price: 30, tags: ['warm', 'daily'] },
  athens: { name: N('雅典哲人披裹（梦境）', 'Athenian himation (dream)'), price: null, tags: ['elegant', 'wise'] },
  florence: { name: N('佛罗伦萨长裙（梦境）', 'Florentine gown (dream)'), price: null, tags: ['elegant', 'bright', 'festival'] },
  vienna: { name: N('维也纳礼裙（梦境）', 'Viennese dress (dream)'), price: null, tags: ['elegant', 'festival'] },
  paris: { name: N('巴黎实验服（梦境）', 'Paris lab coat (dream)'), price: null, tags: ['practical', 'wise'] },
};
export const HAIR = {
  shell: { name: N('贝壳发夹', 'Shell clip'), price: 0, tags: ['sea', 'daily'] },
  laurel: { name: N('月桂冠', 'Laurel wreath'), price: 15, tags: ['festival', 'brave'] },
  flowers: { name: N('花环', 'Flower crown'), price: 12, tags: ['festival', 'bright'] },
  ribbon: { name: N('蓝丝带', 'Blue ribbon'), price: 8, tags: ['daily', 'bright'] },
  diadem: { name: N('金额饰', 'Gold diadem'), price: 40, tags: ['elegant', 'temple'] },
  pearl: { name: N('珍珠发簪', 'Pearl hairpin'), price: 25, tags: ['elegant', 'sea'] },
  starfish: { name: N('海星发夹', 'Starfish pin'), price: 10, tags: ['sea', 'bright'] },
  olive: { name: N('橄榄叶发梳', 'Olive-leaf comb'), price: 14, tags: ['temple', 'daily', 'wise'] },
};
export const NECK = {
  shell: { name: N('贝壳项链', 'Shell necklace'), price: 0, tags: ['sea', 'daily'] },
  pearls: { name: N('珍珠串', 'Pearl strand'), price: 35, tags: ['elegant', 'sea'] },
  owl: { name: N('猫头鹰金坠', 'Gold owl pendant'), price: 30, tags: ['temple', 'wise'] },
  coral: { name: N('珊瑚珠', 'Coral beads'), price: 18, tags: ['bright', 'festival'] },
};
// 搭配挑战的主题
export const THEMES = [
  { id: 'apollo', name: N('阿波罗节的火把之夜', "The torchlit festival of Apollo"), want: ['festival', 'bright'] },
  { id: 'temple', name: N('去雅典娜神庙献祭', "An offering at Athena's temple"), want: ['temple', 'elegant'] },
  { id: 'voyage', name: N('跟忒勒马科斯出海', 'Sailing with Telemachus'), want: ['sea', 'practical'] },
  { id: 'market', name: N('集市日', 'Market day'), want: ['daily', 'practical'] },
  { id: 'feast', name: N('王后的宴会', "The queen's feast"), want: ['elegant', 'festival'] },
  { id: 'hunt', name: N('上山打猎', 'A hunt in the hills'), want: ['practical', 'brave'] },
  { id: 'winter', name: N('冬天的海边散步', 'A winter walk by the sea'), want: ['warm', 'sea'] },
  { id: 'study', name: N('听老师讲道理', 'A lesson with Mentor'), want: ['wise', 'daily'] },
];
// 各性格偏爱/讨厌的风格（影响她愿不愿意穿）
export const TASTE = {
  hedgehog: { like: ['practical'], dislike: ['elegant', 'bright'] },
  cold: { like: ['daily', 'wise'], dislike: ['bright'] },
  cheerful: { like: ['bright', 'festival'], dislike: [] },
  gentle: { like: ['elegant', 'daily'], dislike: ['brave'] },
  stubborn: { like: ['brave', 'practical'], dislike: ['elegant'] },
  clingy: { like: ['bright', 'warm'], dislike: [] },
  independent: { like: ['practical', 'sea'], dislike: ['elegant'] },
  rebel: { like: ['brave', 'sea'], dislike: ['temple'] },
  devout: { like: ['temple', 'elegant'], dislike: [] },
  calm: { like: ['daily', 'warm'], dislike: [] },
};
