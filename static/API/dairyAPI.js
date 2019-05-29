import { REMOTE_ROOT } from './RemoteRoot.js'
const API = {
  isEmotionExist: REMOTE_ROOT.selfup +'/selfup/emotion/isEmotionExist',
  insertEmotionText: REMOTE_ROOT.selfup +'/selfup/emotion/insertEmotionText',
  findEmotionContent: REMOTE_ROOT.selfup +'/selfup/emotion/findEmotionContent',
  getEmotionDetail: REMOTE_ROOT.selfup +'/selfup/emotion/getEmotionDetail',
  updateEmotionText: REMOTE_ROOT.selfup +'/selfup/emotion/updateEmotionText',
  deleteEmotion: REMOTE_ROOT.selfup + '/selfup/emotion/deleteEmotion'
}

export default API