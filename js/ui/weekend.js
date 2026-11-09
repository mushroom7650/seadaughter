// 周末活动：每个周末两次行动（出门、小游戏、教词、送礼、陪宠物、搭配挑战），商店、换装、布置房间不占行动。
import * as G from '../game.js';
import { personalityOf } from '../data/core.js';
import { WORDS } from '../data/words.js';
import { OUTFITS, HAIR, NECK, THEMES, TASTE } from '../data/wardrobe_meta.js';
import { t } from '../i18n.js';
import * as audio from '../audio.js';
import * as MG from './minigames.js';
import { ROOMS, GAME_REWARDS } from '../data/rooms.js';

let c = null;
export function initWeekend(ctx) { c = ctx; }
const T = (zh, en) => t({ zh, en });
const L = (zh, en) => ({ zh, en });

// 她在周末活动画面里的样子：穿着你搭配的衣服
function figure(face) {
  if (c.DATA.wardrobe && c.S.look) return c.dressedHtml(c.S.look, 'ione-dressed');
  const f = face || c.moodFace();
  return `<img class="ione f-${f}" src="assets/img/ione_chiton_${f}.webp" alt="">`;
}
function apHtml() {
  return `<span class="ap" data-testid="ap">${T('周末行动', 'Weekend actions')}：${'●'.repeat(c.S.ap)}${'○'.repeat(Math.max(0, 2 - c.S.ap))}</span>`;
}
function spend() { c.S.ap = Math.max(0, c.S.ap - 1); }

// ---------- 周末菜单 ----------
export function weekendMenu() {
  const S = c.S; c.enterScene('room');
  const hasAP = S.ap > 0;
  const btn = (id, label, cost = true) => `<button data-act="${id}" data-testid="wk-${id}" ${cost && !hasAP ? 'disabled' : ''}>${c.esc(label)}${cost ? '' : ` <small>${c.esc(T('（不占行动）', '(free)'))}</small>`}</button>`;
  const anyItem = Object.values(S.items).some((n) => n > 0);
  c.html(`<div class="vn">${c.roomHtml(figure() + c.petHtml())}
    <div class="card dialogue weekend-menu" data-testid="weekend-menu">
      <div class="row between">${c.dateHtml()}${apHtml()}</div>
      <p class="muted">${c.esc(T('周末到了。你想和她做点什么？', 'The weekend is here. What would you like to do with her?'))}</p>
      <div class="grid-buttons">
        ${btn('outing', T('出门走走', 'Go out'))}
        ${btn('game', T('玩小游戏', 'Play a mini-game'))}
        ${btn('teach', T('教她一个词', 'Teach her a word'))}
        ${anyItem ? btn('gift', T('送她礼物', 'Give a gift')) : ''}
        ${G.petArrived(c.S) ? btn('pet', T('一起陪宠物玩', 'Play with the pet')) : ''}
        ${c.DATA.wardrobe ? btn('style', T('搭配挑战', 'Styling challenge')) : ''}
        ${btn('shop', T('去市集和作坊', 'Market & workshops'), false)}
        ${c.DATA.wardrobe ? btn('dress', T('换装', 'Dress up'), false) : ''}
        ${btn('room', T('换房间风格', 'Change room style'), false)}
      </div>
      <div class="row" style="margin-top:10px"><button class="primary" data-testid="end-weekend" id="b-end">${c.esc(T('结束周末', 'End the weekend'))}</button></div>
    </div></div>`);
  const go = { outing: outingMenu, game: gameMenu, teach: teachMenu, gift: giftMenu, pet: petPlay, style: styleChallenge, shop: () => shop('weaver'), dress: dressUp, room: roomEdit };
  c.on('[data-act]', (e, el) => c.show(go[el.dataset.act]));
  c.on('#b-end', () => c.endOfWeek());
}
const back = () => c.show(weekendMenu);
function backBtn(label) { return `<button data-testid="back" id="b-back">${c.esc(label || T('返回', 'Back'))}</button>`; }

// 显示一句她的反应，然后回到周末菜单
function reaction(scene, face, text, extraHtml = '', useCg = null) {
  c.playLines([{ who: 'ione', text, face }], () => back(), scene, 0, null, useCg ? { cg: useCg } : {});
  if (extraHtml) c.toast(extraHtml);
}

