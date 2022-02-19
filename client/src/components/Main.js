import "bootstrap/dist/css/bootstrap.min.css";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import { React, useContext, useState } from "react";
import { Container, Row, Toast } from "react-bootstrap/";
import { Redirect, Route, Switch } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Navigation } from ".";
import "../App.css";
import { UserContext } from "../Context/UserContext";
import AssignmentPage from "./AssignmentPage";
import LoginPage from "./Loginpage";
import MyTaskPage from "./MyTaskPage";
import OnlinePage from "./OnlinePage";
import PublicTaskPage from "./PublicTaskPage";

dayjs.extend(isToday);

const Main = () => {
  const { loggedIn, user, logout, login } = useContext(UserContext);
  const [message, setMessage] = useState("");

  // show error message in toast
  const handleErrors = (err) => {
    console.log(err);
    setMessage({ msg: err.error, type: "danger" });
  };

  return (
    <Container fluid>
      <Router>
        <Row>
          <Navigation
            onLogOut={logout}
            loggedIn={loggedIn}
            user={user}
            login={login}
          />
        </Row>

        <Toast
          show={message !== ""}
          onClose={() => setMessage("")}
          delay={3000}
          autohide
        >
          <Toast.Body>{message?.msg}</Toast.Body>
        </Toast>

        <Switch>
          <Route path="/login">
            <Row className="vh-100 below-nav">
              {loggedIn ? <Redirect to="/" /> : <LoginPage />}
            </Row>
          </Route>
          <Route path="/public">
            <PublicTaskPage handleErrors={handleErrors} />
          </Route>
          <Route path="/online">
            <OnlinePage />
          </Route>
          <Route path="/assignment">
            {loggedIn ? (
              <AssignmentPage handleErrors={handleErrors} />
            ) : (
              <Redirect to="/login" />
            )}{" "}
          </Route>
          <Route path="/list/:filter">
            {loggedIn ? (
              <MyTaskPage handleErrors={handleErrors} />
            ) : (
              <Redirect to="/login" />
            )}
          </Route>
          <Route exact path="/">
            <Redirect to="/list/owned" />
          </Route>
        </Switch>
      </Router>
    </Container>
  );
};

export default Main;
