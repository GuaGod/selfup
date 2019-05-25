/**
 * 情绪值在 0-40 为第一级
 * 情绪值在 40-60 为第二级
 * 情绪值在 60-100 为第三级
 */

function defineLevel(emotionValue) {
  let level = 1;
  emotionValue = Number(emotionValue) || 0;
  emotionValue = Math.ceil((emotionValue + 6) * 8.3);
  if (40 <= emotionValue && emotionValue < 60) {
    level = 2;
  } else if (60 <= emotionValue && emotionValue <= 100) {
    level = 3;
  }

  return function getWord() {
    let strategy = [
      ['今天情绪很些许低落呢，去跑跑步，听听音乐吧', '无法给你太多帮助，但愿意陪你一起成长，要永远相信美好的事情即将发生，笑一笑吧> <', '也许今天你觉得日子特别艰难，但是我们也可以从不愉快中收获巨大', '不开心的时候，也可以和朋友谈谈心呢。或许看到你情绪属性值的小伙伴正在为你担心呢...', '如果你觉得你的过去很辉煌，就说明你现在做的不够好'],
      ['认真的人，是会发光的', '若是心中仍有不甘，那就从现在起发奋图强', '今天也要努力成长呢，今天也是愿意陪你成长的绘时光呢', '有些人在清醒的行走，有些人在梦游', '坚持奋斗，才能对抗人生的荒谬', '不能把世界让给你所鄙视的人呢', '千万不要让你本来可以努力获得的东西因为懈怠而失去了机会'],
      ['今天看起来很开心呢 > < 绘时光页页陪你开心呢～', '认真的人，是会发光的～']
    ];

    let words = strategy[level - 1] || strategy[1];
    let length = words.length;
    let rdm = Math.ceil(Math.random() * length) - 1;
    let word = words[rdm];

    try {
      if (word.length > 34) {
        word = word.slice(0, 34) + '...'
      }
    } catch (e) {
      word = strategy[1][1];
    }
    return word;
  }
}

export {
  defineLevel
}