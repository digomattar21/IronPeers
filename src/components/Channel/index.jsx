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
import StarIcon from "@material-ui/icons/Star";
import SimplePopover from "../Popover";

function Channel() {
  const chatBottomRef = useRef(null);
  const { channelId } = useParams();
  const [user] = useAuthState(auth);
  const [displayDetails, setDisplayDetails] = useState(false);
  const [buttonForExit, setButtonForExit] = useState(false);
  const [fullStar, setFullStar] = useState(false);

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

  const handleDetailsClick = (e) => {
    setButtonForExit(true);
    setDisplayDetails(true);
  };

  const handleFavoriteChannelClick = async () => {
    const payload = { userEmail: user.email, channelId: channelId };
    try {
      setFullStar(true);
      await Api.setFavoriteChannel(payload);
    } catch (err) {
      console.log(err);
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
              {!fullStar && (
                <StarOutlineIcon onClick={() => handleFavoriteChannelClick()} />
              )}
              {fullStar && <StarIcon />}
            </HeaderLeft>

            <HeaderRight>
              {buttonForExit == false && (
                <div onClick={(e) => handleDetailsClick(e)}>
                  <InfoOutlinedIcon /> Details
                </div>
              )}
              {buttonForExit == true && (
                <CloseIcon onClick={(e) => handleExitDetailsClick(e)} />
              )}
            </HeaderRight>
          </Header>

          {!displayDetails && (
            <>
              <ChatMessages>
                {roomMessages?.docs.map((doc) => {
                  const {
                    message,
                    timestamp,
                    user,
                    userImage,
                    fileDownloadUrl,
                    replies,
                    likes,
                  } = doc.data();
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
                      fileDownloadUrl={fileDownloadUrl}
                      replies={replies}
                      likes={likes}
                      Private={false}
                    />
                  );
                })}

                <ChatBottom ref={chatBottomRef} />
              </ChatMessages>
              <ChatInput
                chatBottomRef={chatBottomRef}
                channelId={channelId}
                channelName={roomDetails?.data().name}
                Private={false}
              />
            </>
          )}
          {displayDetails && (
            <div style={{marginTop: '80px'}}>
            <RoomDetails channelId={channelId} isPrivate={false} />
            </div>
          )}
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
  z-index: 1;
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

  > .MuiSvgIcon-root {
    margin-left: 1px;
    font-size: 20px;
    color: green;
    :hover {
      cursor: pointer;
      transform: scale(1.05);
      opacity: 0.8;
    }
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
  margin-top: 48px;
`;

const ChatMessages = styled.div`
  margin-top: 70px;
`;

const ChatBottom = styled.div`
  padding-bottom: 200px;
`;
