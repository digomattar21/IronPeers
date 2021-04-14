import React, { useState } from "react";
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
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AddIcon from "@material-ui/icons/Add";
import {useCollection} from 'react-firebase-hooks/firestore';
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function SideBar() {
  const [addChannelInputBool, setAddChannelInputBool] = useState(false);
  const [channels, loading, error ] = useCollection(db.collection("rooms"));
  const [user] = useAuthState(auth)


  return (
    <SideBarContainer>
      <SideBarHeader>
        <SideBarInfo>
          <h2>{"IronDump".toUpperCase()}</h2>
          <h3>
            <FiberManualRecordIcon />
            {user?.displayName}
          </h3>
        </SideBarInfo>
        <CreateIcon />
      </SideBarHeader>

      <SideBarOption Icon={InsertCommentIcon} title="Threads" />
      <SideBarOption Icon={InboxIcon} title="Inbox" />
      <SideBarOption Icon={DraftsIcon} title="Saved" />
      <SideBarOption Icon={BookmarkBorderIcon} title="Channel Browser" />
      <SideBarOption Icon={PeopleAltIcon} title="User groups & People" />
      <SideBarOption Icon={AppsIcon} title="Apps" />
      <SideBarOption Icon={FileCopyIcon} title="Files" />
      <SideBarOption Icon={ExpandLessIcon} title="Show Less" />

      <hr />

      <SideBarOption Icon={ExpandMoreIcon} title="Channels" />

      <hr />

      <SideBarOption
        Icon={AddIcon}
        title="Add Channel"
        addChannel
        addChannelInputBool={addChannelInputBool}
        setAddChannelInputBool={setAddChannelInputBool}
      />

      {channels?.docs.map(channel=>{
        return (<SideBarOption key={channel.id} id={channel.id} title={channel.data().name}/>)
      })}

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
  margin-top: 60px;

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
