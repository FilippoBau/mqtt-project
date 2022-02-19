import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Assignments, MiniOnlineList } from ".";
import API from "../API";

const AssignmentPage = ({ ...props }) => {
  const { handleErrors } = props;
  const [OwnedTaskList, setOwnedTaskList] = useState([]);
  const [userList, setUserList] = useState([]);

  const getAllOwnedTasks = () => {
    API.getAllOwnedTasks()
      .then((tasks) => {
        setOwnedTaskList(tasks);
      })
      .catch((e) => handleErrors(e));
  };

  const getUsers = () => {
    API.getUsers()
      .then((users) => {
        setUserList(users);
      })
      .catch((e) => handleErrors(e));
  };

  const assignTask = (userId, tasksId) => {
    for (var i = 0; i < tasksId.length; i++) {
      API.assignTask(Number(userId), tasksId[i]).catch((e) =>
        e.errors.forEach((err) => {
          handleErrors({ error: err.msg });
        })
      );
    }
  };

  const removeAssignTask = (userId, tasksId) => {
    for (var i = 0; i < tasksId.length; i++) {
      API.removeAssignTask(Number(userId), tasksId[i]).catch((e) =>
        handleErrors(e)
      );
    }
  };

  useEffect(() => {
    getUsers();
    getAllOwnedTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Row className="vheight-100">
      <Col sm={3} bg="light" className="d-block col-4" id="left-sidebar">
        <span>&nbsp;&nbsp;</span>
        <MiniOnlineList />
      </Col>
      <Col
        sm={8}
        bg="light"
        id="left-sidebar"
        className="collapse d-sm-block below-nav"
      >
        <Assignments
          OwnedTaskList={OwnedTaskList}
          getAllOwnedTasks={getAllOwnedTasks}
          UserList={userList}
          getUsers={getUsers}
          assignTask={assignTask}
          removeAssignTask={removeAssignTask}
        />
      </Col>
    </Row>
  );
};

export default AssignmentPage;
