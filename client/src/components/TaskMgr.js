import "bootstrap/dist/css/bootstrap.min.css";
import { React } from "react";
import { Col } from "react-bootstrap/";
import "../App.css";
import ContentList from "./ContentList";
import Filters from "./Filters";
import MiniOnlineList from "./MiniOnlineList";

const TaskMgr = (props) => {
  const {
    taskList,
    filter,
    onDelete,
    onEdit,
    onComplete,
    onCheck,
    onSelect,
    refreshTasks,
    handler,
    assignedTaskList,
  } = props;

  // ** FILTER DEFINITIONS **
  const filters = {
    owned: { label: "Owned Tasks", id: "owned" },
    assigned: { label: "Assigned Tasks", id: "assigned" },
  };

  // if filter is not know apply "all"
  const activeFilter = filter && filter in filters ? filter : "owned";

  return (
    <>
      <Col sm={3} bg="light" className="d-block col-4" id="left-sidebar">
        <Filters
          items={filters}
          defaultActiveKey={activeFilter}
          onSelect={onSelect}
        />
        <MiniOnlineList/>
      </Col>
      <Col className="col-8">
        <h1 className="pb-3">
          Filter: <small className="text-muted">{activeFilter}</small>
        </h1>
        <ContentList
          tasks={taskList}
          onDelete={onDelete}
          onEdit={onEdit}
          onCheck={onCheck}
          onComplete={onComplete}
          filter={activeFilter}
          getTasks={refreshTasks}
          handler={handler}
          assignedTaskList={assignedTaskList}
        />
      </Col>
    </>
  );
};

export default TaskMgr;
