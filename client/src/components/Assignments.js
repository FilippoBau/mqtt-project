import React, { useState } from "react";
import _ from "lodash";
import { Dropdown } from "semantic-ui-react";
import Button from "react-bootstrap/Button";

const Assignments = (props) => {
  let { OwnedTaskList, UserList, assignTask, removeAssignTask } = props;
  const [tasksArray, setTasksArray] = useState([]);
  const [userId, setUserId] = useState("");

  const usersOptions = _.map(UserList, (id, index) => ({
    key: UserList[index].userId,
    text: UserList[index].userName,
    value: UserList[index].userId,
  }));

  const clearAll = () => {
    setTasksArray([]);
    setUserId("");
  };

  function assignUsers() {
    if (userId !== "" && parseInt(userId) >= 0 && tasksArray.length) {
      assignTask(userId, tasksArray);
      clearAll();
    }
  }

  function removeAssignUser() {
    if (userId !== "" && parseInt(userId) >= 0 && tasksArray.length) {
      removeAssignTask(userId, tasksArray);
      clearAll();
    }
  }

  const handleUsersDropdown = (e, { value }) => {
    setUserId(value);
  };

  const handleTasksDropdown = (e, { value }) => {
    setTasksArray(value);
  };

  const stateOptions = _.map(OwnedTaskList, (id, index) => ({
    key: OwnedTaskList[index].id,
    text: OwnedTaskList[index].description,
    value: OwnedTaskList[index].id,
  }));

  return (
    <div>
      <h1>Assign and Remove Tasks</h1>
      <Dropdown
        placeholder="Users"
        fluid
        clearable
        selection
        options={usersOptions}
        onChange={handleUsersDropdown}
      />
      <Dropdown
        placeholder="Tasks"
        fluid
        multiple
        clearable
        selection
        options={stateOptions}
        onChange={handleTasksDropdown}
      />
      <Button
        onClick={assignUsers}
        variant="success"
        size="lg"
        className="fixed-right"
      >
        Assign tasks to the user
      </Button>
      <Button
        onClick={removeAssignUser}
        variant="success"
        size="lg"
        className="fixed-right2"
      >
        Remove tasks to the user
      </Button>
    </div>
  );
};

const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href =
  "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);

export default Assignments;
