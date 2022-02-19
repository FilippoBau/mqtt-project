import { Form, Button, Alert, Modal } from "react-bootstrap";
import { useContext, useState } from "react";
import { UserContext } from "../Context/UserContext";

const Login = ({ ...props }) => {
  const { login } = useContext(UserContext);

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage("");
    const credentials = { email, password };

    // basic validation
    let valid = true;
    if (email === "" || password === "" || password.length < 6) {
      valid = false;
      setErrorMessage(
        "Email cannot be empty and password must be at least six character long."
      );
      setShow(true);
    }

    if (valid) {
      login(credentials).catch((err) => {
        setErrorMessage(err);
        setShow(true);
      });
    }
  };
  return (
    <div className="flex justify-center items-center">
      <Form onSubmit={handleSubmit}>
        <Modal.Header>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert
            dismissible
            show={show}
            onClose={() => setShow(false)}
            variant="danger"
          >
            {errorMessage}
          </Alert>
          <Form.Group controlId="email">
            <Form.Label>email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit">Login</Button>
        </Modal.Footer>
      </Form>
    </div>
  );
};

export default Login;
