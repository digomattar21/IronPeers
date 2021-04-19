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
import FileCopyIcon from "@material-ui/icons/FileCopy";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import LockIcon from "@material-ui/icons/Lock";
import AddIcon from "@material-ui/icons/Add";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "@material-ui/core";
import Api from "../../util/api.util";
import CreateChannelModal from "../CreateChannelModal";

function SideBar(props) {
  const [addChannelInputBool, setAddChannelInputBool] = useState(false);
  const [message, setMessage] = useState(null);
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);
  const [joinedChannels, setJoinedChannels] = useState([]);
  const [favoriteChannels, setFavoriteChannels] = useState([]);
  const [privateChannels, setPrivateChannels] = useState([]);
  const [showChannels, setShowChannels] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false);
  const [showPrivateChannels, setShowPrivateChannels] = useState(true);
  const [updatedSideBar, setUpdatedSideBar] = useState(false);
  const [hasUnread, setHasUnread] = useState(null)

  const handleChange = (e) => {
    if (e.target) {
      setSearchValue(e.target.value);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };


  const getUserChannels = async () => {
    let payload = { userEmail: user.email };
    try {
      let req = await Api.getUserChannels(payload);
      console.log(req)
      setJoinedChannels(req.data.joinedChannels);
      setFavoriteChannels(req.data.favoriteChannels);
      setPrivateChannels(req.data.privateChannels);
      setHasUnread(req.data.hasUnread)
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowChannelsClick = () => {
    setShowChannels(!showChannels);
  };

  const handleShowPrivateChannelsClick = () => {
    setShowPrivateChannels(!showPrivateChannels);
  };

  useEffect(() => {
    getUserChannels();
  }, [updatedSideBar]);

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

      <Link href="/" style={{ textDecoration: "none", color: "black" }}>
        <SideBarOption Icon={InsertCommentIcon} title="Community Threads" />
      </Link>
      <Link href="/inbox" style={{ textDecoration: "none", color: "black" }}>
        <InboxContainer>
          <SideBarOption Icon={InboxIcon} title="Inbox" />
          {hasUnread==true && <FiberManualRecordIcon className="record-icon"/>}
        </InboxContainer>
      </Link>
      <SideBarOption Icon={DraftsIcon} title="Saved" />
      <a href="/bookmarks" style={{ textDecoration: "none", color: "black" }}>
        <SideBarOption Icon={BookmarkBorderIcon} title="My Bookmarks" />
      </a>
      <SideBarOption Icon={PeopleAltIcon} title="User groups & People" />
      <SideBarOption Icon={FileCopyIcon} title="Files" />

      <hr />

      <ModalContainer>
        <SideBarOption
          Icon={AddIcon}
          title="Create New Channel"
          handleOpen={handleOpen}
        />
        <CreateChannelModal
          updatedSideBar={updatedSideBar}
          setUpdatedSideBar={setUpdatedSideBar}
          open={open}
          setOpen={setOpen}
        />
      </ModalContainer>
      <hr />

      <SideBarOption Icon={StarBorderIcon} title="Favorite Channels" />

      {favoriteChannels.length > 0 &&
        favoriteChannels.map((channel) => {
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

      {showChannels && (
        <div onClick={() => handleShowChannelsClick()}>
          <SideBarOption Icon={ExpandLessIcon} title="Joined Channels" />
        </div>
      )}

      {!showChannels && (
        <div onClick={() => handleShowChannelsClick()}>
          <SideBarOption Icon={ExpandMoreIcon} title="Joined Channels" />
        </div>
      )}

      {joinedChannels.length > 0 &&
        showChannels &&
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

      {showPrivateChannels == true && (
        <div onClick={() => handleShowPrivateChannelsClick()}>
          <SideBarOption Icon={ExpandLessIcon} title="Private Channels" />
        </div>
      )}

      {showPrivateChannels == false && (
        <div onClick={() => handleShowPrivateChannelsClick()}>
          <SideBarOption Icon={ExpandMoreIcon} title="Private Channels" />
        </div>
      )}

      {privateChannels.length > 0 &&
        showPrivateChannels == true &&
        privateChannels.map((channel) => {
          return (
            <Link href={`/channel/private/${channel.firebaseId}`}>
              <SideBarOption
                Icon={LockIcon}
                key={channel.firebaseId}
                id={channel.firebaseId}
                title={channel.name}
              />
            </Link>
          );
        })}
    </SideBarContainer>
  );
}

export default SideBar;

const InboxContainer = styled.div`
  display: flex;
  align-items: center;
  >.MuiSvgIcon-root {
    color: red;
    font-size: 8px;
    margin-left: 2px;
    padding-bottom:4px;
  }
  :hover{
    background-color: white;
  }

`;

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

const ModalContainer = styled.div`
  > div {
    display: flex;
    align-items: center;
    > h6 {
      margin-right: 5px;
      color: white;
    }

    > .MuiSvgIcon-root {
      color: black;
    }
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
