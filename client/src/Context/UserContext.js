import { createContext, useEffect, useState } from "react";
import API from "../API";

export const UserContext = createContext();

const UserContextProvider = ({ ...props }) => {
  const { children } = props;

  const [loggedIn, setLoggedIn] = useState(false); // at the beginning, no user is logged in
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setUser(user);
      setLoggedIn(true);
    } catch (err) {
      // error is handled and visualized in the login form, do not manage error, throw it
      throw err;
    }
  };

  const logout = async () => {
    try {
      await API.logOut();
      // clean up everything
      setLoggedIn(false);
      setUser(null);
      localStorage.removeItem("userId");
      localStorage.removeItem("email");
      localStorage.removeItem("username");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // check if user is authenticated
    const checkAuth = async () => {
      try {
        // here you have the user info, if already logged in
        const authenticated = await API.getUserInfo();
        if (authenticated) {
          setUser({
            id: localStorage.getItem("userId"),
            name: localStorage.getItem("username"),
          });
          setLoggedIn(true);
          setLoading(false);
        } else {
          setLoggedIn(false);
          setLoading(false);
          localStorage.removeItem("userId");
          localStorage.removeItem("email");
          localStorage.removeItem("username");
        }
      } catch (err) {
        console.log(err.error); // mostly unauthenticated user
      }
    };
    checkAuth();
  }, []);

  return (
    <UserContext.Provider value={{ login, logout, loggedIn, user }}>
      {!loading && children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