// ---------- 出门走走 ----------
const OUTINGS = {
  harbor: { name: L('港口', 'The harbor'), fx: { sailing: 3, stress: -6 }, lines: [
    L('船回来了！你看那条船的眼睛，画得好凶。', 'A ship is back! Look at the eyes painted on its prow — so fierce.'),
    L('我想知道，海平线那边是什么样子。', 'I wonder what it looks like beyond the horizon.'),
    L('狄翁说明天带我去看他们收网。', 'Dion says he will take me to see them haul the nets tomorrow.')] },
  agora: { name: L('集市', 'The agora'), fx: { eloquence: 3, stress: -4 }, lines: [
    L('那个卖橄榄的老头又在吹牛了，说他的橄榄是雅典来的。', 'The olive seller is boasting again — says his olives came from Athens.'),
    L('有人在讲故事！是特洛伊的木马……你听过吗？', 'Someone is telling a story! The wooden horse of Troy... have you heard it?'),
    L('这么多人，好吵。……不过不讨厌。', 'So many people, so loud. ...I do not hate it, though.')] },
  shore: { name: L('海边', 'The shore'), fx: { stress: -10 }, lines: [
    L('这里是我被冲上岸的地方。现在看，好像没那么可怕了。', 'This is where I washed ashore. It does not look so frightening now.'),
    L('我捡到一个很漂亮的贝壳，给你。', 'I found a beautiful shell. Here, for you.'),
    L('听，浪的声音……像在说话。', 'Listen to the waves... it sounds like talking.')] },
  temple: { name: L('雅典娜神庙', "Athena's temple"), fx: { piety: 3, stress: -5 }, lines: [
    L('祭坛上的烟是直直往上的。大家说这是好兆头。', 'The altar smoke rises straight up. Everyone says that is a good sign.'),
    L('那只猫头鹰又在柱子上看着我。', 'That owl is watching me from the column again.'),
    L('我替王后祈祷了。……也替你。', 'I prayed for the queen. ...And for you.')] },
  pasture: { name: L('欧迈俄斯的山坡', "Eumaeus's hillside"), fx: { farming: 3, stamina: 2, stress: -6 }, lines: [
    L('小猪又跑出来了！快帮我抓住它！', 'A piglet got out again! Help me catch it!'),
    L('欧迈俄斯说，等主人回来，他要杀最肥的猪请客。', 'Eumaeus says that when the master returns he will roast the fattest pig for a feast.'),
    L('在山顶上能看到整片海。我最喜欢这里。', 'From the hilltop you can see the whole sea. I like it here best.')] },
};
function outingMenu() {
  c.html(`<div class="card"><h3>${c.esc(T('去哪里走走？', 'Where shall we go?'))}</h3>
    <div class="place-grid">${Object.entries(OUTINGS).map(([id, o]) => `<button class="place" data-place="${id}" data-testid="place-${id}" style="background-image:url('assets/img/bg_${id}.webp')"><span>${c.esc(t(o.name))}</span></button>`).join('')}</div>
    <div class="row" style="margin-top:12px">${backBtn()}</div></div>`);
  c.on('[data-place]', (e, el) => {
    const id = el.dataset.place, o = OUTINGS[id];
    spend(); G.applyEffects(c.S, { fx: o.fx, trust: 1 });
    // 一半几率在那里遇到一件事（随机事件里场景相同的）
    const pool = G.randomEvents().filter((ev) => ev.scene === id && !c.S.randomSeen.includes(ev.id) && G.condOk(c.S, ev.cond)
      && (!ev.months || (G.monthOf(c.S.week) >= ev.months[0] && G.monthOf(c.S.week) <= ev.months[1])));
    if (pool.length && Math.random() < 0.5) { c.runEvents([pool[Math.floor(Math.random() * pool.length)]], back); return; }
    c.enterScene(id);
    reaction(id, ['happy', 'thinking', 'calm', 'smirk'][Math.floor(Math.random() * 4)], o.lines[Math.floor(Math.random() * o.lines.length)]);
  });
  c.on('#b-back', back);
}

