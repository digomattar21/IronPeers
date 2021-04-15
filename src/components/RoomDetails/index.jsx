import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../../firebase";
import Api from '../../util/api.util'

function RoomDetails({ messageIds,channelId }) {


  const [messagesArray, setMessagesArray] = useState(null)



  const getPinnedMessages = () => {

    try {
      if (messageIds.length>0){
        let newArray=[]
        
          messageIds.map((id)=>{
            let docRef = db.collection("rooms").doc(channelId).collection("messages").doc(id);
            console.log(docRef)
            docRef.get()
            .then((doc)=>{
              newArray.push(doc._delegate._document.data.partialValue.mapValue.fields)
            }).catch((err=>console.log(err)))
          });
          
          setMessagesArray(newArray)
          console.log(messagesArray) 
      }

    } catch (error) {
      console.log(error)
    }

  };

  useEffect(() => {
    getPinnedMessages();
  }, []);




  return (
    <RoomDetailsContainer>
      <RoomDetailsHeader>
          
      </RoomDetailsHeader>

      <RoomDetailsLowerContainer>

      </RoomDetailsLowerContainer>
    </RoomDetailsContainer>
  );
}

export default RoomDetails;

const RoomDetailsContainer = styled.div``;

const RoomDetailsHeader = styled.div``;

const RoomDetailsLowerContainer = styled.div``;

const RoomDetailsPinnedMessagesContainer = styled.div``;

const RoomDetailsMembersContainer = styled.div``;
