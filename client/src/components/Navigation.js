import { useContext } from "react";
import { CheckAll } from "react-bootstrap-icons";
import { Button, Form, Nav, Navbar } from "react-bootstrap/";
import { Link, NavLink } from "react-router-dom";
import { UserContext } from "../Context/UserContext";

const Navigation = (props) => {
  const { logout, loggedIn, user } = useContext(UserContext);

  return (
    <Navbar bg="success" variant="dark" fixed="top">
      <Navbar.Toggle aria-controls="left-sidebar" />
      <Navbar.Brand href="/">
        <CheckAll className="mr-1" size="30" /> ToDo Manager
      </Navbar.Brand>

      <Nav className="mr-auto">
        <Nav.Link as={NavLink} to="/list/owned">
          My Tasks
        </Nav.Link>
        <Nav.Link as={NavLink} to="/public">
          {" "}
          Public Tasks
        </Nav.Link>
        <Nav.Link as={NavLink} to="/online">
          {" "}
          Online
        </Nav.Link>
        <Nav.Link as={NavLink} to="/assignment">
          {" "}
          Assignment
        </Nav.Link>
      </Nav>

      <Nav className="justify-content-end">
        <Navbar.Text className="mx-2">
          {user && user.name && `Welcome, ${user?.name}!`}
        </Navbar.Text>
        <Form inline className="mx-2">
          {loggedIn ? (
            <Button variant="outline-light" onClick={() => logout()}>
              Log Out
            </Button>
          ) : (
            <Link to="/login">
              <Button variant="light">Log In</Button>
            </Link>
          )}
        </Form>
      </Nav>
    </Navbar>
  );
};

export default Navigation;
