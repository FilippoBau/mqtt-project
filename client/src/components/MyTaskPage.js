import { useContext, useEffect, useState } from "react";
import { Button, Row } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { ModalForm, TaskMgr } from ".";
import API from "../API";
import { ConnectionContext } from "../Context/ConnectionContext";
import { UserContext } from "../Context/UserContext";

const MODAL = { CLOSED: -2, ADD: -1 };

const MyTaskPage = ({ ...props }) => {
  const { handleErrors } = props;
  const {
    client,
    handler,
    taskList,
    setTaskList,
    assignedTaskList,
    loadingAss: loading,
  } = useContext(ConnectionContext);
  const { user, loggedIn } = useContext(UserContext);

  const [dirty, setDirty] = useState(true);

  const [selectedTask, setSelectedTask] = useState(MODAL.CLOSED);
  // active filter is read from the current url
  //const match = useRouteMatch("/list/:filter");
  const params = useParams();
  const history = useHistory();
  const activeFilter = (params && params.filter) ?? params.filter;

  const handleSelectFilter = (filter) => {
    history.push("/list/" + filter);
  };

  const deleteTask = (task) => {
    API.deleteTask(task)
      .then(() => setDirty(true))
      .catch((e) => handleErrors(e));
  };

  const handleEdit = (task) => {
    setSelectedTask(task.id);
  };

  const completeTask = (task) => {
    API.completeTask(task)
      .then(() => {
        setDirty(true);
      })
      .catch((e) => handleErrors(e));
  };

  const selectTask = (task) => {
    API.selectTask(task)
      .then(() => setDirty(true))
      .catch((e) => {
        handleErrors(e);
      });
  };

  const refreshTasks = (filter, page) => {
    API.getTasks(filter, page)
      .then((tasks) => {
        for (var i = 0; i < tasks.length; i++) {
          client.subscribe(String(tasks[i].id), { qos: 0, retain: true });
        }
        setTaskList(tasks);
        setDirty(false);
      })
      .catch((e) => handleErrors(e));
  };

  const findTask = (id) => {
    return taskList.find((t) => t.id === id);
  };

  // add or update a task into the list
  const handleSaveOrUpdate = (task) => {
    // if the task has an id it is an update
    if (task.id) {
      API.updateTask(task)
        .then((response) => {
          if (response.ok) {
            API.getTasks(activeFilter, localStorage.getItem("currentPage"))
              .then((tasks) => {
                setTaskList(tasks);
              })
              .catch((e) => handleErrors(e));
          }
        })
        .catch((e) => handleErrors(e));

      // otherwise it is a new task to add
    } else {
      API.addTask(task)
        .then((t) => {
          client.subscribe(String(t.id), { qos: 0, retain: true });
          setDirty(true);
        })
        .catch((e) => handleErrors(e));
    }
    setSelectedTask(MODAL.CLOSED);
  };

  const handleClose = () => {
    setSelectedTask(MODAL.CLOSED);
  };

  useEffect(() => {
    if (loggedIn) {
      API.getTasks(
        activeFilter ? activeFilter : "owned",
        activeFilter ? localStorage.getItem("currentPage") : null
      )
        .then((tasks) => {
          for (let i = 0; i < taskList.length; i++) {
            client.unsubscribe(String(taskList[i].id), {
              qos: 0,
              retain: true,
            });
          }
          for (let i = 0; i < tasks.length; i++) {
            client.subscribe(String(tasks[i].id), { qos: 0, retain: true });
          }
          setTaskList(tasks);
          //setDirty(false);
        })
        .catch((e) => {
          handleErrors(e);
          //setDirty(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter, loggedIn, user]);

  // set dirty to true only if acfiveFilter changes, if the active filter is not changed dirty = false avoids triggering a new fetch
  useEffect(() => {
    if (dirty) {
      API.getTasks(
        activeFilter ? activeFilter : "owned",
        activeFilter ? localStorage.getItem("currentPage") : null
      )
        .then((tasks) => {
          setTaskList(tasks);
          setDirty(false);
        })
        .catch((e) => {
          handleErrors(e);
          setDirty(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty]);

  useEffect(() => {
    // Unmount
    return () => {
      setTaskList((old) => {
        for (var i = 0; i < old.length; i++) {
          client.unsubscribe(String(old[i].id));
        }
        return [];
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Row className="vh-100 below-nav">
      {!loading && (
        <TaskMgr
          taskList={taskList}
          filter={activeFilter}
          onDelete={deleteTask}
          onEdit={handleEdit}
          onComplete={completeTask}
          onCheck={selectTask}
          onSelect={handleSelectFilter}
          refreshTasks={refreshTasks}
          handler={handler}
          assignedTaskList={assignedTaskList}
        />
      )}
      <Button
        variant="success"
        size="lg"
        className="fixed-right-bottom"
        onClick={() => setSelectedTask(MODAL.ADD)}
      >
        +
      </Button>
      {selectedTask !== MODAL.CLOSED && (
        <ModalForm
          task={findTask(selectedTask)}
          onSave={handleSaveOrUpdate}
          onClose={handleClose}
        />
      )}
    </Row>
  );
};

export default MyTaskPage;
