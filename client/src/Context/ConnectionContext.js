import { createContext, useState, useEffect } from "react";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";

dayjs.extend(isToday);

const EventEmitter = require("events");
const handler = new EventEmitter();

var mqtt = require("mqtt");
var clientId = "mqttjs_" + Math.random().toString(16).substr(2, 8);
var options = {
  keepalive: 30,
  clientId: clientId,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  will: {
    topic: "WillMsg",
    payload: "Connection Closed abnormally..!",
    qos: 0,
    retain: false,
  },
  rejectUnauthorized: false,
};
var host = "ws://127.0.0.1:8080";
var client = mqtt.connect(host, options);

const url = "ws://localhost:5001";
let ws = new WebSocket(url);

export const ConnectionContext = createContext();

const ConnectionContextProvider = ({ ...props }) => {
  const { children } = props;
  // PUBLIC SUBSCRIPTION STATUS
  const [publicSub, setPublicSub] = useState(false);
  const [onlineList, setOnlineList] = useState([]);
  const [loading, setLoading] = useState(false);

  // DATA
  const [taskList, setTaskList] = useState([]);
  const [publicTasks, setPublicTasks] = useState([]);
  const [assignedTaskList, setAssignedTaskList] = useState([]);
  const [loadingPub, setLoadingPub] = useState(false);
  const [loadingAss, setLoadingAss] = useState(false);

  const dataCore = {
    taskList,
    setTaskList,
    publicTasks,
    setPublicTasks,
    setAssignedTaskList,
    setLoadingAss,
    setLoadingPub,
  };

  /************* WEB SOCKET MANAGEMENT ************/

  const messageReceived = (e) => {
    let datas = JSON.parse(e.data.toString());
    if (datas.typeMessage === "login") {
      setLoading(true);
      if (!onlineList.filter((u) => u.userId === datas.userId).length) {
        onlineList.push(datas);
        setOnlineList(onlineList);
      }
    }
    if (datas.typeMessage === "logout") {
      setLoading(true);
      for (let i = 0; i < onlineList.length; i++) {
        if (onlineList[i].userId === datas.userId) {
          onlineList.splice(i, 1);
        }
      }

      setOnlineList(onlineList);
    }
    if (datas.typeMessage === "update") {
      setLoading(true);
      let flag = 0;
      for (var i = 0; i < onlineList.length; i++) {
        if (onlineList[i].userId === datas.userId) {
          flag = 1;
          onlineList[i] = datas;
          setOnlineList(onlineList);
        }
      }
      if (flag === 0) {
        onlineList.push(datas);
        setOnlineList(onlineList);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    //WebSocket management
    ws.onopen = () => {
      ws.send("Message From Client");
      setOnlineList([]);
    };

    ws.onerror = (error) => {
      console.log(`WebSocket error: ${error}`);
    };

    ws.onmessage = (e) => {
      try {
        messageReceived(e);
      } catch (error) {
        console.log(error);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /************* MQTT MANAGEMENT ************/
  useEffect(() => {
    // Messages handler
    client.on("message", (topic, message) => {
      if (message) {
        const parsedMessage = JSON.parse(message);
        handleMqtt(topic, parsedMessage, dataCore);
      }
    });

    // Session
    client.on("error", function (err) {
      client.end();
    });

    client.on("connect", function () {
      console.log("Client connected: " + clientId);
    });

    client.on("close", function () {
      console.log(clientId + " disconnected");
    });
  }, []);

  return (
    <ConnectionContext.Provider
      value={{
        client,
        clientId,
        handler,
        taskList,
        setTaskList,
        publicTasks,
        setPublicTasks,
        publicSub,
        setPublicSub,
        assignedTaskList,
        loadingPub,
        loadingAss,
        ws,
        onlineList,
        loading,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export default ConnectionContextProvider;

const handleMqtt = (topic, parsedMessage, dataCore) => {
  const { setPublicTasks, setAssignedTaskList, setLoadingPub, setLoadingAss } =
    dataCore;
  let task;

  try {
    if (topic === "public") {
      setLoadingPub(true);
      switch (parsedMessage.type) {
        case "CREATE":
          task = Object.assign({}, parsedMessage.task, {
            deadline:
              parsedMessage.task.deadline && dayjs(parsedMessage.task.deadline),
          });

          setPublicTasks((old) => {
            if (old.length < 10) return [...old, task];
            return old;
          });

          break;
        case "UPDATE":
          task = Object.assign({}, parsedMessage.task, {
            deadline:
              parsedMessage.task.deadline && dayjs(parsedMessage.task.deadline),
          });

          setPublicTasks((old) => {
            if (old.find((t) => t.id === task.id)) {
              return [...old].map((t) => {
                if (t.id === task.id) {
                  return task;
                }
                return t;
              });
            } else {
              if (old.length < 10) {
                return [...old, task];
              }
              return old;
            }
          });
          break;
        case "REMOVE":
          const taskId = parsedMessage.taskId;

          setPublicTasks((old) => [...old].filter((t) => t.id !== taskId));
          break;
        default:
          break;
      }
      setLoadingPub(false);
    } else {
      if (parsedMessage) {
        setLoadingAss(true);
        task = parsedMessage;
        let objectStatus = {
          taskId: topic,
          userName: task.userName,
          status: task.status,
        };
        switch (task.status) {
          case "deleted":
            client.unsubscribe(topic);
            setAssignedTaskList((old) => {
              return [...old].map((t) => {
                if (t.taskId === topic) {
                  return objectStatus;
                }
                return t;
              });
            });
            break;
          case "active":
            setAssignedTaskList((old) => {
              if (old.find((t) => t.taskId === topic)) {
                return [...old].map((t) => {
                  if (t.taskId === topic) {
                    return objectStatus;
                  }
                  return t;
                });
              } else {
                return [...old, objectStatus];
              }
            });
            break;
          case "inactive":
            setAssignedTaskList((old) => {
              if (old.find((t) => t.taskId === topic)) {
                return [...old].map((t) => {
                  if (t.taskId === topic) {
                    return objectStatus;
                  }
                  return t;
                });
              } else {
                return [...old, objectStatus];
              }
            });
            break;
          default:
            break;
        }
        setLoadingAss(false);
      }
    }
  } catch (e) {
    console.log(e);
  }
};
