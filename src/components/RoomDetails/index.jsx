import { CssBaseline } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import styled, { keyframes } from "styled-components";
import { auth, db } from "../../firebase";
import Api from "../../util/api.util";
import Message from "../Message";
import NotListedLocationIcon from "@material-ui/icons/NotListedLocation";
import PinnedMessage from "../PinnedMessage";
import CachedIcon from "@material-ui/icons/Cached";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import MemberCard from "../MemberCard";
import CircularProgress from '@material-ui/core/CircularProgress';

function RoomDetails({ channelId, isPrivate }) {
  const [messagesArray, setMessagesArray] = useState(null);
  const [membersArray, setMembersArray] = useState(null);
  const [user] = useAuthState(auth);

  const getChannelPinnedMessages = async () => {
    let payload = {isPrivate:isPrivate, channelId: channelId}
    try {
      let req = await Api.getPrivateChannelPinnedMessages(payload);
      let req2 = await Api.getChannelMembers(payload);
      await getPinnedMessages(req.data.messageFirebaseIds);
      await getMembersInfo(req2.data.members)
      
    } catch (error) {
      console.log(error);
    }
  };

  const getMembersInfo = async (members) => {
    try {
      let payload = {members:members}
      let req = await Api.getMemberInfo(payload)
      setMembersArray(req.data.info)    

    } catch (error) {
      console.log(error)
    }
  }

  const getPinnedMessages = async (pinnedMessages) => {
    const newArray = [];

    try {
      if (pinnedMessages.length > 0) {
        for (let msg of pinnedMessages) {
          let ref = db
            .collection(isPrivate ? "privaterooms" : "rooms")
            .doc(channelId)
            .collection("messages")
            .doc(msg);
          let temp = await ref.get();
          newArray.push(temp.data());
        }
        setMessagesArray(newArray);
      }else{
        setMessagesArray([])
      }
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    getChannelPinnedMessages();
  }, []);

  return (
    <RoomDetailsContainer>
      <PinnedMessagesContainer>
        <PinnedMessagesHeaderContainer>
          <h2>Pinned Messages </h2>
          <NotListedLocationIcon />
        </PinnedMessagesHeaderContainer>
        <PinnedMessagesList>
          {messagesArray &&
            messagesArray.length > 0 &&
            messagesArray.map((message) => {
              return (
                <PinnedMessage
                  message={message}
                  isPrivate={isPrivate}
                  channelId={channelId}
                />
              );
            })}
          {!messagesArray && <CircularProgress style={{marginTop: '80px', color: 'var(--ironblue-color)'}}/>}
        </PinnedMessagesList>
      </PinnedMessagesContainer>
      <MembersContainer>
        <MembersHeaderContainer>
          <h2>Members</h2>
          <PeopleAltIcon />
        </MembersHeaderContainer>
        <MembersList>
        {membersArray && membersArray.length>0 &&(
          membersArray.map((member)=>{
            let {username, profilePic, email} = member;
            return(
              <MemberCard username={username} profilePic={profilePic} email={email}/>
            )
          })
        )}
        {!membersArray && <CircularProgress style={{marginTop: '80px', color: 'var(--ironblue-color)'}}/>}
        </MembersList>
      </MembersContainer>
    </RoomDetailsContainer>
  );
}

export default RoomDetails;

const RoomDetailsContainer = styled.div`
  margin-top: 90px;
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: 100%;
`;

const PinnedMessagesHeaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  > h2 {
    color: var(--ironblue-color);
    text-decoration: underline;

  }
  > .MuiSvgIcon-root {
    margin-left: 10px;
    color: var(--ironblue-color);
  }
`;

const spinAnimation = keyframes`
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }

`;

const PinnedMessagesList = styled.div`
  margin-top: 30px;
  height: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .cachedIcon {
    color: var(--ironblue-color);
    font-size: 32px;
    animation-name: ${spinAnimation};
    animation-duration: 2s;
    animation-iteration-count: infinite;
  }
`;

const PinnedMessagesContainer = styled.div`
  flex: 0.5;
  border-right: 1px solid lightgray;
`;

const MembersContainer = styled.div`
  flex: 0.5;
`;

const MembersHeaderContainer = styled.div`
  display: flex;
  align-items: center;

  justify-content: center;
  > h2 {
    color: var(--ironblue-color);
    text-decoration: underline;
  }
  > .MuiSvgIcon-root {
    margin-left: 10px;
    color: var(--ironblue-color);
  }
`;

const MembersList = styled.div`
  margin-top: 30px;
  height: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .cachedIcon {
    color: var(--ironblue-color);
    font-size: 32px;
    animation-name: ${spinAnimation};
    animation-duration: 2s;
    animation-iteration-count: infinite;
  }
`;