// ---------- 小游戏 ----------
const GAMES = {
  archery: { name: L('射箭', 'Archery'), run: MG.archery, scene: 'act_archery' },
  kitchen: { name: L('做蜂蜜饼', 'Honey cakes'), run: MG.kitchen, scene: 'act_kitchen' },
  loom: { name: L('织布记忆', 'Loom memory'), run: MG.loom, scene: 'act_weave' },
  lyre: { name: L('竖琴节奏', 'Lyre rhythm'), run: MG.lyre, scene: 'act_lyre' },
};
const GAME_REACT = {
  good: [L('我做到了！你看见了吗！', 'I did it! Did you see?!'), 'happy'],
  ok: [L('还行吧……下次会更好。', 'Not bad... next time will be better.'), 'thinking'],
  bad: [L('呜……这比看起来难多了。', 'Ugh... that is much harder than it looks.'), 'pout'],
};
function gameMenu() {
  c.html(`<div class="card"><h3>${c.esc(T('玩什么？', 'Which game?'))}</h3>
    <p class="muted">${c.esc(T('60 分以上有银币或点心；第一次拿到 85 分会解锁一件新饰品或衣服。', '60+ earns silver or treats; your first 85+ unlocks a new ornament or outfit.'))}</p>
    <div class="place-grid">${Object.entries(GAMES).map(([id, g]) => {
      const R = GAME_REWARDS[id], got = c.S.gameUnlocks.includes(id);
      const prize = R && R.great ? `${rewardName(R.great)}${got ? ' ✓' : ''}` : '';
      return `<button class="place" data-game="${id}" data-testid="game-${id}" style="background-image:url('assets/img/${g.scene}.webp')"><span>${c.esc(t(g.name))}${c.S.minigameBest[id] ? ` · ${T('最高', 'best')} ${c.S.minigameBest[id]}` : ''}<br><small>🏆 85+：${c.esc(prize)}</small></span></button>`;
    }).join('')}</div>
    <div class="row" style="margin-top:12px">${backBtn()}</div></div>`);
  c.on('[data-game]', (e, el) => playGame(el.dataset.game));
  c.on('#b-back', back);
}
export function playGame(id, onEnd) {
  const g = GAMES[id];
  spend();
  c.show(() => {
    c.html(`<div class="mg-wrap"></div><div class="row" style="margin-top:8px"><button data-testid="mg-skip" id="b-skip">${c.esc(T('不玩了', 'Stop'))}</button></div>`);
    const wrap = c.app.querySelector('.mg-wrap');
    const finish = (score) => {
      MG.stopMinigame();
      const fx = G.minigameResult(c.S, id, score);
      const rw = G.gameRewards(c.S, id, score);
      const k = score >= 70 ? 'good' : score >= 40 ? 'ok' : 'bad';
      if (onEnd) { onEnd(score); return; }
      resultCard(score, fx, rw, () => reaction('room', rw.unlock ? 'laugh' : GAME_REACT[k][1], rw.unlock ? L('哇！这是给我的吗？', 'Wow! Is this for me?') : GAME_REACT[k][0]));
    };
    g.run(wrap, finish);
    c.on('#b-skip', () => finish(0));
  });
}

