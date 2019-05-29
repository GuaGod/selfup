function createPlanDefaultData() {
  let plan = [];
  let jobFactory = function(i) {
    return {
      "jobId": null,
      "jobName": i + '',
      "dayId": null,
      "jobClass": null,
      "thingList": [{
        "thingId": null,
        "thingName": null,
        "thingColor": null,
        "thingState": 0,
        "jobId": null,
        "user": null,
        "createTime": null,
        "lastEditTime": null,
        "dayId": null
      }, {
        "thingId": null,
        "thingName": null,
        "thingColor": null,
        "thingState": 0,
        "jobId": null,
        "user": null,
        "createTime": null,
        "lastEditTime": null,
        "dayId": null
      }],
      "createTime": null,
      "lastEditTime": null,
      "user": null
    }
  } 

  for (let i = 6; i < 24; i++) {
    plan.push(jobFactory(i));
  }

  for(let i = 0; i < 6; i++) {
    plan.push(jobFactory(i));
  }
  
  return plan;
}

export {
  createPlanDefaultData
}