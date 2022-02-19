import React, { useContext } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { ConnectionContext } from "../Context/ConnectionContext";

const MiniOnlineList = ({ ...props }) => {
  const { onlineList, loading } = useContext(ConnectionContext);

  const createUserItem = (user, i) => {
    return (
      <ListGroup.Item key={i}>
        <img
          src={require("../world.png").default}
          alt={"Eagle"}
          width="20"
          height="20"
        />
        {" User: " + user.userName}
      </ListGroup.Item>
    );
  };

  return (
    <>
      <ListGroup variant="flush">
        <ListGroup.Item className="p-3 mt-5 list-title">
          Online Users
        </ListGroup.Item>
        {onlineList.map((user, i) => createUserItem(user, i))}
      </ListGroup>
    </>
  );
};

export default MiniOnlineList;
