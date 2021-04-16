import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import CreateIcon from "@material-ui/icons/Create";
import SideBarOption from "../SideBarOption";
import InsertCommentIcon from "@material-ui/icons/InsertComment";
import InboxIcon from "@material-ui/icons/Inbox";
import DraftsIcon from "@material-ui/icons/Drafts";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import AppsIcon from "@material-ui/icons/Apps";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import StarBorderIcon from '@material-ui/icons/StarBorder';
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AddIcon from "@material-ui/icons/Add";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "@material-ui/core";
import AuthContext from "../../context/UserProvider/context";
import Api from "../../util/api.util";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

function SideBar(props) {
  const [addChannelInputBool, setAddChannelInputBool] = useState(false);
  const [message, setMessage] = useState(null);
  const [user] = useAuthState(auth);
  const { userAuth, changeUserAuth } = useContext(AuthContext);
  const [username, setUsername] = useState(null);
  const [joinedChannels, setJoinedChannels] = useState([]);
  const [favoriteChannels, setFavoriteChannels] = useState([]);
  const [showChannels, setShowChannels] = useState(true);

  const getUserInfo = async () => {
    try {
      let req = await Api.getUserInfo();
      console.log(req);
      setUsername(req.data.userAuth.username);
    } catch (error) {
      setMessage(error);
      changeUserAuth(false);
    }
  };

  const getUserChannels = async () => {
    let payload = { userEmail: user.email };
    try {
      let req = await Api.getUserChannels(payload);
      setJoinedChannels(req.data.joinedChannels);
      setFavoriteChannels(req.data.favoriteChannels);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    !user && getUserInfo();
    getUserChannels();
  }, []);

  return (
    <SideBarContainer>
      <SideBarHeader>
        <SideBarInfo>
          <h2>{"Ironpeers".toUpperCase()}</h2>
          <h3>
            <FiberManualRecordIcon />
            {user?.displayName || username}
            {message && <h5>{message}</h5>}
          </h3>
        </SideBarInfo>
        <CreateIcon />
      </SideBarHeader>

      <Link href="/">
        <SideBarOption Icon={InsertCommentIcon} title="Threads" />
      </Link>
      <SideBarOption Icon={InboxIcon} title="Inbox" />
      <SideBarOption Icon={DraftsIcon} title="Saved" />
      <a href="/bookmarks">
        <SideBarOption Icon={BookmarkBorderIcon} title="My Bookmarks" />
      </a>
      <SideBarOption Icon={PeopleAltIcon} title="User groups & People" />
      <SideBarOption Icon={AppsIcon} title="Apps" />
      <SideBarOption Icon={FileCopyIcon} title="Files" />
      <SideBarOption Icon={ExpandLessIcon} title="Show Less" />

      <hr />

      <SideBarOption Icon={ExpandMoreIcon} title="Channels" />

      <hr />

      <SideBarOption
        Icon={AddIcon}
        title="Create New Channel"
        addChannel
        addChannelInputBool={addChannelInputBool}
        setAddChannelInputBool={setAddChannelInputBool}
      />
      <hr />
      <SideBarOption Icon={ExpandMoreIcon} title="Joined Channels" />

      {joinedChannels.length > 0 &&
        joinedChannels.map((channel) => {
          return (
            <Link href={`/channel/${channel.firebaseId}`}>
              <SideBarOption
                key={channel.firebaseId}
                id={channel.firebaseId}
                title={channel.name}
              />
            </Link>
          );
        })}

        <>
          <SideBarOption Icon={StarBorderIcon} title="Favorite Channels" />
          
        </>

      {favoriteChannels.length > 0 && (
        favoriteChannels.map((channel)=>{
          return(
            <Link href={`/channel/${channel.firebaseId}`}>
              <SideBarOption
                key={channel.firebaseId}
                id={channel.firebaseId}
                title={channel.name}
              />
            </Link>
          )
        })
      )}
    </SideBarContainer>
  );
}

export default SideBar;

const SideBarContainer = styled.div`
  color: black;
  background-color: var(--ironblue-color);
  flex: 0.2;
  border-top: 1px solid var(--ironblue-color);
  max-width: 260px;
  margin-top: 44px;

  > hr {
    margin-top: 10px;
    margin-bottom: 10px;
    border: 1px solid #aaeced;
  }
`;

const SideBarHeader = styled.div`
  display: flex;
  border-bottom: 1px solid red var(--ironblue-color);
  padding: 13px;

  > .MuiSvgIcon-root {
    padding: 8px;
    color: #49274b;
    font-size: 18px;
    background-color: white;
    border-radius: 50%;
    cursor: pointer;
  }
`;

const SideBarInfo = styled.div`
  flex: 1;
  > h2 {
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 5px;
  }

  > h3 {
    display: flex;
    font-size: 13px;
    font-weight: 400;
    align-items: center;
  }

  > h3 > .MuiSvgIcon-root {
    font-size: 14px;
    margin-top: 1px;
    margin-right: 2px;
    color: green;
  }
`;
