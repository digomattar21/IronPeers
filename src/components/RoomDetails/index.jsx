import React, { useEffect, useState } from "react";
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from "styled-components";
import { auth, db } from "../../firebase";
import Api from "../../util/api.util";
import Message from "../Message";

function RoomDetails({ messageIds, channelId, isPrivate }) {
  const [messagesArray, setMessagesArray] = useState(null);
  const [user] = useAuthState(auth);

  const getPinnedMessages = () => {
    try {
      if (messageIds.length > 0) {
        let newArray = [];

        if (isPrivate){
          messageIds.map((id) => {
            let docRef = db
              .collection("privaterooms")
              .doc(channelId)
              .collection("messages")
              .doc(id);
    
            docRef
              .get()
              .then((doc) => {
                newArray.push(doc.data());
              })
              .catch((err) => console.log(err));
          });
        }else{
          console.log('not prive')
          messageIds.map((id) => {
            let docRef = db
              .collection("rooms")
              .doc(channelId)
              .collection("messages")
              .doc(id);
    
            docRef
              .get()
              .then((doc) => {
                console.log(doc.data())
                newArray.push(doc.data());
              })
              .catch((err) => console.log(err));
          });
        }

        setMessagesArray(newArray);
      }
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    getPinnedMessages();
  }, []);

  return (
    <RoomDetailsContainer>
      <PinnedMessagesContainer>
        
      </PinnedMessagesContainer>
      <MembersContainer>
      {messagesArray && messagesArray.length > 0 &&
          messagesArray.map((message) => {
            return (
              <>
                <h1>{message.message}</h1>
              </>
            );
          })}
      </MembersContainer>
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
  border: 1px solid orange;
`;

const RoomDetailsMembersContainer = styled.div``;