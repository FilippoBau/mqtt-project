class MQTTPubTaskMessage {
  constructor(type, task, taskId) {
    this.type = type;
    if (taskId) this.taskId = taskId;
    if (task) this.task = task;
  }
}

module.exports = MQTTPubTaskMessage;
