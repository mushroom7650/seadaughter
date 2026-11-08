// 伊俄涅的情感语音清单：每种表情有几段语音。文件在 assets/audio/voice/<zh|en>/<表情>_<n>.mp3
// 声音：MiniMax speech-02-hd，IntellectualGirl（用户在 6 个试听里选了 6 号）。是短的语气声（"哼！""嘿嘿！"），不念整句，避免和字幕对不上。
const ALL = { calm: 2, happy: 2, sad: 2, angry: 2, surprised: 2, shy: 2, thinking: 2, smirk: 2 };
export const VOICE = { zh: { ...ALL, wary: 2 }, en: { ...ALL, wary: 2 } }; // 英文：ElevenLabs Jessica，轻微法国口音
