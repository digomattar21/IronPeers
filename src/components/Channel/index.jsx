import { useHistory, useParams } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import StarOutlineIcon from "@material-ui/icons/StarOutline";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import CloseIcon from "@material-ui/icons/Close";

import { useSelector } from "react-redux";
import ChatInput from "../ChatInput";
import { selectRoomId } from "../../features/appSlice";
import { auth, db } from "../../firebase";
import Message from "../Message";
import Api from "../../util/api.util";
import RoomDetails from "../RoomDetails";

function Channel(props) {
  const chatBottomRef = useRef(null);
  const { channelId } = useParams();
  const [user] = useAuthState(auth);
  const [displayDetails, setDisplayDetails] = useState(false);
  const [pinnedMessages, setPinnedMessages] = useState([]);
  const [buttonForExit, setButtonForExit] = useState(false);

  const [roomDetails] = useDocument(
    channelId && db.collection("rooms").doc(channelId)
  );

  const [roomMessages, loading] = useCollection(
    channelId &&
      db
        .collection("rooms")
        .doc(channelId)
        .collection("messages")
        .orderBy("timestamp", "asc")
  );

  const handleDetailsClick = async (e) => {
    try {
      if (channelId) {
        let req = await Api.getPinnedMessages(channelId);
        let messageIds = req.data.messageFirebaseIds;
        setPinnedMessages(messageIds);
        setDisplayDetails(true);
        setButtonForExit(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleExitDetailsClick = (e) => {
    setButtonForExit(false);
    setDisplayDetails(false);
  };

  useEffect(() => {
    chatBottomRef?.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [channelId, loading]);

  return (
    <ChannelContainer>
      {roomDetails && roomMessages && (
        <>
          <Header>
            <HeaderLeft>
              <h4>#{roomDetails?.data().name}</h4>
              <StarOutlineIcon />
            </HeaderLeft>

            <HeaderRight>
              {buttonForExit == false && (
                <div onClick={handleDetailsClick}>
                  <InfoOutlinedIcon /> Details
                </div>
              )}
              {buttonForExit ==true && (
                <CloseIcon onClick={handleExitDetailsClick}/>
              )}
            </HeaderRight>
          </Header>

          {displayDetails==false && (
            <>
              <ChatMessages>
                {roomMessages?.docs.map((doc) => {
                  const { message, timestamp, user, userImage } = doc.data();
                  return (
                    <Message
                      key={doc.id}
                      id={doc.id}
                      message={message}
                      user={user}
                      timestamp={timestamp}
                      userImage={userImage}
                      channelId={channelId}
                      channelName={roomDetails?.data().name}
                    />
                  );
                })}

                <ChatBottom ref={chatBottomRef} />
              </ChatMessages>
            </>
          )}
          {displayDetails && (
            <RoomDetails messageIds={pinnedMessages} channelId={channelId} />
          )}

          <ChatInput
            chatBottomRef={chatBottomRef}
            channelId={channelId}
            channelName={roomDetails?.data().name}
          />
        </>
      )}
    </ChannelContainer>
  );
}

export default Channel;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid lightgray;
  position: fixed;
  background-color: white;
  width: 80%;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  > h4 {
    font-weight: bold;
    display: flex;
    text-transform: lowercase;
    margin-right: 5px;
  }

  > h4 > .MuiSvgIcon-root {
    margin-left: 10px;
    font-size: 18px;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 6px;
  border: 2px solid darkgray;
  :hover {
    opacity: 0.8;
    cursor: pointer;
  }
  > div {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: black;
  }

  > p > .MuiSvgIcon-root {
    margin-right: 5px !important;
    font-size: 16px;
  }
`;

const ChannelContainer = styled.div`
  flex: 0.7;
  flex-grow: 1;
  overflow-y: scroll;
  margin-top: 60px;
`;

const ChatMessages = styled.div`
  margin-top: 70px;
`;

const ChatBottom = styled.div`
  padding-bottom: 200px;
`;
