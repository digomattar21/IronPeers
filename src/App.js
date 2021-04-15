import React, { useContext, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import styled from "styled-components";
import SideBar from "./components/SideBar";
import Chat from "./components/Chat";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import HomeScreen from "./components/HomeScreen";
import Login from "./components/Login";
import Spinner from "react-spinkit";
import BookMarkedList from "./components/BookMarkedList";
import Loading from "./components/Loading";
import AuthContext from './context/UserProvider/context'

function App() {
  const [user, loading] = useAuthState(auth);
  const [userAuth, setUserAuth] = useState(false);
  
  const changeUserAuth = (value) => {
    setUserAuth(value);
  };

  if (loading) {
    return (
      <Loading/>
    );
  }

  return (
    <AuthContext.Provider
        value={{ userAuth: userAuth, changeUserAuth: changeUserAuth }}
      >
    <div className="App">
      <Router>
        ({(user || userAuth) ? (
          <>
            <Header />
            <AppBody>
              <SideBar />
              <Switch>
                <Route exact path="/">
                  <Chat />
                </Route>
                <Route exact path='/bookmarks'>
                  <BookMarkedList />
                </Route>
              </Switch>
            </AppBody>
          </>
          
        ) : (
          <Login />
          
        )}
      </Router>
    </div>
    </AuthContext.Provider>
  );
}

export default App;

const AppBody = styled.div`
  display: flex;
  height: 100vh;
`;

