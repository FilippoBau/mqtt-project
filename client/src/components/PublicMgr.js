import PublicList from "./PublicList";
import { Col } from "react-bootstrap";

const PublicMgr = (props) => {
  const { publicList, refreshPublic } = props;

  return (
    <>
      <Col className="col-8">
        <h1 className="pb-3">Public Tasks</h1>
        <PublicList tasks={publicList} getTasks={refreshPublic} />
      </Col>
    </>
  );
};

export default PublicMgr;
