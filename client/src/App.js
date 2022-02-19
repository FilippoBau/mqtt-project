import "bootstrap/dist/css/bootstrap.min.css";
import { React } from "react";
import "./App.css";
import Main from "./components/Main";
import ConnectionContextProvider from "./Context/ConnectionContext";
import UserContextProvider from "./Context/UserContext";

const App = () => {
  // Need to place <Router> above the components that use router hooks
  return (
    <ConnectionContextProvider>
      <UserContextProvider>
        <Main />
      </UserContextProvider>
    </ConnectionContextProvider>
  );
};

export default App;
