import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import StarOutlineIcon from "@material-ui/icons/StarOutline";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import { useSelector } from "react-redux";
import ChatInput from "../ChatInput";
import { selectRoomId } from "../../features/appSlice";
import { auth, db } from "../../firebase";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import Message from "../Message";
import { useAuthState } from "react-firebase-hooks/auth";
import Api from "../../util/api.util";
import RoomDetails from "../RoomDetails";

function Chat() {
  const chatBottomRef = useRef(null);
  const [user] = useAuthState(auth);

  const [displayDetails, setDisplayDetails] = useState(false);
  const [pinnedMessages, setPinnedMessages] = useState([]);

  const roomId = useSelector(selectRoomId);
  const [roomDetails] = useDocument(
    roomId && db.collection("rooms").doc(roomId)
  );
  const [roomMessages, loading] = useCollection(
    roomId &&
      db
        .collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
  );

  const handleDetailsClick = async (e) => {
    try {
      if (roomId) {
        let req = await Api.getPinnedMessages(roomId);
        let messageIds = req.data.messageFirebaseIds;
        setPinnedMessages(messageIds)
        setDisplayDetails(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    chatBottomRef?.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [roomId, loading]);

  return (
    <ChatContainer>
      {roomDetails && roomMessages && (
        <>
          <Header>
            <HeaderLeft>
              <h4>#{roomDetails?.data().name}</h4>
              <StarOutlineIcon />
            </HeaderLeft>

            <HeaderRight onClick={(e) => handleDetailsClick(e)}>
              <p>
                <InfoOutlinedIcon /> Details
              </p>
            </HeaderRight>
          </Header>

          {!displayDetails && (
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
                      channelId={roomId}
                      channelName={roomDetails?.data().name}
                    />
                  );
                })}

                <ChatBottom ref={chatBottomRef} />
              </ChatMessages>
            </>
          )}
          {displayDetails && (
            <RoomDetails messageIds={pinnedMessages} />
          )}

          <ChatInput
            chatBottomRef={chatBottomRef}
            channelId={roomId}
            channelName={roomDetails?.data().name}
          />
        </>
      )}
    </ChatContainer>
  );
}

export default Chat;

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
  > p {
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

const ChatContainer = styled.div`
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
