import React, { useContext, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
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
import AuthContext from "./context/UserProvider/context";
import UserInfoContext from "./context/UserInfoProvider/context";
import Api from "./util/api.util";
import Channel from "./components/Channel";
import Threads from "./components/Threads";
import PrivateChannel from "./components/PrivateChannel";

function App() {
  const [user, loading] = useAuthState(auth);
  const [userAuth, setUserAuth] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const changeUserAuth = (value) => {
    setUserAuth(value);
  };

  const getUserInfo = async () => {
    try {
      let req = await Api.getUserInfo();
      req.data.user && setUserInfo(req.data.user);
      console.log("user", req.data.user);
      return req.data.user;
    } catch (err) {
      console.log(err.message);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider
      value={{ userAuth: userAuth, changeUserAuth: changeUserAuth }}
    >
      <UserInfoContext.Provider
        value={{ userInfo: userInfo, getUserInfo: getUserInfo }}
      >
        <div className="App">
          <Router>
            {user || userAuth ? (
              <>
                <Header />
                <AppBody>
                  <SideBar />
                  <Switch>
                    <Route exact path="/" component={Threads}/>
                    <Route exact path="/bookmarks" component={BookMarkedList}/>
                    <Route path="/channel/:channelId" exact component={Channel}/>
                    <Route path='/channel/private/:channelId' component={PrivateChannel}/>
                  </Switch>
                </AppBody>
              </>
            ) : (
              <Login />
            )}
          </Router>
        </div>
      </UserInfoContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;

const AppBody = styled.div`
  display: flex;
  height: 100vh;
`;