// 小游戏成绩单：得分、数值变化、奖励
const STAT_ZH = { stamina: ['体力', 'Stamina'], martial: ['武艺', 'Martial'], wits: ['智谋', 'Wits'], eloquence: ['口才', 'Eloquence'], sailing: ['航海', 'Sailing'], etiquette: ['礼仪', 'Etiquette'], piety: ['虔敬', 'Piety'], song: ['歌艺', 'Song'], farming: ['农牧', 'Herding'], courage: ['勇气', 'Courage'], stress: ['压力', 'Stress'] };
function rewardName(u) {
  const table = { outfit: OUTFITS, hair: HAIR, neck: NECK }[u.kind];
  return table && table[u.id] ? t(table[u.id].name) : u.id;
}
function resultCard(score, fx, rw, next) {
  const I = c.DATA.items || {};
  c.show(() => {
    const stats = Object.entries(fx).map(([k, v]) => `<span class="${(k === 'stress' ? v < 0 : v > 0) ? 'up' : 'down'}">${c.esc(t({ zh: STAT_ZH[k][0], en: STAT_ZH[k][1] }))} ${v > 0 ? '+' : ''}${v}</span>`).join(' ');
    const prizes = [rw.silver ? `${T('银币', 'Silver')} +${rw.silver}` : null, rw.item && I[rw.item] ? `${t(I[rw.item].name)} ×1` : null].filter(Boolean);
    c.html(`<div class="card note-card result-card" data-testid="game-result">
      <div class="eyebrow">${c.esc(T('成绩', 'Result'))}</div>
      <div class="big-score">${score}<small>/100</small></div>
      <p>${stats}</p>
      ${prizes.length ? `<p>🎁 ${c.esc(prizes.join(' · '))}</p>` : `<p class="muted">${c.esc(T('60 分以上会有奖励哦。', 'Score 60+ for a reward.'))}</p>`}
      ${rw.unlock ? `<div class="unlock"><img src="assets/img/${rw.unlock.kind === 'outfit' ? 'dress' : rw.unlock.kind === 'hair' ? 'acc' : 'neck'}_${rw.unlock.id}.webp" alt="" onerror="this.remove()"><div><b>${c.esc(T('解锁：', 'Unlocked: '))}${c.esc(rewardName(rw.unlock))}</b><p class="muted">${c.esc(t(rw.unlock.note))}</p></div></div>` : ''}
      <button class="primary" data-testid="next" id="b-next">${c.esc(t('next'))}</button></div>`);
    if (rw.unlock) c.app.querySelector('.unlock') && audio.sfx('ending');
    c.on('#b-next', next, 'next');
  });
}

// ---------- 教词语 ----------
function teachMenu() {
  c.html(`<div class="card"><h3>${c.esc(T('教她什么样的词？', 'What kind of word?'))}</h3>
    <p class="muted">${c.esc(T('你教的词会慢慢改变她的性格。', 'The words you teach slowly shape who she becomes.'))}</p>
    <div class="grid-buttons">${Object.entries(WORDS).map(([id, w]) => `<button data-cat="${id}" data-testid="cat-${id}">${c.esc(t(w.name))}${c.S.words[id] ? ` · ${c.S.words[id]}` : ''}</button>`).join('')}</div>
    <div class="row" style="margin-top:12px">${backBtn()}</div></div>`);
  c.on('[data-cat]', (e, el) => {
    const cat = el.dataset.cat; spend();
    const w = G.teachWord(c.S, cat);
    c.show(() => {
      c.html(`<div class="card word-card" data-testid="word-card"><div class="eyebrow">${c.esc(t(WORDS[cat].name))}</div>
        <div class="word"><b>${c.esc(w.zh)}</b><span>${c.esc(w.en)}</span></div><p class="line">${c.esc(t(w.gloss))}</p>
        <button class="primary" data-testid="next" id="b-next">${c.esc(t('next'))}</button></div>`);
      c.on('#b-next', () => reaction('room', cat === 'joke' ? 'laugh' : cat === 'brave' ? 'determined' : cat === 'home' ? 'shy' : 'thinking', WORDS[cat].reply), 'next');
    });
  });
  c.on('#b-back', back);
}

// ---------- 送礼物 ----------
const GIFT_REACT = {
  love: [L('给我的？！……我会好好收着的。', 'For me?! ...I will treasure it.'), 'tearful'],
  ok: [L('谢谢。……我很喜欢。', 'Thank you. ...I like it.'), 'shy'],
  dislike: [L('……这个，嗯，谢谢吧。', '...This. Um. Thanks, I guess.'), 'pout'],
};
function giftMenu() {
  const I = c.DATA.items || {};
  const have = Object.entries(c.S.items).filter(([id, n]) => n > 0 && I[id]);
  c.html(`<div class="card"><h3>${c.esc(T('送她什么？', 'What will you give her?'))}</h3>
    <div class="item-grid">${have.map(([id, n]) => `<button data-item="${id}" data-testid="give-${id}"><img src="assets/img/${I[id].file}" alt="" onerror="this.remove()"><span>${c.esc(t(I[id].name))} ×${n}</span></button>`).join('') || `<p class="muted">${c.esc(T('你还没有可以送的东西。去集市看看吧。', 'You have nothing to give yet. Try the market.'))}</p>`}</div>
    <div class="row" style="margin-top:12px">${backBtn()}</div></div>`);
  c.on('[data-item]', (e, el) => {
    spend();
    const r = G.giveGift(c.S, el.dataset.item, I[el.dataset.item], personalityOf(c.S)) || 'ok';
    reaction('room', GIFT_REACT[r][1], GIFT_REACT[r][0]);
  });
  c.on('#b-back', back);
}

