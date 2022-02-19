import { useContext, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { MiniOnlineList, PublicMgr } from ".";
import API from "../API";
import { ConnectionContext } from "../Context/ConnectionContext";

const PublicTaskPage = ({ ...props }) => {
  const { handleErrors } = props;
  //const [publicTasks, setPublicTasks] = useState([]);
  const {
    client,
    publicSub,
    setPublicSub,
    publicTasks,
    setPublicTasks,
    loadingPub: loading,
  } = useContext(ConnectionContext);

  const refreshPublic = (page) => {
    API.getPublicTasks(page)
      .then((tasks) => {
        setPublicTasks(tasks);
      })
      .catch((e) => handleErrors(e));
  };

  const getPublicTasks = () => {
    API.getPublicTasks()
      .then((tasks) => {
        //if (!publicSub) {

        client.subscribe("public", { qos: 0, retain: true });
        setPublicTasks(tasks);
        setPublicSub(true);
        //}
      })
      .catch((e) => handleErrors(e));
  };

  useEffect(() => {
    getPublicTasks();
    return () => {
      client.unsubscribe("public");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {!loading && (
        <Row className="vheight-100">
          <Col sm={3} bg="light" className="d-block col-4" id="left-sidebar">
            <span>&nbsp;&nbsp;</span>
            <MiniOnlineList />
          </Col>
          <Col className="col-8">
            <Row className="vh-100 below-nav">
              <PublicMgr
                publicList={publicTasks}
                refreshPublic={refreshPublic}
              />
            </Row>
          </Col>
        </Row>
      )}
    </>
  );
};

export default PublicTaskPage;
