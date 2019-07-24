import { REMOTE_ROOT } from './RemoteRoot.js'
const API = {
  listFriends: REMOTE_ROOT.selfup +"/social/listFriends",
  visitFriend: REMOTE_ROOT.selfup +"/social/visitFriend",
  isFriendAdd: REMOTE_ROOT.selfup +"/social/isFriendAdd",
  refuseFriend: REMOTE_ROOT.selfup +"/social/refuseFriend",
  acceptFriend: REMOTE_ROOT.selfup +"/social/acceptFriend",
  deleteFriend: REMOTE_ROOT.selfup +"/social/deleteFriends",
  findFriend: REMOTE_ROOT.selfup +"/social/findFriend",
  addFriend: REMOTE_ROOT.selfup +"/social/addFriend",
  refuse: REMOTE_ROOT.selfup + "/social/refuseFriend",
  apply: REMOTE_ROOT.selfup + "/social/acceptFriend",
  listMessage: REMOTE_ROOT.selfup + '/social/listMessage',
  deleteMessage: REMOTE_ROOT.selfup + '/social/deleteMessage',
  getMessage: REMOTE_ROOT.selfup + '/social/getMessage',
  addMessage: REMOTE_ROOT.selfup + '/social/addMessage',
}

export default API