// ---------- 陪宠物玩 ----------
const PET_PLAY = {
  owl: L('它落在我的肩膀上了！好轻……像一片羽毛。', 'It landed on my shoulder! So light... like a feather.'),
  hound: L('跑啊跑啊——哈哈，它比我还快！', 'Run, run — haha, it is faster than me!'),
  cat: L('它终于肯坐在我腿上了。别动，别吵醒它。', 'It finally sat on my lap. Do not move, do not wake it.'),
  dolphin: L('它跳起来了！它在跟我打招呼！', 'It leapt! It is saying hello to me!'),
  tortoise: L('我们比赛谁更慢。……我输了。', 'We had a race to see who is slower. ...I lost.'),
  goat: L('它把我的头绳吃掉了！你这个坏家伙！', 'It ate my hair tie! You little rascal!'),
};
const PET_ACTS = {
  feed: { name: L('喂它吃东西', 'Feed it'), line: { owl: L('它一口吞下了小鱼干，满意地眨眼。', 'It gulps the dried fish and blinks contentedly.'), hound: L('它吃得尾巴都在转圈！', 'It eats so happily its tail spins in circles!'), cat: L('它闻了闻，才慢慢吃起来。', 'It sniffs first, then eats slowly.'), dolphin: L('她把鱼抛过去，它在半空中接住了！', 'She tosses a fish and it catches it mid-air!'), tortoise: L('它慢慢咬了一口生菜……又一口。', 'It slowly bites the lettuce... and again.'), goat: L('它连她的袖子都想一起吃掉。', 'It tries to eat her sleeve along with the food.') } },
  groom: { name: L('梳毛、摸摸它', 'Groom and pet it'), line: { owl: L('它把羽毛蓬起来，像一个小毛球。', 'It fluffs its feathers into a little puffball.'), hound: L('它翻过身，把肚子露给她。', 'It rolls over and shows her its belly.'), cat: L('它发出咕噜咕噜的声音。', 'It starts to purr.'), dolphin: L('它游过来，让她摸摸光滑的脑袋。', 'It swims close and lets her stroke its smooth head.'), tortoise: L('她给它擦了擦壳，亮晶晶的。', 'She polishes its shell until it shines.'), goat: L('它用小脑袋蹭她的手。', 'It nuzzles her hand with its little head.') } },
  play: { name: L('一起玩耍', 'Play together'), line: PET_PLAY },
};
function petPlay() {
  const S = c.S;
  const big = `assets/img/pet_${S.pet}_sprite.webp`;
  c.show(() => {
    c.html(`<div class="vn">${c.roomHtml(figure('happy'))}
      <div class="card dialogue pet-play" data-testid="pet-play"><img class="pet-big sprite" src="${big}" alt="" onerror="this.onerror=null;this.classList.remove('sprite');this.src='assets/img/pet_${S.pet}_anim.webp'">
      <div><div class="speaker">${c.esc(T('和它做什么？', 'What will you do with it?'))}</div>
      <div class="love" data-testid="pet-love"><span>${c.esc(T('亲密度', 'Bond'))}</span><span class="track"><i style="width:${S.petLove}%"></i></span><b>${S.petLove}</b></div>
      <p class="muted">${c.esc(T('亲密度到 30、60、90 会有惊喜。玩耍时它也可能带回小礼物。', 'Surprises await at bond 30, 60 and 90. It may also bring back little gifts.'))}</p>
      <div class="grid-buttons">${Object.entries(PET_ACTS).map(([k, a]) => `<button data-pact="${k}" data-testid="pact-${k}">${c.esc(t(a.name))}</button>`).join('')}</div>
      <div class="row" style="margin-top:8px">${backBtn()}</div></div></div></div>`);
    c.on('[data-pact]', (e, el) => {
      const kind = el.dataset.pact; spend();
      const out = G.playWithPet(S, kind);
      const lines = [{ who: 'ione', text: PET_ACTS[kind].line[S.pet] || PET_ACTS.play.line.cat, face: kind === 'play' ? 'laugh' : 'happy' }];
      if (out.find) { lines.push({ who: 'narrator', text: out.find.text }); }
      const after = () => (out.milestone ? milestone(out.milestone) : back());
      c.playLines(lines, after, 'room');
      if (out.find) setTimeout(() => audio.sfx('coin'), 300);
    });
    c.on('#b-back', back);
  });
}
// 亲密度里程碑：30 学会把戏，60 送一件饰品，90 最好的朋友（配宠物插图）
function milestone(m) {
  const S = c.S;
  audio.sfx('ending');
  c.show(() => {
    const cg = m.cg ? `cg_pet_${S.pet}_1` : null;
    c.html(`<div class="vn">${cg ? c.sceneHtml('room', null, '', { cg }) : c.roomHtml(figure('laugh') + c.petHtml())}
      <div class="card dialogue" data-testid="pet-milestone"><div class="eyebrow">${c.esc(T('亲密度', 'Bond'))} ${m.level} ♥</div>
      <p class="line">${c.esc(t(m.text))}</p>
      ${m.gift ? `<div class="unlock"><img src="assets/img/${m.gift.kind === 'hair' ? 'acc' : 'neck'}_${m.gift.id}.webp" alt="" onerror="this.remove()"><b>${c.esc(T('得到：', 'Received: '))}${c.esc(rewardName(m.gift))}</b></div>` : ''}
      <button class="primary" data-testid="next" id="b-next">${c.esc(t('next'))}</button></div></div>`);
    c.on('#b-next', back, 'next');
  });
}

