import { useHistory, useParams } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import CloseIcon from "@material-ui/icons/Close";
import LockIcon from "@material-ui/icons/Lock";
import { useSelector } from "react-redux";
import ChatInput from "../ChatInput";
import { auth, db } from "../../firebase";
import Message from "../Message";
import Api from "../../util/api.util";
import RoomDetails from "../RoomDetails";
import GroupIcon from "@material-ui/icons/Group";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import AddUsersModal from "../AddUsersModal";

function PrivateChannel() {
  const chatBottomRef = useRef(null);
  const { channelId } = useParams();
  const [user] = useAuthState(auth);
  const [displayDetails, setDisplayDetails] = useState(false);
  const [pinnedMessages, setPinnedMessages] = useState([]);
  const [buttonForExit, setButtonForExit] = useState(false);
  const [membersLength, setMembersLength] = useState(0);
  const [open, setOpen] = useState(false);
  const [showPrivateChannels, setShowPrivateChannels] = useState(true);
  const [updatedSideBar, setUpdatedSideBar] = useState(false);

  const [roomDetails] = useDocument(
    channelId && db.collection("privaterooms").doc(channelId)
  );

  const [roomMessages, loading] = useCollection(
    channelId &&
      db
        .collection("privaterooms")
        .doc(channelId)
        .collection("messages")
        .orderBy("timestamp", "asc")
  );

  const handleDetailsClick = async (e) => {
    try {
      if (channelId) {
        let req = await Api.getPrivateChannelPinnedMessages(channelId);
        let messageIds = req.data.messageFirebaseIds;
        console.log(messageIds)
        setPinnedMessages(messageIds);
        setDisplayDetails(true);
        setButtonForExit(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getPrivateChannelInfo = async () => {
    let payload = { channelId: channelId };
    try {
      if (channelId) {
        let req = await Api.getPrivateChannelMembersLength(channelId);
        console.log(req);
        setMembersLength(req.data.membersLength);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleExitDetailsClick = (e) => {
    setButtonForExit(false);
    setDisplayDetails(false);
  };

  useEffect(() => {
    chatBottomRef?.current?.scrollIntoView({
      behavior: "smooth",
    });
    getPrivateChannelInfo();
  }, [channelId, loading]);

  return (
    <ChannelContainer>
      {roomDetails && roomMessages && (
        <>
          <Header>
            <HeaderLeft>
              <div className="first-container">
                <LockIcon />
                <h4 style={{ marginLeft: "10px" }}>
                  {roomDetails?.data().name}
                </h4>
              </div>
              <div className="second-container">
                <GroupIcon />
                <h6> members : {membersLength}</h6>
              </div>
            </HeaderLeft>

            <HeaderRight>
              <div>
                <GroupAddIcon onClick={()=>handleOpen()} />
                <AddUsersModal
                  updatedSideBar={updatedSideBar}
                  setUpdatedSideBar={setUpdatedSideBar}
                  open={open}
                  setOpen={setOpen}
                  channelId={channelId}
                />
              </div>
              <div>
                {buttonForExit == false && (
                  <InfoOutlinedIcon onClick={handleDetailsClick} />
                )}
                {buttonForExit == true && (
                  <CloseIcon onClick={handleExitDetailsClick} />
                )}
              </div>
            </HeaderRight>
          </Header>

          {displayDetails == false && (
            <>
              <ChatMessages>
                {roomMessages?.docs.map((doc) => {
                  const { message, timestamp, user, userImage, fileDownloadUrl, likes } = doc.data();
                  return (
                    <Message
                      Private={true}
                      key={doc.id}
                      id={doc.id}
                      message={message}
                      user={user}
                      timestamp={timestamp}
                      userImage={userImage}
                      channelId={channelId}
                      channelName={roomDetails?.data().name}
                      fileDownloadUrl={fileDownloadUrl}
                      likes={likes}
                    />
                  );
                })}

                <ChatBottom ref={chatBottomRef} />
              </ChatMessages>
            </>
          )}
          {displayDetails && (
            <RoomDetails messageIds={pinnedMessages} channelId={channelId} isPrivate={true} />
          )}

          <ChatInput
            Private={true}
            chatBottomRef={chatBottomRef}
            channelId={channelId}
            channelName={roomDetails?.data().name}
          />
        </>
      )}
    </ChannelContainer>
  );
}

export default PrivateChannel;

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
  flex-direction: column;
  align-items: center;
  > .second-container {
    display: flex;
    align-items: center;
    margin-top: 5px;

    > h6 {
      color: darkgray;
    }

    > .MuiSvgIcon-root {
      font-size: 10px;
      color: darkgray;
      margin-right: 4px;
    }
  }

  > .first-container {
    display: flex;
    align-items: center;
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
    > h4 {
      font-weight: bold;
      display: flex;
      text-transform: lowercase;
      margin-right: 5px;
    }
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  :hover {
    opacity: 0.8;
    cursor: pointer;
  }
  > div {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: black;
    border: 2px solid darkgray;
    padding: 8px 12px;
    border-radius: 6px;
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
