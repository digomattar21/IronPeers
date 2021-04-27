import React, { useContext, useState } from "react";
import { BrowserRouter as Router, Switch, Route, useHistory } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import styled from "styled-components";
import SideBar from "./components/SideBar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import Login from "./components/Login";
import Spinner from "react-spinkit";
import BookMarkedList from "./components/BookMarkedList";
import Loading from "./components/Loading";
import Api from "./util/api.util";
import Channel from "./components/Channel";
import Threads from "./components/Threads";
import PrivateChannel from "./components/PrivateChannel";
import Inbox from "./components/Inbox";
import Dm from "./components/Dm"

function App() {
  const [user, loading] = useAuthState(auth);
  const history = useHistory()

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="App">
      <Router>
        {user ? (
          <>
            <Header />
            <AppBody>
              <SideBar />
              <Switch>
                <Route exact path="/" component={Threads} />
                <Route exact path="/bookmarks" component={BookMarkedList} />
                <Route path="/channel/:channelId" exact component={Channel} />
                <Route
                  path="/channel/private/:channelId"
                  component={PrivateChannel}
                />
                <Route path="/inbox" component={Inbox} />
                <Route path="/user/directmessages/:dmId" component={Dm}/>
              </Switch>
            </AppBody>
          </>
        ) : (
          <Login />
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
