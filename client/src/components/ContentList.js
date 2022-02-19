import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isTomorrow from "dayjs/plugin/isTomorrow";
import isYesterday from "dayjs/plugin/isYesterday";
import { useEffect, useState } from "react";
import {
  ChevronDoubleLeft,
  PencilSquare,
  PersonSquare,
  Trash,
} from "react-bootstrap-icons";
import { Button, Form, ListGroup } from "react-bootstrap/";
import Pagination from "react-js-pagination";

dayjs.extend(isYesterday).extend(isToday).extend(isTomorrow);

const formatDeadline = (d) => {
  if (!d) return "--o--";
  else if (d.isToday()) {
    return d.format("[Today at] HH:mm");
  } else if (d.isTomorrow()) {
    return d.format("[Tomorrow at] HH:mm");
  } else if (d.isYesterday()) {
    return d.format("[Yesterday at] HH:mm");
  } else {
    return d.format("dddd DD MMMM YYYY [at] HH:mm");
  }
};

const TaskRowData = (props) => {
  const { task, onCheck, filter, assignedTaskList } = props;
  //const [deletedTasks, setDeletedTasks] = useState();
  const labelClassName = `${task.important ? "important" : ""} ${
    task.completed ? "completed" : ""
  }`;

  const [assignedUser, setAssignedUser] = useState("");
  const [deletedIds, setDeletedIds] = useState([]);

  useEffect(() => {
    const activeUser = assignedTaskList.filter(
      (t) => t.status === "active" && parseInt(t.taskId) === parseInt(task.id)
    )[0];
    const user = activeUser ? activeUser.userName : "";
    const ids = assignedTaskList
      .filter((t) => t.status === "deleted")
      .map((t) => parseInt(t.taskId));
    setAssignedUser(user);
    setDeletedIds(ids);
  }, [assignedTaskList]);

  return (
    <>
      <div className="flex-fill m-auto">
        <Form.Group className="m-0" controlId="formBasicCheckbox">
          <Form.Check type="checkbox">
            {filter === "assigned" ? (
              <Form.Check.Input
                type="radio"
                checked={task.active}
                disabled={task.active}
                onChange={(ev) => onCheck(ev.target.checked)}
              />
            ) : null}
            <Form.Check.Label className={labelClassName}>
              {task.description}
            </Form.Check.Label>
          </Form.Check>
        </Form.Group>
      </div>
      {assignedUser !== "" ? (
        <div className="flex-fill mx-2 m-auto">
          <span
            style={
              false
                ? { border: "0px solid blue" }
                : { border: "1px solid blue" }
            }
          >
            {assignedUser}
          </span>
        </div>
      ) : null}
      <div className="flex-fill mx-2 m-auto">
        <PersonSquare className={task.private ? "invisible" : ""} />
      </div>
      <div className="flex-fill m-auto">
        <small>{formatDeadline(task.deadline)}</small>
      </div>
    </>
  );
};

const TaskRowControl = (props) => {
  const { task, onDelete, onEdit, onComplete, filter } = props;
  return (
    <>
      <div className="ml-10">
        {filter === "owned" ? (
          [
            <Button variant="link" className="shadow-none" onClick={onEdit}>
              <PencilSquare />
            </Button>,
            <Button variant="link" className="shadow-none" onClick={onDelete}>
              <Trash />
            </Button>,
          ]
        ) : task.completed ? (
          <Button variant="success" className="shadow-none" disabled>
            Completed
          </Button>
        ) : (
          <Button
            variant="success"
            className="shadow-none"
            onClick={onComplete}
          >
            Complete
          </Button>
        )}
      </div>
    </>
  );
};

const ContentList = (props) => {
  const {
    tasks,
    onDelete,
    onEdit,
    onCheck,
    onComplete,
    filter,
    getTasks,
    handler,
    assignedTaskList,
  } = props;

  // handle change event
  const handlePageChange = (pageNumber) => {
    getTasks(filter, pageNumber);
  };

  return (
    <>
      <ListGroup as="ul" variant="flush">
        {tasks.map((t) => {
          return (
            <ListGroup.Item
              as="li"
              key={t.id}
              className="d-flex w-100 justify-content-between"
            >
              <TaskRowData
                task={t}
                onCheck={(flag) => onCheck(t, flag)}
                filter={filter}
                handler={handler}
                assignedTaskList={assignedTaskList}
              />
              <TaskRowControl
                task={t}
                onDelete={() => onDelete(t)}
                onEdit={() => onEdit(t)}
                onComplete={() => onComplete(t)}
                filter={filter}
              />
            </ListGroup.Item>
          );
        })}
      </ListGroup>
      <Pagination
        itemClass="page-item" // add it for bootstrap 4
        linkClass="page-link" // add it for bootstrap 4
        activePage={localStorage.getItem("currentPage")}
        itemsCountPerPage={
          localStorage.getItem("totalItems") /
          localStorage.getItem("totalPages")
        }
        totalItemsCount={localStorage.getItem("totalItems")}
        pageRangeDisplayed={10}
        onChange={handlePageChange}
        pageSize={localStorage.getItem("totalPages")}
      />
    </>
  );
};

export default ContentList;