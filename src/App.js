import React from "react";
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

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <Loading/>
    );
  }

  return (
    <div className="App">
      <Router>
        {!user ? (
          <Login />
        ) : (
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
        )}
      </Router>
    </div>
  );
}

export default App;

const AppBody = styled.div`
  display: flex;
  height: 100vh;
`;

