import { BrowserRouter as Router } from "react-router-dom";
import { useState, useEffect, createContext } from "react";

import "./App.css";
import AnimatedRoutes from "./components/common/AnimatedRoutes";

export const UserContext = createContext();

function App() {
  const date = new Date().getFullYear();
  const [userData, setUserData] = useState();
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const getData = async () => {
    try {
      const user = await JSON.parse(localStorage.getItem("user"));
      if (user && user !== undefined) {
        setUserData(user);
        setUserLoggedIn(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Add a function to update userData and localStorage
  const updateUserData = (newData) => {
    setUserData(newData);
    localStorage.setItem("user", JSON.stringify(newData));
  };

  return (
    <UserContext.Provider value={{ userData, userLoggedIn, updateUserData }}>
      <div className="App">
        <Router>
          <div className="content">
            <AnimatedRoutes />
          </div>
          <footer className="bg-light text-center text-lg-start">
            <div className="text-center p-3">
              © {date} Copyright: LearnHub
            </div>
          </footer>
        </Router>
      </div>
    </UserContext.Provider>
  );
}

export default App;


