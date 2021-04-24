import { CssBaseline } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../../firebase";
import Api from "../../util/api.util";
import Message from "../Message";

function RoomDetails({ messageIds, channelId, isPrivate }) {
  const [messagesArray, setMessagesArray] = useState(null);
  const [pinnedMessages, setPinnedMessages] = useState([]);

  const [user] = useAuthState(auth);

  const getChannelPinnedMessages = async () => {
    try {
      let req = await Api.getPrivateChannelPinnedMessages(channelId);
      console.log(' req' , req)
      await getPinnedMessages(req.data.messageFirebaseIds);
    } catch (error) {
      console.log(error);
    }
  };

  const getPinnedMessages = async (pinnedMessages) => {
    const newArray = [];

    try {
      console.log(pinnedMessages)
      if (pinnedMessages.length > 0) {
        for (let msg of pinnedMessages) {
          let ref = db
            .collection(isPrivate ? "privaterooms" : "rooms")
            .doc(channelId)
            .collection("messages")
            .doc(msg);
          let temp = await ref.get()
          newArray.push(temp.data())          
        }
        setMessagesArray(newArray);
        
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
      {messagesArray &&
        messagesArray.length > 0 &&
        messagesArray.map((message) => {
          console.log(message);
          return (
            <>
              <h1>{message?.user}</h1>
            </>
          );
        })}
      {!messagesArray && <h1>Nothing here</h1>}
      <PinnedMessagesContainer></PinnedMessagesContainer>
      <MembersContainer></MembersContainer>
    </RoomDetailsContainer>
  );
}

export default RoomDetails;

const RoomDetailsContainer = styled.div`
  margin-top: 90px;
  border: 1px solid blue;
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: 75%;
`;

const PinnedMessagesContainer = styled.div`
  flex: 0.5;
  border: 1px soid yellow;
`;

const MembersContainer = styled.div`
  flex: 0.5;
`;

const RoomDetailsMembersContainer = styled.div``;
