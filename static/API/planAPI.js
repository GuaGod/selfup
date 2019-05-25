import { REMOTE_ROOT } from './RemoteRoot.js'
const API = {
  updatePlan: REMOTE_ROOT.selfup +"/selfup/job/updateJob",
  createPlan: REMOTE_ROOT.selfup +"/selfup/job/addJob",
  hasPlan: REMOTE_ROOT.selfup +"/selfup/job/isPlan",
  getLoveThing: REMOTE_ROOT.selfup +"/selfup/job/getLoveThing",
  getDateList: REMOTE_ROOT.selfup +"/selfup/job/getDayBySelf",
  getPlanDetail: REMOTE_ROOT.selfup +"/selfup/job/getJobList",
  addLove: REMOTE_ROOT.selfup +"/selfup/job/addLove",
  getSelfMissions: REMOTE_ROOT.selfup +"/selfup/job/getThingBySelf",
  addSelfMission: REMOTE_ROOT.selfup +"/selfup/job/addSelfThing",
  finishThing: REMOTE_ROOT.selfup +"/selfup/job/finishThing",
  deleteSelfMission: REMOTE_ROOT.selfup + "/selfup/job/deleteSelfThing",
  
}

export default API