// ---------- 商店：织工、工匠、市集、神庙、医者 ----------
const SHOPS = {
  weaver: { name: L('织工铺', "Weaver's stall"), help: L('衣服、发饰和项链。', 'Clothes, hair ornaments and necklaces.') },
  craftsman: { name: L('木匠和装饰', 'Carpenter & decor'), help: L('把她的房间重新布置成另一种风格。每种风格每周有小加成。', 'Redecorate her room in a new style. Each style gives a small weekly bonus.') },
  market: { name: L('集市', 'Market'), help: L('点心和小礼物。', 'Treats and small gifts.') },
  temple: { name: L('神庙', 'Temple'), help: L('护身符和祭品。', 'Charms and offerings.') },
  healer: { name: L('医者', 'Healer'), help: L('草药能让她放松，减轻压力。', 'Herbs help her relax and ease stress.') },
};
function shop(tab) {
  const S = c.S, I = c.DATA.items || {}, F = c.DATA.furniture || {};
  let goods = [];
  if (tab === 'weaver') {
    const add = (kind, table, label) => Object.entries(table).forEach(([id, v]) => {
      if (v.price && !S.closet[kind].includes(id) && (kind !== 'outfit' || (c.DATA.wardrobe?.outfits || {})[id])) goods.push({ kind, id, name: `${label} · ${t(v.name)}`, price: v.price, img: kind === 'outfit' ? null : `assets/img/${kind === 'hair' ? 'acc' : 'neck'}_${id}.webp` });
    });
    add('outfit', OUTFITS, T('衣服', 'Outfit')); add('hair', HAIR, T('发饰', 'Hair')); add('neck', NECK, T('项链', 'Necklace'));
  } else if (tab === 'craftsman') {
    goods = Object.entries(ROOMS).filter(([id, r]) => r.unlock === 'shop' && !S.roomsOwned.includes(id)).map(([id, r]) => ({ kind: 'room', id, name: `${t(r.name)} (${bonusText(r.bonus)})`, price: r.price, img: `assets/img/${r.file}.webp`, wide: true }));
  } else {
    const kinds = { market: ['gift', 'food'], temple: ['charm'], healer: ['medicine'] }[tab];
    goods = Object.entries(I).filter(([, it]) => kinds.includes(it.kind)).map(([id, it]) => ({ kind: 'item', id, name: t(it.name), price: it.price, img: `assets/img/${it.file}`, have: S.items[id] || 0 }));
  }
  c.html(`<div class="card shop" data-testid="shop">
    <div class="tabs">${Object.entries(SHOPS).map(([id, s]) => `<button data-tab="${id}" class="${id === tab ? 'selected' : ''}" data-testid="tab-${id}">${c.esc(t(s.name))}</button>`).join('')}</div>
    <p class="muted">${c.esc(t(SHOPS[tab].help))} · ${c.esc(t('silver'))}：<b data-testid="silver">${S.silver}</b></p>
    <div class="item-grid">${goods.map((g, k) => `<button data-k="${k}" data-testid="buy-${g.id}" ${S.silver < g.price ? 'disabled' : ''}>
      ${g.img ? `<img class="${g.wide ? 'wide' : ''}" src="${g.img}" alt="" onerror="this.remove()">` : ''}<span>${c.esc(g.name)}${g.have ? ` (${g.have})` : ''}</span><b>${g.price}</b></button>`).join('') || `<p class="muted">${c.esc(T('这里的东西你都买过了。', 'You have bought everything here.'))}</p>`}</div>
    <div class="row" style="margin-top:12px">${backBtn()}</div></div>`);
  c.on('[data-tab]', (e, el) => c.show(() => shop(el.dataset.tab)));
  c.on('[data-k]', (e, el) => {
    const g = goods[+el.dataset.k];
    if (G.buy(S, g.price, g.kind, g.id)) {
      audio.sfx('coin');
      // 买了房间风格就直接换上，并说明每周加成
      if (g.kind === 'room') { S.room = g.id; c.toast(T(`已经布置好了：${t(ROOMS[g.id].name)}。每周 ${bonusText(ROOMS[g.id].bonus)}`, `Room redecorated: ${t(ROOMS[g.id].name)}. Weekly ${bonusText(ROOMS[g.id].bonus)}`)); }
      else c.toast(T(`买下了：${g.name}`, `Bought: ${g.name}`));
      c.show(() => shop(tab));
    }
  }, null);
  c.on('#b-back', back);
}

