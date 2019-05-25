/**
 * 存储了所有的图片名，以及它的远程路径的map
 */

let publicPath = 'https://www.steins.club/selfup'
let assetsPath = new Map([
  ['chooseSex_bg', `${publicPath}/imgs/background/chooseSex_bg.png`],
  ['female', `${publicPath}/imgs/element/female.png`],
  ['male', `${publicPath}/imgs/element/male.png`],
  ['femaleQues', `${publicPath}/imgs/person/female/femaleQues.png`],
  ['maleQues', `${publicPath}/imgs/person/male/maleQues.png`],
  ['leftTool', `${publicPath}/imgs/element/leftTool.png`],
  ['home_icon', `${publicPath}/imgs/icon/home_icon.png`],
  ['plan_icon', `${publicPath}/imgs/icon/plan_icon.png`],
  ['dairy_icon', `${publicPath}/imgs/icon/dairy_icon.png`],
  ['anaylse_icon', `${publicPath}/imgs/icon/anaylse_icon.png`],
  ['planRight_bg', `${publicPath}/imgs/background/planRight_bg.png`],
  ['planTop_bg', `${publicPath}/imgs/background/planTop_bg.png`],
  ['quesBox', `${publicPath}/imgs/element/quesBox.png`],
])


export default assetsPath;