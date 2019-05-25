/**
 * 存储了要预加载的图片名及路径的map
 */

let publicPath = 'https://www.steins.club/selfup'
let assetsPath = new Map([
  ['chooseSex_bg', `${publicPath}/imgs/background/chooseSex_bg.png`],
  ['female', `${publicPath}/imgs/element/female.png`],
  ['male', `${publicPath}/imgs/element/male.png`],
  ['home_icon', `${publicPath}/imgs/icon/home_icon.png`],
  ['plan_icon', `${publicPath}/imgs/icon/plan_icon.png`],
  ['dairy_icon', `${publicPath}/imgs/icon/dairy_icon.png`],
  ['anaylse_icon', `${publicPath}/imgs/icon/anaylse_icon.png`],
])



export default assetsPath;