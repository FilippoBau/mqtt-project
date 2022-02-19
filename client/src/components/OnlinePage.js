import { Row, Col } from "react-bootstrap";
import { MiniOnlineList, OnlineList } from ".";
import { ConnectionContext } from "../Context/ConnectionContext";
import { useContext } from "react";

const OnlinePage = ({ ...props }) => {
  const { onlineList, ws } = useContext(ConnectionContext);

  return (
    <Row className="vheight-100">
      <Col sm={3} bg="light" className="d-block col-4" id="left-sidebar">
        <span>&nbsp;&nbsp;</span>
        <MiniOnlineList onlineList={onlineList} />
      </Col>
      <Col sm={8} className="below-nav">
        <h5>
          <strong>Online Users</strong>
        </h5>
        <div className="user">
          <OnlineList usersList={onlineList} ws={ws} />
        </div>
      </Col>
    </Row>
  );
};

export default OnlinePage;
