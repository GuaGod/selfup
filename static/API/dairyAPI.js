import { REMOTE_ROOT } from './RemoteRoot.js'
const API = {
  isEmotionExist: REMOTE_ROOT.selfup +'/emotion/isEmotionExist',
  insertEmotionText: REMOTE_ROOT.selfup +'/emotion/insertEmotionText',
  findEmotionContent: REMOTE_ROOT.selfup +'/emotion/findEmotionContent',
  getEmotionDetail: REMOTE_ROOT.selfup +'/emotion/getEmotionDetail',
  updateEmotionText: REMOTE_ROOT.selfup +'/emotion/updateEmotionText',
  deleteEmotion: REMOTE_ROOT.selfup + '/emotion/deleteEmotion'
}

export default API