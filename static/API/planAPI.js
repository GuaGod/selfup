import { REMOTE_ROOT } from './RemoteRoot.js'
const API = {
  updatePlan: REMOTE_ROOT.selfup +"/job/updateJob",
  createPlan: REMOTE_ROOT.selfup +"/job/addJob",
  hasPlan: REMOTE_ROOT.selfup +"/job/isPlan",
  getLoveThing: REMOTE_ROOT.selfup +"/job/getLoveThing",
  getDateList: REMOTE_ROOT.selfup +"/job/getDayBySelf",
  getPlanDetail: REMOTE_ROOT.selfup +"/job/getJobList",
  addLove: REMOTE_ROOT.selfup +"/job/addLove",
  getSelfMissions: REMOTE_ROOT.selfup +"/job/getThingBySelf",
  addSelfMission: REMOTE_ROOT.selfup +"/job/addSelfThing",
  finishThing: REMOTE_ROOT.selfup +"/job/finishThing",
  deleteSelfMission: REMOTE_ROOT.selfup + "/job/deleteSelfThing",
  
}

export default API