// ---------- 换装 ----------
let draft = null;
function lookTags(look) { return [...(OUTFITS[look.outfit]?.tags || []), ...(HAIR[look.hair]?.tags || []), ...(NECK[look.neck]?.tags || [])]; }
function tasteOf(look) {
  const taste = TASTE[personalityOf(c.S)] || { like: [], dislike: [] };
  const tags = lookTags(look);
  const score = tags.filter((x) => taste.like.includes(x)).length - tags.filter((x) => taste.dislike.includes(x)).length;
  return score > 0 ? 'like' : score < 0 ? 'dislike' : 'ok';
}
function wardrobeRows(look) {
  const S = c.S, W = c.DATA.wardrobe;
  const row = (kind, table, label) => `<div class="wr"><b>${c.esc(label)}</b><div class="chips">${S.closet[kind].filter((id) => kind !== 'outfit' || W.outfits[id]).map((id) =>
    `<button data-kind="${kind}" data-id="${id}" data-testid="wear-${kind}-${id}" class="${look[kind] === id ? 'selected' : ''}">${kind !== 'outfit' ? `<img src="assets/img/${kind === 'hair' ? 'acc' : 'neck'}_${id}.webp" alt="" onerror="this.remove()">` : ''}${c.esc(t(table[id].name))}</button>`).join('')}</div></div>`;
  return row('outfit', OUTFITS, T('衣服', 'Outfit')) + row('hair', HAIR, T('发饰', 'Hair')) + row('neck', NECK, T('项链', 'Necklace'));
}
function dressUp() {
  draft = draft || { ...c.S.look };
  c.html(`<div class="dress-screen" data-testid="dress">
    <div class="dress-stage">${c.roomHtml(c.dressedHtml(draft, 'ione-dressed'))}</div>
    <div class="card">${wardrobeRows(draft)}
      <p class="muted">${c.esc(T('衣柜里的新衣服可以在织工铺买到，梦境之旅也会带回特别的衣服。', 'Buy new clothes at the weaver; dream journeys bring back special outfits.'))}</p>
      <div class="row">${backBtn(T('不换了', 'Cancel'))}<button class="primary" data-testid="wear" id="b-wear">${c.esc(T('就穿这身', 'Wear this'))}</button></div></div></div>`);
  c.on('[data-kind]', (e, el) => { draft[el.dataset.kind] = el.dataset.id; c.show(dressUp); });
  c.on('#b-back', () => { draft = null; back(); });
  c.on('#b-wear', () => {
    const r = tasteOf(draft); c.S.look = { ...draft }; draft = null;
    const R = { like: [L('这身好看！我喜欢。', 'This looks nice! I like it.'), 'happy'], ok: [L('嗯，就这样吧。', 'Mm, this will do.'), 'calm'], dislike: [L('……一定要穿这个吗？', '...Do I really have to wear this?'), 'pout'] }[r];
    if (r === 'like') G.applyEffects(c.S, { trust: 1, fx: { stress: -3 } });
    reaction('room', R[1], R[0]);
  });
}
// 搭配挑战：给一个场合，按风格标签打分
function styleChallenge() {
  spend();
  const theme = THEMES[Math.floor(Math.random() * THEMES.length)];
  draft = { ...c.S.look };
  const render = () => {
    c.html(`<div class="dress-screen" data-testid="style">
      <div class="dress-stage">${c.roomHtml(c.dressedHtml(draft, 'ione-dressed'))}</div>
      <div class="card"><div class="eyebrow">${c.esc(T('搭配挑战', 'Styling challenge'))}</div><h3>${c.esc(t(theme.name))}</h3>
        <p class="muted">${c.esc(T('为这个场合给她搭配一身。风格越合适，分数越高。', 'Dress her for this occasion. The better the match, the higher the score.'))}</p>
        ${wardrobeRows(draft)}
        <div class="row"><button class="primary" data-testid="style-done" id="b-done">${c.esc(T('就这身！', 'This one!'))}</button></div></div></div>`);
    c.on('[data-kind]', (e, el) => { draft[el.dataset.kind] = el.dataset.id; render(); });
    c.on('#b-done', () => {
      const tags = lookTags(draft);
      const hit = theme.want.reduce((n, w) => n + tags.filter((x) => x === w).length, 0);
      const score = Math.min(100, 25 + hit * 20);
      c.S.look = { ...draft }; draft = null;
      G.minigameResult(c.S, 'style', score);
      const taste = tasteOf(c.S.look);
      c.toast(`${T('搭配得分', 'Style score')} ${score}`);
      const R = score >= 65 ? [L('大家都在看我……是不是太显眼了？嘿嘿。', 'Everyone is looking at me... too much? Hehe.'), taste === 'dislike' ? 'shy' : 'happy']
        : [L('好像不太合适……下次我自己挑！', 'Not quite right... next time I pick!'), 'pout'];
      reaction('room', R[1], R[0]);
    });
  };
  c.show(render);
}

// ---------- 房间风格 ----------
function bonusText(b) {
  return Object.entries(b || {}).map(([k, v]) => `${t({ zh: STAT_ZH[k][0], en: STAT_ZH[k][1] })}${v > 0 ? '+' : ''}${v}`).join(' ') || T('无加成', 'no bonus');
}
function roomEdit() {
  const S = c.S;
  c.html(`<div class="card" data-testid="room-edit"><h3>${c.esc(T('她的房间', 'Her room'))}</h3>
    <p class="muted">${c.esc(T('点一个风格就换上。每周加成写在名字下面。新的风格在"木匠和装饰"买，梦境之旅也会带回特别的房间。', 'Tap a style to switch. The weekly bonus is under each name. Buy new styles from the carpenter; dream journeys bring special rooms.'))}</p>
    <div class="room-grid">${Object.entries(ROOMS).map(([id, r]) => {
      const own = S.roomsOwned.includes(id);
      return `<button class="room-card ${S.room === id ? 'selected' : ''}" data-room="${id}" data-testid="room-${id}" ${own ? '' : 'disabled'}>
        <span class="thumb" style="background-image:url('assets/img/${r.file}.webp')"></span>
        <b>${c.esc(t(r.name))}${S.room === id ? ' ✓' : ''}</b><small>${own ? c.esc(bonusText(r.bonus)) : c.esc(r.unlock === 'dream' ? T('梦境之旅解锁', 'Unlocked by a dream') : `${T('木匠', 'Carpenter')} · ${r.price}`)}</small></button>`;
    }).join('')}</div>
    <div class="row" style="margin-top:12px">${backBtn(T('好了', 'Done'))}</div></div>`);
  c.on('[data-room]', (e, el) => { S.room = el.dataset.room; c.show(roomEdit); });
  c.on('#b-back', back);
}
